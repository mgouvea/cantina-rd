"use client";

import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import ExpensesTable from "@/app/components/ui/tables/ExpensesTable";
import Loading from "@/app/components/loading/Loading";
import React from "react";
import { useExpenses } from "@/hooks/queries";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Despesas" },
];

const Despesas = () => {
  const { data, isLoading } = useExpenses();

  const renderContent = () => {
    if (isLoading) {
      return <Loading />;
    }

    return <ExpensesTable data={data} isLoading={isLoading} />;
  };
  return (
    <ContentWrapper breadcrumbItems={breadcrumbItems}>
      {renderContent()}
    </ContentWrapper>
  );
};

export default Despesas;
