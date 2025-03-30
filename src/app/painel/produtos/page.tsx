"use client";
import Loading from "@/app/components/loading/Loading";
import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import TabelaProduto from "@/app/components/ui/tables/TabelaProduto";
import { useProducts } from "@/hooks/queries/useProducts.query";
import { useCategories, useSubCategories } from "@/hooks/queries";

const breadcrumbItems = [
  { label: "Início", href: "/painel" },
  { label: "Produtos" },
];

export default function Produtos() {
  const { data, isLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: subcategories, isLoading: subcategoriesLoading } =
    useSubCategories();

  const renderContent = () => {
    if (isLoading || categoriesLoading || subcategoriesLoading) {
      return <Loading />;
    }

    return (
      <TabelaProduto
        data={data}
        isLoading={isLoading}
        categories={categories}
        subcategories={subcategories}
      />
    );
  };

  return (
    <ContentWrapper breadcrumbItems={breadcrumbItems}>
      {renderContent()}
    </ContentWrapper>
  );
}
