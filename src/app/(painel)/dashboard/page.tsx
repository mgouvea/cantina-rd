"use client";

import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import { Suspense } from "react";
import Loading from "@/app/components/loading/Loading";
import { DashFilter, TotalBoxContent } from "@/app/components";
import { Stack } from "@mui/material";
import Text from "@/app/components/ui/text/Text";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Dashboard" },
];

export default function Dashboard() {
  const renderContent = () => (
    <>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          marginInline: "1rem",
        }}
      >
        <Text variant="h5" color="#111c35" fontWeight="bold">
          Dashboard
        </Text>

        <DashFilter onFilter={(data) => console.log(data)} />
      </Stack>
      <TotalBoxContent />
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
