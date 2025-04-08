"use client";
import Loading from "@/app/components/loading/Loading";
import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import TabelaProduto from "@/app/components/ui/tables/TabelaProduto";
import { useProducts } from "@/hooks/queries/useProducts.query";
import { useCategories, useSubCategories } from "@/hooks/queries";
import { useQueryClient } from "@tanstack/react-query";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Produtos" },
];

export default function Produtos() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: subcategories, isLoading: subcategoriesLoading } =
    useSubCategories();

  const handleDeleteProduct = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

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
        onDeleteProduct={handleDeleteProduct}
      />
    );
  };

  return (
    <ContentWrapper breadcrumbItems={breadcrumbItems}>
      {renderContent()}
    </ContentWrapper>
  );
}
