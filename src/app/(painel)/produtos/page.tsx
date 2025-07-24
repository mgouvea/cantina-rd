"use client";

import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import Loading from "@/app/components/loading/Loading";
import ProductTable from "@/app/components/ui/tables/ProductTable";
import { useProducts } from "@/hooks/queries/useProducts.query";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Produtos" },
];

export default function Produtos() {
  const { data, isLoading } = useProducts();

  const renderContent = () => {
    if (isLoading) {
      return <Loading />;
    }

    return <ProductTable data={data} isLoading={isLoading} />;
  };

  return (
    <ContentWrapper breadcrumbItems={breadcrumbItems}>
      {renderContent()}
    </ContentWrapper>
  );
}
