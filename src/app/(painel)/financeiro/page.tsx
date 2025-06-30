"use client";

import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import EmojiPeopleOutlinedIcon from "@mui/icons-material/EmojiPeopleOutlined";
import Loading from "@/app/components/loading/Loading";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import PeopleIcon from "@mui/icons-material/People";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TabelaCredito from "@/app/components/ui/tables/TabelaCredito";
import TabelaPagamentos from "@/app/components/ui/tables/TabelaPagamentos";
import { a11yProps } from "@/utils";
import { InvoiceDto } from "@/types/invoice";
import { Suspense, useEffect, useState } from "react";
import { useInvoices } from "@/hooks/queries/useInvoices.query";
import { usePayments } from "@/hooks/queries/payments.query";
import { useSearchParams } from "next/navigation";

import {
  ComprasVisitorsWrapper,
  ComprasWrapper,
  CustomTabPanel,
  FaturaWrapper,
} from "@/app/components";
import {
  useCredits,
  useGroupFamily,
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
import { useGroupFamilyStore, useUserStore } from "@/contexts";
import EmptyContent from "@/app/components/ui/emptyContent/EmptyContent";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Financeiro" },
];

function FaturasContent() {
  const theme = useTheme();
  const searchParams = useSearchParams();

  const initialTab = searchParams.get("tab")
    ? parseInt(searchParams.get("tab")!)
    : 0;

  const [value, setValue] = useState<number>(initialTab);
  const [viewType, setViewType] = useState<"socios" | "visitantes">("socios");

  const { data: dataOrders, isLoading: isLoadingOrders } = useOrders();
  const { data: dataVisitors, isLoading: isLoadingVisitors } =
    useOrdersVisitors();
  const { data: allInvoices, isLoading: isLoadingInvoices } = useInvoices();
  const { data: dataUser, isLoading: isLoadingUser } = useUsers();
  const { data: groupFamilies, isLoading: isLoadingGroupFamily } =
    useGroupFamily();
  const { data: payments, isLoading: isLoadingPayments } = usePayments();
  const { data: credits, isLoading: isLoadingCredits } = useCredits();

  const [allInvoicesIds, setAllInvoicesIds] = useState<string[] | null>(null);

  const { updateAllGroupFamilies } = useGroupFamilyStore();
  const { updateAllUsers } = useUserStore();

  useEffect(() => {
    if (allInvoices && allInvoices.length > 0 && !isLoadingInvoices) {
      setAllInvoicesIds(allInvoices.map((invoice: InvoiceDto) => invoice._id));
    }
  }, [allInvoices, isLoadingInvoices]);

  useEffect(() => {
    updateAllGroupFamilies(groupFamilies);
    updateAllUsers(dataUser);
  }, [groupFamilies, updateAllGroupFamilies, dataUser, updateAllUsers]);

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
      isLoadingOrders ||
      isLoadingGroupFamily ||
      isLoadingUser ||
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
            <Tab
              icon={<PaidOutlinedIcon />}
              label="Credito"
              {...a11yProps(3)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0} dir={theme.direction}>
          {viewType === "socios" ? (
            <ComprasWrapper data={dataOrders} isLoading={isLoadingOrders} />
          ) : (
            <ComprasVisitorsWrapper
              data={dataVisitors}
              isLoading={isLoadingVisitors}
            />
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1} dir={theme.direction}>
          {viewType === "socios" ? (
            <FaturaWrapper
              groupFamilies={groupFamilies}
              dataUser={dataUser}
              allInvoicesIds={allInvoicesIds}
            />
          ) : (
            <EmptyContent title="Visão de Visitantes - Faturas (Em implementação)" />
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2} dir={theme.direction}>
          {viewType === "socios" ? (
            isLoadingPayments ? (
              <Loading />
            ) : (
              <TabelaPagamentos data={payments || []} isLoading={false} />
            )
          ) : (
            <EmptyContent title="Visão de Visitantes - Pagamentos (Em implementação)" />
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3} dir={theme.direction}>
          {viewType === "socios" ? (
            isLoadingCredits ? (
              <Loading />
            ) : (
              <TabelaCredito data={credits || []} isLoading={false} />
            )
          ) : (
            <EmptyContent title="Não há opção de crédito para visitantes" />
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

export default function Faturas() {
  return (
    <Stack>
      <Suspense fallback={<Loading minHeight={200} />}>
        <FaturasContent />
      </Suspense>
    </Stack>
  );
}
