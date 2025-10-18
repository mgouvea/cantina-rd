"use client";

import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import CreditTable from "@/app/components/ui/tables/CreditTable";
import EmojiPeopleOutlinedIcon from "@mui/icons-material/EmojiPeopleOutlined";
import Loading from "@/app/components/loading/Loading";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import PaymentTable from "@/app/components/ui/tables/PaymentTable";
import PeopleIcon from "@mui/icons-material/People";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { a11yProps } from "@/utils";
import { InvoiceDto } from "@/types";
import { Suspense, useEffect, useState } from "react";
import { useGroupFamilyStore, useUserStore } from "@/contexts";
import { useInvoices } from "@/hooks/queries/useInvoices.query";
import { usePayments } from "@/hooks/queries/usePayments.query";
import { useSearchParams } from "next/navigation";
import { useVisitorsWithoutDateFilter } from "@/hooks/queries/useVisitors.query";

import {
  CustomTabPanel,
  InvoiceWrapper,
  OrderWrapper,
  VisitorInvoiceWrapper,
  VisitorOrderWrapper,
  VisitorPaymentWrapper,
} from "@/app/components";
import {
  useCredits,
  useGroupFamily,
  useOrders,
  useOrdersVisitors,
  useUsers,
} from "@/hooks/queries";
import { Box, Stack, Tab, Tabs, useTheme, ToggleButton, ToggleButtonGroup } from "@mui/material";

const breadcrumbItems = [{ label: "Início", href: "/dashboard" }, { label: "Financeiro" }];

function FaturasContent() {
  const theme = useTheme();
  const searchParams = useSearchParams();

  const initialTab = searchParams.get("tab") ? parseInt(searchParams.get("tab")!) : 0;

  const [value, setValue] = useState<number>(initialTab);
  const [viewType, setViewType] = useState<"socios" | "visitantes">("socios");
  const [viewCreditArchive, setViewCreditArchive] = useState(false);

  const { data: dataOrders, isLoading: isLoadingOrders } = useOrders();
  const { data: dataVisitors, isLoading: isLoadingVisitors } = useOrdersVisitors();
  const { data: allInvoices, isLoading: isLoadingInvoices } = useInvoices();
  const { data: allVisitors, isLoading: isLoadingAllVisitors } = useVisitorsWithoutDateFilter();
  const { data: dataUser, isLoading: isLoadingUser } = useUsers();
  const { data: groupFamilies, isLoading: isLoadingGroupFamily } = useGroupFamily();
  const { data: payments, isLoading: isLoadingPayments } = usePayments();
  const {
    data: credits,
    isLoading: isLoadingCredits,
    refetch: refetchCredits,
  } = useCredits(viewCreditArchive);

  useEffect(() => {
    refetchCredits();
  }, [viewCreditArchive, refetchCredits]);

  const [allInvoicesIds, setAllInvoicesIds] = useState<string[] | null>(null);

  const [allVisitorsIds, setAllVisitorsIds] = useState<string[] | null>(null);

  const { updateAllGroupFamilies } = useGroupFamilyStore();
  const { updateAllUsers } = useUserStore();

  useEffect(() => {
    if (allInvoices && allInvoices.length > 0 && !isLoadingInvoices) {
      setAllInvoicesIds(allInvoices.map((invoice: InvoiceDto) => invoice._id));
    }
  }, [allInvoices, isLoadingInvoices]);

  useEffect(() => {
    if (allVisitors && allVisitors.length > 0 && !isLoadingVisitors) {
      setAllVisitorsIds(allVisitors.map((visitor: InvoiceDto) => visitor._id));
    }
  }, [allVisitors, isLoadingVisitors]);

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

  const handleViewCreditArchive = () => {
    setViewCreditArchive((prev) => !prev);
  };

  const renderContent = () => {
    if (
      isLoadingOrders ||
      isLoadingGroupFamily ||
      isLoadingUser ||
      isLoadingVisitors ||
      isLoadingAllVisitors
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
                fontSize: { xs: "0.75rem", sm: "1rem" },
              },
            }}
          >
            <Tab icon={<ReceiptLongIcon />} label="Compras" {...a11yProps(0)} />
            <Tab icon={<PriceCheckIcon />} label="Faturas" {...a11yProps(1)} />
            <Tab icon={<AssuredWorkloadIcon />} label="Pagamentos" {...a11yProps(2)} />
            {viewType === "socios" && (
              <Tab icon={<PaidOutlinedIcon />} label="Credito" {...a11yProps(3)} />
            )}
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0} dir={theme.direction}>
          {viewType === "socios" ? (
            <OrderWrapper data={dataOrders} isLoading={isLoadingOrders} />
          ) : (
            <VisitorOrderWrapper data={dataVisitors} isLoading={isLoadingVisitors} />
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1} dir={theme.direction}>
          {viewType === "socios" ? (
            <InvoiceWrapper
              groupFamilies={groupFamilies}
              dataUser={dataUser}
              allInvoicesIds={allInvoicesIds}
            />
          ) : (
            <VisitorInvoiceWrapper allVisitorsIds={allVisitorsIds} viewType={viewType} />
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2} dir={theme.direction}>
          {viewType === "socios" ? (
            isLoadingPayments ? (
              <Loading />
            ) : (
              <PaymentTable data={payments || []} isLoading={false} />
            )
          ) : (
            <VisitorPaymentWrapper />
          )}
        </CustomTabPanel>
        {viewType === "socios" && (
          <CustomTabPanel value={value} index={3} dir={theme.direction}>
            {isLoadingCredits ? (
              <Loading />
            ) : (
              <CreditTable
                data={credits || []}
                isLoading={false}
                viewCreditArchive={viewCreditArchive}
                onViewCreditArchive={handleViewCreditArchive}
              />
            )}
          </CustomTabPanel>
        )}
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
