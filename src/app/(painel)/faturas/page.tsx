"use client";
import Loading from "@/app/components/loading/Loading";
import ContentWrapper from "@/app/components/ui/wrapper/ContentWrapper";
import { useGroupFamily, useOrders, useUsers } from "@/hooks/queries";
import { useQueryClient } from "@tanstack/react-query";
import TabelaFaturas from "@/app/components/ui/tables/TabelaFaturas";
import { useRouter } from "next/navigation";
import { GridRowModel } from "@mui/x-data-grid";
import { useSnackbar } from "@/app/components";

const breadcrumbItems = [
  { label: "Início", href: "/dashboard" },
  { label: "Faturas" },
];

export default function Faturas() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const { data, isLoading } = useOrders();
  const { data: dataUser, isLoading: isLoadingUser } = useUsers();
  const { data: groupFamilies, isLoading: isLoadingGroupFamily } =
    useGroupFamily();

  const handleEditClick = (row: GridRowModel) => () => {
    console.log(row);
    router.replace("/faturas/novo");
  };

  const handleDeleteClick = (orderId: string) => async () => {
    try {
      console.log(orderId);
      showSnackbar({
        message: "Fatura deletada com sucesso!",
        severity: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (error) {
      showSnackbar({
        message: "Erro ao deletar a fatura",
        severity: "error",
        duration: 3000,
      });
      console.error(error);
    }
  };

  const renderContent = () => {
    if (isLoading || isLoadingGroupFamily || isLoadingUser) {
      return <Loading />;
    }

    return (
      <TabelaFaturas
        data={data}
        dataUser={dataUser}
        isLoading={isLoading}
        groupFamilies={groupFamilies}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />
    );
  };

  return (
    <ContentWrapper breadcrumbItems={breadcrumbItems}>
      {renderContent()}
    </ContentWrapper>
  );
}
