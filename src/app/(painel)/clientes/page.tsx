"use client";

import TabelaCliente from "@/app/components/ui/tables/TabelaCliente";
import { useApp } from "@/contexts";
import { useEffect } from "react";
import { useUsers } from "@/hooks/queries";
import Loading from "@/app/components/loading/Loading";
import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Clientes" },
];

export default function Clientes() {
  const { data, isLoading } = useUsers();
  const { setUserContext } = useApp();

  useEffect(() => {
    if (!isLoading && data) {
      setUserContext(data);
    }
  }, [data, isLoading, setUserContext]);

  const renderContent = () => {
    if (isLoading) {
      return <Loading />;
    }

    return <TabelaCliente data={data} isLoading={isLoading} />;
  };

  return (
    <ContentWrapper breadcrumbItems={breadcrumbItems}>
      {renderContent()}
    </ContentWrapper>
  );
}
