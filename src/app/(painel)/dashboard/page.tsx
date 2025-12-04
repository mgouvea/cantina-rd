"use client";

import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import Loading from "@/app/components/loading/Loading";
import Text from "@/app/components/ui/text/Text";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { Suspense, useState } from "react";

import { DashFilter, TotalBoxContent } from "@/app/components";
import {
  useGroupFamilyInvoicesOpen,
  useMostSoldProducts,
  useOpenInvoiceTime,
  usePaymentsVsReceives,
  useTopClients,
} from "@/hooks/queries";
import ContentOne from "@/app/components/ui/dashboard/contentOne";
import ContentTwo from "@/app/components/ui/dashboard/contentTwo";

// Custom scrollbar style
const overflowStyle = {
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#bdbdbd",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#bdbdbd",
  },
  scrollbarWidth: "thin",
  scrollbarColor: "#bdbdbd transparent",
};

const breadcrumbItems = [{ label: "Início", href: "/dashboard" }, { label: "Dashboard" }];

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Estado para armazenar as datas selecionadas no filtro
  const [filterDates, setFilterDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });

  const { data: groupFamilyInvoicesOpen, isLoading: isLoadingGroupFamilyInvoicesOpen } =
    useGroupFamilyInvoicesOpen();

  const { data: openInvoiceTime, isLoading: isLoadingOpenInvoiceTime } = useOpenInvoiceTime();

  const { data: mostSoldProducts, isLoading: isLoadingMostSoldProducts } = useMostSoldProducts(
    filterDates.startDate!,
    filterDates.endDate!
  );

  const { data: topClients, isLoading: isLoadingTopClients } = useTopClients(
    filterDates.startDate!,
    filterDates.endDate!
  );

  const { data: paymentsVsReceives, isLoading: isLoadingPaymentsVsReceives } =
    usePaymentsVsReceives();

  const renderContent = () => (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 2, sm: 0 }}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          marginInline: { xs: "0.5rem", sm: "1rem" },
          mb: { xs: 2, sm: 0, md: 2 },
        }}
      >
        <Text variant="h6" color="#111c35" fontWeight="bold">
          Dashboard
        </Text>

        <DashFilter onFilter={(data) => setFilterDates(data)} />
      </Stack>

      <Stack spacing={2}>
        <TotalBoxContent
          startDate={filterDates.startDate || undefined}
          endDate={filterDates.endDate || undefined}
        />

        {/* Box de receitas vs despesas e famílias em aberto */}
        <ContentOne
          isLoadingPaymentsVsReceives={isLoadingPaymentsVsReceives}
          paymentsVsReceives={paymentsVsReceives || null}
          isMobile={isMobile}
          isLoadingOpenInvoiceTime={isLoadingOpenInvoiceTime}
          openInvoiceTime={openInvoiceTime || null}
        />

        {/* Box de famílias em aberto, top clientes e top produtos */}
        <ContentTwo
          isLoadingGroupFamilyInvoicesOpen={isLoadingGroupFamilyInvoicesOpen}
          groupFamilyInvoicesOpen={groupFamilyInvoicesOpen || []}
          isMobile={isMobile}
          overflowStyle={overflowStyle}
          isLoadingMostSoldProducts={isLoadingMostSoldProducts}
          mostSoldProducts={mostSoldProducts || []}
          isLoadingTopClients={isLoadingTopClients}
          topClients={topClients || []}
        />
      </Stack>
    </>
  );

  return (
    <Suspense fallback={<Loading minHeight={200} />}>
      <ContentWrapper isDashboard breadcrumbItems={breadcrumbItems}>
        {renderContent()}
      </ContentWrapper>
    </Suspense>
  );
}
