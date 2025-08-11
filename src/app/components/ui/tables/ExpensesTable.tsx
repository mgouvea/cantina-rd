"use client";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import EmptyContent from "../emptyContent/EmptyContent";
import Text from "../text/Text";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowModel,
} from "@mui/x-data-grid";
import { Expense, TabelaProps } from "@/types";
import { ExpensesModal } from "../../modal/ExpensesModal";
import { Filters } from "../../filters/Filters";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  capitalize,
  capitalizeFirstLastName,
  formatDate,
  formatMonthYear,
} from "@/utils";
import { ImageModal } from "../../modal/ImageModal";
import { useDeleteExpense } from "@/hooks/mutations/useExpenses.mutation";

export default function ExpensesTable({
  data,
  isLoading,
}: TabelaProps<Expense>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const queryClient = useQueryClient();

  const { mutateAsync: deleteExpense } = useDeleteExpense();

  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<GridRowModel | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleResetData = () => {
    queryClient.invalidateQueries({ queryKey: ["credits"] });
  };

  const handleSeeProof = (row: GridRowModel) => () => {
    setSelectedExpense(row);
    setOpenImageModal(true);
  };

  const handleEditClick = (row: GridRowModel) => () => {
    setSelectedExpense(row);
    setIsEditing(true);
    setOpenExpenseModal(true);
  };

  const handleDeleteClick = (row: GridRowModel) => () => {
    deleteExpense(row._id);
  };

  const columns: GridColDef[] = [
    {
      field: "userName",
      headerName: "Usuário",
      width: isMobile ? 150 : isTablet ? 150 : 200,
      flex: 1,
      minWidth: 100,
      editable: true,
      renderCell: ({ value }) => (
        <Typography sx={{ py: 0.5 }}>
          {capitalizeFirstLastName(value)}
        </Typography>
      ),
    },
    {
      field: "referenceMonth",
      headerName: "Mês de Referência",
      width: isMobile ? 150 : isTablet ? 150 : 200,
      flex: 1,
      minWidth: 100,
      editable: true,
      renderCell: ({ value }) => (
        <Typography sx={{ py: 0.5 }}>
          {capitalize(formatMonthYear(value))}
        </Typography>
      ),
    },
    {
      field: "expenseType",
      headerName: "Tipo de Despesa",
      width: isMobile ? 150 : isTablet ? 150 : 200,
      flex: 1,
      minWidth: 100,
      editable: true,
      renderCell: ({ value }) => (
        <Typography sx={{ py: 0.5 }}>
          {value === "refund"
            ? "Reembolso"
            : value === "canteenCard"
            ? "Cartão Cantina"
            : value === "canteenCredit"
            ? "Crédito Cantina"
            : value === "paidByTreasurer"
            ? "Pagamento pelo Tesoureiro"
            : value}
        </Typography>
      ),
    },
    {
      field: "expenseValue",
      headerName: "Valor da Despesa",
      width: isMobile ? 100 : isTablet ? 100 : 130,
      flex: 0.8,
      minWidth: 100,
      editable: true,
      renderCell: ({ value }) => (
        <Typography sx={{ py: 0.5 }}>R$ {Number(value).toFixed(2)}</Typography>
      ),
    },
    {
      field: "expenseDate",
      headerName: "Data da Despesa",
      width: isMobile ? 100 : isTablet ? 100 : 120,
      flex: 1,
      minWidth: 100,
      editable: false,
      align: "center",
      headerAlign: "center",
      renderCell: ({ value }) => (
        <Typography sx={{ py: 0.5 }}>
          {/* {format(new Date(value), "dd/MM/yyyy HH:mm", { locale: ptBR })} */}
          {formatDate(value)}
        </Typography>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      flex: 0.5,
      width: 100,
      cellClassName: "actions",
      getActions: ({ id, row }) => {
        return [
          <Tooltip key={id} title="Ver comprovante">
            <GridActionsCellItem
              icon={<VisibilityOutlinedIcon sx={{ color: "#666666" }} />}
              label="Edit"
              className="textPrimary"
              onClick={handleSeeProof(row)}
            />
          </Tooltip>,
          <Tooltip key={id} title="Editar despesa">
            <GridActionsCellItem
              icon={<EditIcon sx={{ color: "#666666" }} />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(row)}
            />
          </Tooltip>,
          <Tooltip key={id} title="Excluir despesa">
            <GridActionsCellItem
              icon={<DeleteIcon sx={{ color: "#9B0B00" }} />}
              label="Delete"
              onClick={handleDeleteClick(row)}
              color="inherit"
            />
          </Tooltip>,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        padding: { xs: 1, sm: 2 },
        height: "fit-content",
        width: "100%",
        overflowX: "auto",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Text variant="h5">Despesas Cadastradas</Text>

        <Stack direction="row" spacing={2}>
          <Tooltip title="Inserir despesa">
            <IconButton
              aria-label="add"
              sx={{ color: "success.main" }}
              onClick={() => {
                setSelectedExpense(null);
                setIsEditing(false);
                setOpenExpenseModal(true);
              }}
            >
              <AddCircleIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Recarregar dados">
            <IconButton
              aria-label="add"
              sx={{ color: "success.main" }}
              onClick={handleResetData}
            >
              <CachedOutlinedIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {!isLoading && (!data || data.length === 0) && (
        <EmptyContent title="Ainda não há despesas para exibir" />
      )}

      {!isLoading && data && data.length > 0 && (
        <Filters rows={data}>
          {(rowsFiltradas) =>
            isLoading ? (
              <CircularProgress />
            ) : (
              <DataGrid
                rows={rowsFiltradas}
                columns={columns}
                editMode="row"
                getRowId={(row) => row._id}
                getRowHeight={() => "auto"}
                getEstimatedRowHeight={() => 100}
                autoHeight
                disableColumnMenu={isMobile}
                sx={{
                  borderRadius: "16px",
                  width: "100%",
                  "& .MuiDataGrid-cell": {
                    wordBreak: "break-word",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor:
                      theme.palette.mode === "light" ? "#f5f5f5" : "#333",
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    minHeight: "200px",
                  },
                }}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: isMobile ? 5 : 10 },
                  },
                  columns: {
                    columnVisibilityModel: {
                      groupFamilyName: !isMobile,
                      createdAt: !(isMobile && !isTablet),
                    },
                  },
                  sorting: {
                    sortModel: [{ field: "createdAt", sort: "desc" }],
                  },
                }}
                pageSizeOptions={[5, 15, 25]}
              />
            )
          }
        </Filters>
      )}
      <ExpensesModal
        openModal={openExpenseModal}
        setOpenModal={setOpenExpenseModal}
        expenseData={selectedExpense as Expense}
        isEditing={isEditing}
        onClose={() => {
          setSelectedExpense(null);
          setIsEditing(false);
        }}
      />
      {selectedExpense && (
        <ImageModal
          userName={selectedExpense.userName}
          description={selectedExpense.description}
          urlImage={selectedExpense.urlImage}
          openModal={openImageModal}
          setOpenModal={setOpenImageModal}
        />
      )}
    </Box>
  );
}
