"use client";
import Loading from "@/app/components/loading/Loading";
import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import {
  useGroupFamily,
  useGroupFamilyWithOwner,
  useOrders,
  useUsers,
} from "@/hooks/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { GridRowModel } from "@mui/x-data-grid";
import { CustomTabPanel, FormFaturas, useSnackbar } from "@/app/components";
import { Box, Stack, Tab, Tabs, useTheme } from "@mui/material";
import Text from "@/app/components/ui/text/Text";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import { a11yProps } from "@/utils";
import { useEffect, useState } from "react";
import TabelaCompras from "@/app/components/ui/tables/TabelaCompras";
import { useInvoices } from "@/hooks/queries/useInvoices.query";
import { InvoiceDto } from "@/types/invoice";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Financeiro" },
];

export default function Faturas() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();

  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab")
    ? parseInt(searchParams.get("tab")!)
    : 0;
  const [value, setValue] = useState<number>(initialTab);

  const { data: allInvoices, isLoading: isLoadingInvoices } = useInvoices();
  const { data, isLoading } = useOrders();
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

  const renderContent = () => {
    if (
      isLoading ||
      isLoadingGroupFamily ||
      isLoadingUser ||
      isLoadingGroupFamilyWithOwner
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
          <TabelaCompras
            data={data}
            dataUser={dataUser}
            isLoading={isLoading}
            groupFamilies={groupFamilies}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1} dir={theme.direction}>
          <FormFaturas
            groupFamilies={groupFamilies}
            dataUser={dataUser}
            allInvoicesIds={allInvoicesIds}
            groupFamiliesWithOwner={groupFamiliesWithOwner}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2} dir={theme.direction}>
          <Text variant="h5">Subcategorias</Text>
        </CustomTabPanel>
      </Stack>
    );
  };

  return (
    <ContentWrapper breadcrumbItems={breadcrumbItems}>
      {renderContent()}
    </ContentWrapper>
  );
}
