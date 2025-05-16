"use client";

import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import EmojiPeopleOutlinedIcon from "@mui/icons-material/EmojiPeopleOutlined";
import Loading from "@/app/components/loading/Loading";
import PeopleIcon from "@mui/icons-material/People";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TabelaCompras from "@/app/components/ui/tables/TabelaCompras";
import Text from "@/app/components/ui/text/Text";
import { a11yProps } from "@/utils";
import { CustomTabPanel, FormFaturas, useSnackbar } from "@/app/components";
import { GridRowModel } from "@mui/x-data-grid";
import { InvoiceDto } from "@/types/invoice";
import { useEffect, useState } from "react";
import { useInvoices } from "@/hooks/queries/useInvoices.query";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGroupFamily,
  useGroupFamilyWithOwner,
  useOrders,
  useOrdersVisitors,
  useUsers,
} from "@/hooks/queries";
import {
  Box,
  Stack,
  Tab,
  Tabs,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import TabelaComprasVisitors from "@/app/components/ui/tables/TabelaComprasVisitors";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Financeiro" },
];

export default function Faturas() {
  const { showSnackbar } = useSnackbar();

  const queryClient = useQueryClient();
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTab = searchParams.get("tab")
    ? parseInt(searchParams.get("tab")!)
    : 0;

  const [value, setValue] = useState<number>(initialTab);
  const [viewType, setViewType] = useState<"socios" | "visitantes">("socios");

  const { data, isLoading } = useOrders();
  const { data: dataVisitors, isLoading: isLoadingVisitors } =
    useOrdersVisitors();
  const { data: allInvoices, isLoading: isLoadingInvoices } = useInvoices();
  const { data: dataUser, isLoading: isLoadingUser } = useUsers();
  const { data: groupFamilies, isLoading: isLoadingGroupFamily } =
    useGroupFamily();

  const {
    data: groupFamiliesWithOwner,
    isLoading: isLoadingGroupFamilyWithOwner,
  } = useGroupFamilyWithOwner();

  const [allInvoicesIds, setAllInvoicesIds] = useState<string[] | null>(null);

  useEffect(() => {
    if (allInvoices && allInvoices.length > 0 && !isLoadingInvoices) {
      setAllInvoicesIds(allInvoices.map((invoice: InvoiceDto) => invoice._id));
    }
  }, [allInvoices, isLoadingInvoices]);

  const handleEditClick = (row: GridRowModel) => () => {
    console.log(row);
    router.replace("/financeiro/novo");
  };

  const handleDeleteClick = (orderId: string) => async () => {
    try {
      console.log(orderId);
      showSnackbar({
        message: "Fatura deletada com sucesso!",
        severity: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (error) {
      showSnackbar({
        message: "Erro ao deletar a fatura",
        severity: "error",
        duration: 3000,
      });
      console.error(error);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleViewTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewType: "socios" | "visitantes" | null
  ) => {
    // Prevent deselecting both options
    if (newViewType !== null) {
      setViewType(newViewType);
    }
  };

  const renderContent = () => {
    if (
      isLoading ||
      isLoadingGroupFamily ||
      isLoadingUser ||
      isLoadingGroupFamilyWithOwner ||
      isLoadingVisitors
    ) {
      return <Loading />;
    }

    return (
      <Stack>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
            sx={{
              "& .Mui-selected": {
                backgroundColor: "background.paper",
                color: "text.primary",
                fontWeight: "bold",
              },
              "& .Mui-selected:hover": {
                backgroundColor: "background.paper",
                color: "text.primary",
                fontWeight: "bold",
              },
              "& .MuiTab-root": {
                backgroundColor: "background.paper",
                color: "text.primary",
              },
            }}
          >
            <Tab icon={<ReceiptLongIcon />} label="Compras" {...a11yProps(0)} />
            <Tab icon={<PriceCheckIcon />} label="Faturas" {...a11yProps(1)} />
            <Tab
              icon={<AssuredWorkloadIcon />}
              label="Pagamentos"
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0} dir={theme.direction}>
          {viewType === "socios" ? (
            <TabelaCompras
              data={data}
              isLoading={isLoading}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
            />
          ) : (
            <TabelaComprasVisitors
              data={dataVisitors}
              isLoading={isLoadingVisitors}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
            />
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1} dir={theme.direction}>
          {viewType === "socios" ? (
            <FormFaturas
              groupFamilies={groupFamilies}
              dataUser={dataUser}
              allInvoicesIds={allInvoicesIds}
              groupFamiliesWithOwner={groupFamiliesWithOwner}
            />
          ) : (
            <Text variant="h6">
              Visão de Visitantes - Faturas (Em implementação)
            </Text>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2} dir={theme.direction}>
          {viewType === "socios" ? (
            <Text variant="h6">
              Visão de Sócios - Pagamentos (Em implementação)
            </Text>
          ) : (
            <Text variant="h6">
              Visão de Visitantes - Pagamentos (Em implementação)
            </Text>
          )}
        </CustomTabPanel>
      </Stack>
    );
  };

  return (
    <ContentWrapper breadcrumbItems={breadcrumbItems}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box /> {/* Empty box to maintain spacing */}
        <ToggleButtonGroup
          value={viewType}
          exclusive
          onChange={handleViewTypeChange}
          aria-label="tipo de visualização"
          size="medium"
          color="primary"
          sx={{
            width: "100%",
            "& .MuiToggleButton-root": {
              flex: 1,
              py: 1,
              fontSize: "0.9rem",
              fontWeight: "medium",
              "&.Mui-selected": {
                fontWeight: "bold",
              },
            },
          }}
        >
          <ToggleButton value="socios" aria-label="visão de sócios">
            <PeopleIcon sx={{ mr: 1 }} />
            Sócios
          </ToggleButton>
          <ToggleButton value="visitantes" aria-label="visão de visitantes">
            <EmojiPeopleOutlinedIcon sx={{ mr: 1 }} />
            Visitantes
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {renderContent()}
    </ContentWrapper>
  );
}
