"use client";

import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import Loading from "@/app/components/loading/Loading";
import ProductTable from "@/app/components/ui/tables/ProductTable";
import { useProducts } from "@/hooks/queries/useProducts.query";
import { useDeleteProduct } from "@/hooks/mutations/useProducts.mutation";
import { CardProducts } from "@/app/components/ui/CardWrapper/CardProducts";
import { GenericCardWrapper } from "@/app/components";
import { DeleteModal } from "@/app/components/modal/DeleteModal";
import { useTheme, useMediaQuery } from "@mui/material";
import { Products } from "@/types";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Produtos" },
];

export default function Produtos() {
  const { data, isLoading } = useProducts();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  
  // State for delete modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Products | null>(null);

  // Filter products for mobile view based on search term
  const filteredProducts = useMemo(() => {
    if (!data || !searchTerm) return data;

    return data.filter((product: Products) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // Handle delete click for products
  const handleDeleteClick = (product: Products) => {
    setProductToDelete(product);
    setOpenDeleteModal(true);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (productToDelete?._id) {
      await deleteProduct({ productId: productToDelete._id });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loading />;
    }

    if (isMobile) {
      return (
        <GenericCardWrapper
          title="Produtos"
          breadcrumbItems={breadcrumbItems}
          handlePlusClick={() => router.push("/produtos/novo")}
          searchable={true}
          onSearch={setSearchTerm}
        >
          {(filteredProducts || []).map((product: Products) => (
            <CardProducts 
              key={product._id} 
              {...product} 
              handleDeleteClick={() => handleDeleteClick(product)}
            />
          ))}
        </GenericCardWrapper>
      );
    }

    return (
      <ContentWrapper breadcrumbItems={breadcrumbItems}>
        <ProductTable data={data} isLoading={isLoading} />;
      </ContentWrapper>
    );
  };

  return (
    <>
      {renderContent()}
      <DeleteModal
        title="produto"
        nameToDelete={productToDelete?.name}
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        onConfirmDelete={confirmDelete}
      />
    </>
  );
}
