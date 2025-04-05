"use client";

import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import Text from "@/app/components/ui/text/Text";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Dashboard" },
];

export default function Dashboard() {
  const renderContent = () => <Text>Aqui será apresentado o dahsboard</Text>;

  return (
    <ContentWrapper breadcrumbItems={breadcrumbItems}>
      {renderContent()}
    </ContentWrapper>
  );
}
