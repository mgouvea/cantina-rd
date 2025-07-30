"use client";

import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Text from "../text/Text";
import { capitalizeFirstLastName } from "@/utils";
import { CreateOrderDto, ProductItem } from "@/types/orders";
import { Products } from "@/types";
import { useAddManyOrders } from "@/hooks/mutations";
import { useFieldArray, useForm } from "react-hook-form";
import { useGroupFamilyStore, useUserStore } from "@/contexts";
import { useProducts } from "@/hooks/queries";

import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

// Interface para representar múltiplas ordens de compra
interface MultipleOrdersForm {
  orders: CreateOrderDto[];
}

const INITIAL_ORDER_FORM_VALUES: CreateOrderDto = {
  buyerId: "",
  groupFamilyId: "",
  products: [],
  totalPrice: 0,
  createdAt: new Date().toISOString().split("T")[0], // Data atual como padrão
};

export const FormNewOrders = ({ onClickBack }: { onClickBack: () => void }) => {
  // Estado para armazenar o produto selecionado atualmente
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Formulário principal que contém um array de ordens
  const orderForm = useForm<MultipleOrdersForm>({
    defaultValues: {
      orders: [INITIAL_ORDER_FORM_VALUES],
    },
    mode: "onChange",
  });

  // Field array para gerenciar múltiplas ordens
  const { fields, append, remove } = useFieldArray({
    control: orderForm.control,
    name: "orders",
  });

  const { mutateAsync: addManyOrders } = useAddManyOrders();
  const { data: allProducts } = useProducts();
  const { allUsers } = useUserStore();
  const { allGroupFamilies } = useGroupFamilyStore();

  const {
    handleSubmit,
    formState: { isValid },
    watch,
    setValue,
    getValues,
  } = orderForm;

  // Função para adicionar um produto a uma ordem específica
  const addProductToOrder = (
    orderIndex: number,
    product: Products,
    quantity: number
  ) => {
    if (!product) return;

    const productItem: ProductItem = {
      _id: product._id || "",
      name: product.name,
      price: Number(product.price),
      quantity: quantity,
    };

    // Obter produtos atuais da ordem
    const currentOrders = getValues().orders;
    const currentProducts = currentOrders[orderIndex].products || [];

    // Adicionar novo produto
    setValue(`orders.${orderIndex}.products`, [
      ...currentProducts,
      productItem,
    ]);

    // Atualizar preço total
    const totalPrice = currentOrders[orderIndex].totalPrice || 0;
    setValue(
      `orders.${orderIndex}.totalPrice`,
      totalPrice + Number(product.price) * quantity
    );

    // Limpar seleção atual
    setSelectedProduct(null);
    setSelectedQuantity(1);
  };

  // Função para remover um produto de uma ordem
  const removeProductFromOrder = (orderIndex: number, productIndex: number) => {
    const currentOrders = getValues().orders;
    const currentProducts = [...currentOrders[orderIndex].products];

    // Calcular o preço a ser removido
    const productToRemove = currentProducts[productIndex];
    const priceToRemove = productToRemove.price * productToRemove.quantity;

    // Remover o produto
    currentProducts.splice(productIndex, 1);
    setValue(`orders.${orderIndex}.products`, currentProducts);

    // Atualizar o preço total
    const totalPrice = currentOrders[orderIndex].totalPrice || 0;
    setValue(`orders.${orderIndex}.totalPrice`, totalPrice - priceToRemove);
  };

  // Função para adicionar uma nova ordem
  const addNewOrder = () => {
    append({
      ...INITIAL_ORDER_FORM_VALUES,
      createdAt: new Date().toISOString().split("T")[0],
    });
  };

  // Função para remover uma ordem
  const removeOrder = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data: MultipleOrdersForm) => {
    setIsSubmitting(true);

    // Filter valid orders that have products and a buyer
    const validOrders = data.orders
      .filter(
        (order) => order.products && order.products.length > 0 && order.buyerId
      )
      .map((order) => {
        // Check if the buyer is a member of any group family
        if (allGroupFamilies && allGroupFamilies.length > 0) {
          // Find the group family where the buyer is a member
          const groupFamily = allGroupFamilies.find((group) =>
            group.members.some((member) => member.userId === order.buyerId)
          );

          // If found, add the groupFamilyId to the order
          if (groupFamily && groupFamily._id) {
            return { ...order, groupFamilyId: groupFamily._id };
          }
        }

        return order;
      });

    await addManyOrders(validOrders).then(() => {
      setIsSubmitting(false);
      onClickBack();
    });
  };

  return (
    <Box
      sx={{
        padding: { xs: 1, sm: 2 },
        height: "fit-content",
        width: "100%",
        overflowX: "auto",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Text variant="h5">Nova compra</Text>

        <Tooltip title="Voltar">
          <IconButton
            sx={{
              backgroundColor: "success.dark",
              "&:hover": {
                backgroundColor: "success.main",
                transition: "0.3s",
              },
            }}
            onClick={onClickBack}
          >
            <ArrowBackIcon fontSize="small" sx={{ color: "#fff" }} />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Mapear todas as ordens */}
      {fields.map((field, orderIndex) => (
        <Card key={field.id} sx={{ mb: 3, p: 1 }}>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Text variant="subtitle1">Ordem #{orderIndex + 1}</Text>

              {fields.length > 1 && (
                <IconButton
                  color="error"
                  onClick={() => removeOrder(orderIndex)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Stack>

            {/* Linha com comprador e data */}
            <Stack direction="row" spacing={2} mb={2}>
              <FormControl sx={{ flex: 1 }}>
                <Autocomplete
                  id={`buyer-select-${orderIndex}`}
                  options={allUsers || []}
                  autoHighlight
                  getOptionLabel={(option) =>
                    capitalizeFirstLastName(option.name)
                  }
                  value={allUsers?.find(
                    (user) => user._id === watch(`orders.${orderIndex}.buyerId`)
                  )}
                  onChange={(event, newValue) => {
                    if (!newValue) return;
                    setValue(`orders.${orderIndex}.buyerId`, newValue._id!);
                  }}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                      <Box
                        key={key}
                        component="li"
                        sx={{ "& > img": { flexShrink: 0 } }}
                        {...optionProps}
                        value={option._id}
                      >
                        <Avatar src={option.urlImage} alt={option.name} />
                        <Text variant="subtitle1" sx={{ ml: 2 }}>
                          {capitalizeFirstLastName(option.name)}
                        </Text>
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Comprador"
                      size="small"
                      slotProps={{
                        htmlInput: {
                          ...params.inputProps,
                          autoComplete: "new-password",
                        },
                      }}
                    />
                  )}
                />
              </FormControl>

              <TextField
                id={`date-field-${orderIndex}`}
                label="Data"
                variant="outlined"
                size="small"
                type="date"
                sx={{ flex: 0.5 }}
                value={watch(`orders.${orderIndex}.createdAt`)}
                onChange={(e) =>
                  setValue(`orders.${orderIndex}.createdAt`, e.target.value)
                }
              />
            </Stack>

            {/* adicionar produtos */}
            <Stack direction="row" spacing={2} mb={2}>
              <FormControl sx={{ flex: 1 }}>
                <Autocomplete
                  id={`product-select-${orderIndex}`}
                  options={allProducts || []}
                  autoHighlight
                  value={selectedProduct}
                  onChange={(event, newValue) => setSelectedProduct(newValue)}
                  getOptionLabel={(option: Products) => option.name}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                      <Box
                        key={key}
                        component="li"
                        {...optionProps}
                        value={option._id}
                      >
                        <Avatar
                          src={option.urlImage}
                          alt={option.name}
                          sx={{ mr: 1 }}
                        />
                        <Text variant="subtitle1">
                          {option.name} - R$ {Number(option.price).toFixed(2)}
                        </Text>
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Produto"
                      size="small"
                      slotProps={{
                        htmlInput: {
                          ...params.inputProps,
                          autoComplete: "new-password",
                        },
                      }}
                    />
                  )}
                />
              </FormControl>

              <TextField
                label="Quantidade"
                type="number"
                size="small"
                sx={{ width: 100 }}
                value={selectedQuantity}
                onChange={(e) =>
                  setSelectedQuantity(parseInt(e.target.value) || 1)
                }
                InputProps={{ inputProps: { min: 1 } }}
              />

              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                disabled={!selectedProduct}
                onClick={() =>
                  addProductToOrder(
                    orderIndex,
                    selectedProduct!,
                    selectedQuantity
                  )
                }
              >
                Adicionar
              </Button>
            </Stack>

            {/* Lista de produtos adicionados */}
            {watch(`orders.${orderIndex}.products`)?.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Produtos adicionados:
                </Typography>

                <List>
                  {watch(`orders.${orderIndex}.products`).map(
                    (product: ProductItem, productIndex: number) => (
                      <ListItem key={`${product._id}-${productIndex}`}>
                        <ListItemAvatar>
                          <Avatar>
                            <ShoppingCartIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={product.name}
                          secondary={`Quantidade: ${
                            product.quantity
                          } | Preço: R$ ${product.price.toFixed(
                            2
                          )} | Total: R$ ${(
                            product.price * product.quantity
                          ).toFixed(2)}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() =>
                              removeProductFromOrder(orderIndex, productIndex)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )
                  )}
                </List>

                <Typography variant="h6" align="right" sx={{ mt: 2 }}>
                  Total: R${" "}
                  {watch(`orders.${orderIndex}.totalPrice`).toFixed(2)}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      ))}

      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Button
          variant="outlined"
          color="success"
          startIcon={<AddIcon />}
          onClick={addNewOrder}
          sx={{ mt: 2 }}
        >
          Adicionar nova ordem de compra
        </Button>

        <Button
          variant="contained"
          color="success"
          startIcon={<SaveIcon />}
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || !isValid}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </Stack>
    </Box>
  );
};
