"use client";

import * as React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import EmptyContent from "../emptyContent/EmptyContent";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import GroupRemoveOutlinedIcon from "@mui/icons-material/GroupRemoveOutlined";
import Text from "../text/Text";
import { capitalize, capitalizeFirstLastName } from "@/utils";
import { CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import { Filtros } from "../..";
import { GroupFamily, SelectedMember } from "@/types/groupFamily";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import AvatarGroup from "@mui/material/AvatarGroup";

import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowModel,
  GridRowModesModel,
  GridEventListener,
} from "@mui/x-data-grid";

interface TabelaProps {
  data: GroupFamily[];
  isLoading: boolean;
  rows?: GroupFamily[];
  rowModesModel: GridRowModesModel;
  handleRowEditStop: GridEventListener<"rowEditStop">;
  handleEditClick: (row: GridRowModel) => () => void;
  handleDeleteClick: (id: string) => () => void;
  processRowUpdate: (newRow: GridRowModel) => GroupFamily;
  handleRowModesModelChange: (newRowModesModel: GridRowModesModel) => void;
  setRows: (rows: GroupFamily[]) => void;
  handleEditMembers: (
    row: GroupFamily,
    addOrRemove: "add" | "remove"
  ) => () => void;
}

export default function TabelaGrupoFamiliar({
  data,
  isLoading,
  handleEditClick,
  handleDeleteClick,
  processRowUpdate,
  handleRowModesModelChange,
  handleRowEditStop,
  rowModesModel,
  setRows,
  handleEditMembers,
}: TabelaProps) {
  const router = useRouter();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nome do grupo",
      width: 300,
      editable: true,
      renderCell: (params) => (
        <Typography sx={{ py: 1 }}>{capitalize(params.value)}</Typography>
      ),
    },
    {
      field: "ownerName",
      headerName: "Responsável",
      type: "string",
      width: 300,
      editable: true,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" sx={{ py: 1 }}>
          <Avatar
            src={params.row.ownerAvatar}
            alt={params.value}
            sx={{ width: 40, height: 40, marginRight: 1 }}
          />
          {capitalizeFirstLastName(params.value)}
        </Box>
      ),
    },
    {
      field: "members",
      headerName: "Membros",
      width: 250,
      headerAlign: "center",
      renderCell: (params) => {
        const members = params.value || [];
        const maxAvatars = 5;
        return (
          <AvatarGroup max={maxAvatars} sx={{ py: 1 }}>
            {members.map((member: SelectedMember, index: number) => (
              <Tooltip title={capitalize(member.memberName)} key={index}>
                <Avatar
                  src={member.memberAvatar}
                  alt={member.memberName}
                  sx={{ width: 32, height: 32 }}
                />
              </Tooltip>
            ))}
          </AvatarGroup>
        );
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 250,
      cellClassName: "actions",
      getActions: ({ id, row }) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<EditIcon sx={{ color: "#666666", fontSize: 25 }} />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(row)}
          />,
          <GridActionsCellItem
            key={id}
            icon={
              <GroupAddOutlinedIcon sx={{ color: "#1ab86d", fontSize: 25 }} />
            }
            label="Add Member"
            onClick={handleEditMembers(row, "add")}
            color="inherit"
          />,
          <GridActionsCellItem
            key={id}
            icon={
              <GroupRemoveOutlinedIcon
                sx={{ color: "#9B0B00", fontSize: 25 }}
              />
            }
            label="Remove Member"
            onClick={handleEditMembers(row, "remove")}
            color="inherit"
          />,
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon sx={{ color: "#9B0B00", fontSize: 25 }} />}
            label="Delete"
            onClick={handleDeleteClick(String(id))}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handleAddClient = () => {
    router.replace("/grupo-familiar/novo");
  };

  return (
    <Box
      sx={{
        padding: 2,
        height: "fit-content",
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Text variant="h5">Grupos Familiares Cadastrados</Text>

        <IconButton
          aria-label="add"
          sx={{ color: "success.main" }}
          onClick={handleAddClient}
        >
          <AddCircleIcon fontSize="large" />
        </IconButton>
      </Stack>

      {!isLoading && (!data || data.length === 0) && (
        <EmptyContent title="Ainda não há Grupos Familiares para exibir" />
      )}

      {!isLoading && data && data.length > 0 && (
        <Filtros rows={data}>
          {(rowsFiltradas) =>
            isLoading ? (
              <CircularProgress />
            ) : (
              <DataGrid
                rows={rowsFiltradas}
                columns={columns}
                editMode="row"
                getRowId={(row) => row._id}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                getRowHeight={() => "auto"}
                getEstimatedRowHeight={() => 100}
                slotProps={{
                  toolbar: { setRows, rowModesModel },
                }}
                sx={{ borderRadius: "16px" }}
              />
            )
          }
        </Filtros>
      )}
    </Box>
  );
}
