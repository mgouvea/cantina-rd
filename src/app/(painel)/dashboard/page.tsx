"use client";

import AreaChart from "@/app/components/ui/graphics/AreaChart";
import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import Loading from "@/app/components/loading/Loading";
import Text from "@/app/components/ui/text/Text";
import { Box, Divider, Stack } from "@mui/material";
import { Suspense, useState } from "react";

import {
  DashFilter,
  FamiliesOpen,
  TopClients,
  TopProducts,
  TotalBoxContent,
} from "@/app/components";
import {
  useGroupFamilyInvoicesOpen,
  useMostSoldProducts,
  useTopClients,
} from "@/hooks/queries";

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

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Dashboard" },
];

export default function Dashboard() {
  // Estado para armazenar as datas selecionadas no filtro
  const [filterDates, setFilterDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });

  const {
    data: groupFamilyInvoicesOpen,
    isLoading: isLoadingGroupFamilyInvoicesOpen,
  } = useGroupFamilyInvoicesOpen(filterDates.startDate!, filterDates.endDate!);

  const { data: mostSoldProducts, isLoading: isLoadingMostSoldProducts } =
    useMostSoldProducts(filterDates.startDate!, filterDates.endDate!);

  const { data: topClients, isLoading: isLoadingTopClients } = useTopClients(
    filterDates.startDate!,
    filterDates.endDate!
  );

  const renderContent = () => (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 2, sm: 0 }}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          marginInline: "1rem",
          mb: { xs: 2, sm: 0 },
        }}
      >
        <Text variant="h6" color="#111c35" fontWeight="bold">
          Dashboard
        </Text>

        <DashFilter onFilter={(data) => setFilterDates(data)} />
      </Stack>

      <TotalBoxContent
        startDate={filterDates.startDate || undefined}
        endDate={filterDates.endDate || undefined}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 3 },
          height: { xs: "auto", md: "24rem" },
          marginInline: "0.5rem",
        }}
      >
        {/* Box de vendas vs à receber */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
            gap: 1,
            width: { xs: "100%", md: "70%" },
            height: { xs: "350px", md: "inherit" },
            backgroundColor: "#fff",
            borderRadius: "8px",
          }}
        >
          <Text variant="subtitle2" color="#596772" fontWeight="bold">
            Receitas vs Despesas
          </Text>
          <Box sx={{ flexGrow: 1, width: "100%", height: "calc(100% - 24px)" }}>
            <AreaChart />
          </Box>
        </Box>

        {/* Box de famílias em aberto */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "1.5rem",
            gap: 2,
            width: { xs: "100%", md: "30%" },
            height: { xs: "400px", md: "inherit" },
            backgroundColor: "#fff",
            borderRadius: "8px",
          }}
        >
          <Text variant="subtitle2" color="#596772" fontWeight="bold">
            Famílias em aberto
          </Text>
          <Divider />
          <Box
            sx={{
              flexGrow: 1,
              width: "100%",
              height: "calc(100% - 28px)",
              overflowY: "auto",
              ...overflowStyle,
            }}
          >
            {isLoadingGroupFamilyInvoicesOpen ? (
              <Loading minHeight={10} />
            ) : (
              // Sort by value in descending order (highest to lowest)
              [...(groupFamilyInvoicesOpen || [])]
                .sort((a, b) => b.value - a.value)
                .map((family) => (
                  <FamiliesOpen
                    key={family._id}
                    name={family.name}
                    ownerName={family.ownerName}
                    ownerAvatar={family.ownerAvatar}
                    value={family.value}
                  />
                ))
            )}
          </Box>
        </Box>
      </Box>

      {/* Box de top produtos e top clientes */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 1, md: 2 },
          height: { xs: "auto", md: "22rem" },
          marginInline: "0.5rem",
          marginTop: "0.5rem",
        }}
      >
        {/* Box de top produtos */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 3, sm: 2 },
            width: { xs: "100%", md: "70%" },
            height: { xs: "auto", md: "inherit" },
            borderRadius: "8px",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", sm: "50%" },
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              mb: { xs: 2, sm: 0 },
              height: { xs: "400px", sm: "auto" },
            }}
          >
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                backgroundColor: "#fff",
                pb: 1,
              }}
            >
              <Text variant="subtitle2" color="#596772" fontWeight="bold">
                Produtos mais vendidos
              </Text>
              <Divider />
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                ...overflowStyle,
                mt: 1,
              }}
            >
              {isLoadingMostSoldProducts ? (
                <Loading minHeight={10} />
              ) : (
                mostSoldProducts?.map((product) => (
                  <TopProducts key={product._id} {...product} />
                ))
              )}
            </Box>
          </Box>

          {/* Box de top clientes */}
          <Box
            sx={{
              width: { xs: "100%", sm: "50%" },
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              mb: { xs: 2, sm: 0 },
              height: { xs: "400px", sm: "auto" },
            }}
          >
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                backgroundColor: "#fff",
                pb: 1,
              }}
            >
              <Text variant="subtitle2" color="#596772" fontWeight="bold">
                Top clientes
              </Text>
              <Divider />
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                ...overflowStyle,
                mt: 1,
              }}
            >
              {isLoadingTopClients ? (
                <Loading minHeight={10} />
              ) : (
                topClients?.map((client) => (
                  <TopClients key={client._id} {...client} />
                ))
              )}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: { xs: "100%", md: "30%" },
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "1rem",
            height: { xs: "350px", md: "auto" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text variant="subtitle2" color="#596772" fontWeight="bold">
            Faturamento por produto %
          </Text>
          <Divider />
          {/* <PieChartProduct /> */}
        </Box>
      </Box>
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
