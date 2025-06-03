"use client";

import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import Avatar from "@mui/material/Avatar";
import DeleteIcon from "@mui/icons-material/Delete";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { capitalizeFirstLastName } from "@/utils";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { SelectedMember } from "@/types";
import { User } from "@/types";

export default function ListMembers({
  members,
  setMembers,
  addOrRemove,
  users,
  groupMembers,
  selectedUserIds,
  setSelectedUserIds,
  clickedUsersFromListMembers,
  setClickedUsersFromListMembers,
}: {
  members: SelectedMember[];
  setMembers: (members: SelectedMember[]) => void;
  addOrRemove: "add" | "remove";
  users: User[];
  groupMembers?: SelectedMember[];
  selectedUserIds: string[];
  setSelectedUserIds: (ids: string[]) => void;
  clickedUsersFromListMembers: User[];
  setClickedUsersFromListMembers: (users: User[]) => void;
}) {
  const handleAddOrRemove = (user: User) => () => {
    const userId = user._id!;

    if (addOrRemove === "add") {
      if (!members.some((member) => member.userId === userId)) {
        // Create new arrays for state updates
        const newMembers = [...members, { userId }];
        const newSelectedUsers = [...clickedUsersFromListMembers, user];

        setMembers(newMembers);
        setClickedUsersFromListMembers(newSelectedUsers);
        setSelectedUserIds([userId]);
      }
    } else {
      // Para remoção, armazenamos o ID do usuário que será removido
      if (!selectedUserIds.includes(userId)) {
        const newSelectedUserIds = [...selectedUserIds, userId];
        setSelectedUserIds(newSelectedUserIds);

        // Create new arrays for state updates
        const newMembers = members.filter((member) => member.userId !== userId);
        const newSelectedUsers = [...clickedUsersFromListMembers, user];

        setMembers(newMembers);
        setClickedUsersFromListMembers(newSelectedUsers);
      }
    }
  };

  // Filter users for add mode to only show users not already in the group
  const displayUsers =
    addOrRemove === "add"
      ? users.filter(
          (user) => !groupMembers?.some((member) => member.userId === user._id)
        )
      : users.filter((user) =>
          groupMembers?.some((member) => member.userId === user._id)
        );

  const handleRemoveSelection = (userId: string) => () => {
    // Create new arrays for state updates
    const newSelectedUsers = clickedUsersFromListMembers.filter(
      (user) => user._id !== userId
    );
    setClickedUsersFromListMembers(newSelectedUsers);

    if (addOrRemove === "add") {
      const newMembers = members.filter((member) => member.userId !== userId);
      setMembers(newMembers);
    } else {
      // Para remoção, removemos o ID do usuário da lista de IDs selecionados
      const newSelectedUserIds = selectedUserIds.filter((id) => id !== userId);
      setSelectedUserIds(newSelectedUserIds);

      // For remove mode, removing from selection means we want to keep the member
      const userToAdd = users.find((user) => user._id === userId);
      if (userToAdd) {
        const newMembers = [...members, { userId }];
        setMembers(newMembers);
      }
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <List
        dense
        sx={{
          width: "100%",
          maxWidth: "100%",
          bgcolor: "background.paper",
          maxHeight: "300px",
          overflow: "auto",
        }}
      >
        {displayUsers.map((user) => {
          const labelId = `list-item-${user._id}`;
          return (
            <ListItem
              key={user._id}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={handleAddOrRemove(user)}
                  color={addOrRemove === "add" ? "success" : "error"}
                >
                  {addOrRemove === "add" ? <AddIcon /> : <DeleteIcon />}
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar
                    alt={capitalizeFirstLastName(user.name)}
                    src={user.imageBase64 || undefined}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  id={labelId}
                  primary={capitalizeFirstLastName(user.name)}
                  secondary={user.email}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {clickedUsersFromListMembers.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {addOrRemove === "add"
                ? "Usuários a serem adicionados:"
                : "Usuários a serem removidos:"}
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: addOrRemove === "add" ? "success.50" : "error.50",
                border: 1,
                borderColor:
                  addOrRemove === "add" ? "success.light" : "error.light",
              }}
            >
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {clickedUsersFromListMembers.map((user) => (
                  <Chip
                    key={user._id}
                    avatar={
                      <Avatar
                        alt={capitalizeFirstLastName(user.name)}
                        src={user.imageBase64 || undefined}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    label={capitalizeFirstLastName(user.name)}
                    onDelete={handleRemoveSelection(user._id!)}
                    color={addOrRemove === "add" ? "success" : "error"}
                    sx={{ my: 0.5 }}
                  />
                ))}
              </Stack>
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
}
