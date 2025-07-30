"use client";

import React, { useEffect, useState } from "react";
import Text from "../../components/ui/text/Text";
import { Box, Divider, IconButton, Stack, Tooltip } from "@mui/material";
import { useFullInvoices } from "@/hooks/mutations";
import { usePathname } from "next/navigation";
import { FullInvoiceResponse } from "@/types/invoice";
import { capitalizeFirstLastName, formatDate, formatDateTime } from "@/utils";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useSnackbar } from "@/app/components";

export default function FaturaCliente() {
  const { showSnackbar } = useSnackbar();
  const router = usePathname();
  const { mutateAsync: fullInvoice } = useFullInvoices();

  const [invoice, setInvoice] = useState<FullInvoiceResponse | null>(null);

  const handleFullInvoice = async () => {
    const id = router.split("/")[2];
    try {
      const responseData = await fullInvoice([id]);

      // Verificar se a resposta é um array e extrair o primeiro item
      const response = Array.isArray(responseData)
        ? responseData[0]
        : responseData;

      // Verificar se os dados essenciais estão presentes
      if (!response) {
        console.error("Resposta da API vazia");
      } else if (!response.consumidoresNomes) {
        console.error("Dados de consumidoresNomes ausentes na resposta");
      } else if (!response.orders) {
        console.error("Dados de orders ausentes na resposta");
      } else if (Object.keys(response.consumidoresNomes).length === 0) {
        console.error("consumidoresNomes está vazio");
      } else if (response.orders.length === 0) {
        console.error("orders está vazio");
      }

      setInvoice(response);
    } catch (error) {
      console.error("Error fetching invoice:", error);
    }
  };

  useEffect(() => {
    handleFullInvoice();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return `${d.getHours().toString().padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Stack>
      <Text variant="subtitle1" sx={{ fontWeight: "bold" }}>
        Cantina RD - Fatura
      </Text>

      <Text variant="subtitle2" sx={{ mt: 1 }}>
        <strong>
          Olá, {capitalizeFirstLastName(invoice?.ownerName) || "cliente"}!
        </strong>
        <br /> Uma nova fatura foi gerada no valor de R${" "}
        <strong>{invoice?.totalAmount?.toFixed(2) || "0.00"}</strong>.
      </Text>

      {invoice?.createdAt && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginTop: "0.5rem",
            width: "100%",
          }}
        >
          <Text variant="subtitle2">Data de emissão:</Text>
          <Box
            sx={{
              flex: 1,
              borderBottom: "1px dotted rgba(0, 0, 0, 0.42)",
              margin: "0 8px",
              marginTop: "0.5rem",
            }}
          />
          <Text variant="subtitle2">
            {formatDateTime(invoice?.createdAt)} h
          </Text>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "0.5rem",
          width: "100%",
        }}
      >
        <Text variant="subtitle2">Período correspondente:</Text>
        <Box
          sx={{
            flex: 1,
            borderBottom: "1px dotted rgba(0, 0, 0, 0.42)",
            margin: "0 8px",
            marginTop: "0.5rem",
          }}
        />
        <Text variant="subtitle2">
          {invoice
            ? `${formatDate(invoice.startDate)} a ${formatDate(
                invoice.endDate
              )}`
            : ""}
        </Text>
      </Box>

      <br />
      <Text variant="subtitle2" sx={{ fontWeight: "bold" }}>
        Detalhamento:
      </Text>
      <Divider />

      {!invoice && <Text>Carregando fatura...</Text>}

      {/* Se a fatura foi carregada mas não tem dados */}
      {invoice && (!invoice.consumidoresNomes || !invoice.orders) && (
        <Box sx={{ margin: 2 }}>
          <Text variant="subtitle1">
            Não foi possível carregar os dados da fatura.
          </Text>
          {!invoice.consumidoresNomes && (
            <Text>Dados de consumidores não disponíveis</Text>
          )}
          {!invoice.orders && <Text>Dados de pedidos não disponíveis</Text>}
        </Box>
      )}

      {/* Se a fatura foi carregada mas não tem pedidos */}
      {invoice && invoice.orders && invoice.orders.length === 0 && (
        <Box sx={{ margin: 2 }}>
          <Text variant="subtitle1">
            Não há itens para exibir nesta fatura.
          </Text>
        </Box>
      )}

      {/* Renderização dos itens da fatura */}
      {invoice &&
        invoice.consumidoresNomes &&
        invoice.orders &&
        invoice.orders.length > 0 && (
          <>
            {Object.entries(invoice.consumidoresNomes).map(
              ([buyerId, name]) => {
                // Filtrar ordens deste comprador
                const buyerOrders = invoice.orders.filter(
                  (order) => order.buyerId === buyerId
                );

                const debit = invoice.debitAmount!;

                if (buyerOrders.length === 0) return null;

                // Calcular total por pessoa
                const totalByPerson = buyerOrders.reduce(
                  (total, order) => total + order.totalPrice,
                  0
                );

                // Agrupar por data
                const ordersByDate = buyerOrders.reduce((acc, order) => {
                  const date = new Date(order.createdAt);
                  const dateStr = `${formatDate(date)} às ${formatTime(date)}`;

                  if (!acc[dateStr]) {
                    acc[dateStr] = [];
                  }
                  acc[dateStr].push(order);
                  return acc;
                }, {} as Record<string, typeof buyerOrders>);

                return (
                  <Box key={buyerId} sx={{ marginTop: 2, marginBottom: 2 }}>
                    {debit > 0 && (
                      <Text variant="subtitle2" sx={{ fontWeight: "bold" }}>
                        Debitos anteriores:{" "}
                        <Text
                          variant="subtitle2"
                          sx={{ fontWeight: "bold", color: "error.main" }}
                        >
                          R$ {debit.toFixed(2)}
                        </Text>
                      </Text>
                    )}

                    <Text
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", mt: 2 }}
                    >
                      Compras de {capitalizeFirstLastName(name)}:
                    </Text>

                    {Object.entries(ordersByDate).map(([dateStr, orders]) => {
                      // Calcular total por data
                      const totalByDate = orders.reduce(
                        (total, order) => total + order.totalPrice,
                        0
                      );

                      return (
                        <Box key={dateStr} sx={{ marginTop: 1, marginLeft: 1 }}>
                          <Text variant="subtitle2" sx={{ fontWeight: "bold" }}>
                            Data: {dateStr}
                          </Text>

                          {orders.flatMap((order) =>
                            order.products.map((product, productIndex) => (
                              <Box
                                key={`${order._id}-${productIndex}`}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginLeft: 1,
                                  width: "100%",
                                }}
                              >
                                <Text variant="subtitle2">
                                  {product.name}{" "}
                                  {product.quantity > 1
                                    ? `(${product.quantity}x)`
                                    : ""}
                                </Text>
                                <Box
                                  sx={{
                                    flex: 1,
                                    borderBottom:
                                      "1px dotted rgba(0, 0, 0, 0.42)",
                                    margin: "0 8px",
                                  }}
                                />
                                <Text variant="subtitle2">
                                  R$ {product.price.toFixed(2)}
                                </Text>
                              </Box>
                            ))
                          )}

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginLeft: 1,
                              width: "100%",
                              marginTop: 1,
                            }}
                          >
                            <Text
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                            >
                              Subtotal
                            </Text>
                            <Box
                              sx={{
                                flex: 1,
                                borderBottom: "1px dotted rgba(0, 0, 0, 0.42)",
                                margin: "0 8px",
                              }}
                            />
                            <Text
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                            >
                              R$ {totalByDate.toFixed(2)}
                            </Text>
                          </Box>
                        </Box>
                      );
                    })}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        marginTop: 2,
                      }}
                    >
                      <Text variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        Total {capitalizeFirstLastName(name)}
                      </Text>
                      <Box
                        sx={{
                          flex: 1,
                          borderBottom: "1px dotted rgba(0, 0, 0, 0.42)",
                          margin: "0 8px",
                        }}
                      />
                      <Text variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        R$ {totalByPerson.toFixed(2)}
                      </Text>
                    </Box>
                  </Box>
                );
              }
            )}

            {/* Total geral da fatura */}
            <Box sx={{ marginTop: 4, marginBottom: 2 }}>
              <Divider sx={{ marginBottom: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text variant="h6" sx={{ fontWeight: "bold" }}>
                  TOTAL GERAL
                </Text>
                <Box
                  sx={{
                    flex: 1,
                    borderBottom: "2px solid rgba(0, 0, 0, 0.87)",
                    margin: "0 8px",
                  }}
                />
                <Text variant="h6" sx={{ fontWeight: "bold" }}>
                  R$ {invoice.totalAmount?.toFixed(2) || "0.00"}
                </Text>
              </Box>

              {invoice.remaining !== undefined && invoice.remaining > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    marginTop: 1,
                  }}
                >
                  <Text
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", color: "error.main" }}
                  >
                    VALOR PENDENTE
                  </Text>
                  <Box
                    sx={{
                      flex: 1,
                      borderBottom: "1px dotted rgba(0, 0, 0, 0.42)",
                      margin: "0 8px",
                    }}
                  />
                  <Text
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", color: "error.main" }}
                  >
                    R$ {invoice.remaining.toFixed(2)}
                  </Text>
                </Box>
              )}
              <br />
              <Text variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Chave pix:
              </Text>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Text variant="subtitle1">tes.realezadivina@udv.org.br</Text>
                <Tooltip title="Copiar chave PIX" arrow>
                  <IconButton
                    size="small"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        "tes.realezadivina@udv.org.br"
                      );
                      showSnackbar({
                        message: "Chave PIX copiada com sucesso!",
                        severity: "success",
                        position: "bottom",
                      });
                    }}
                    sx={{ ml: 1 }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </>
        )}
    </Stack>
  );
}
