import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import React from "react";
import { EntradaTexto } from "../entradaTexto/EntradaTexto";
import { FormActions } from "./FormActions";
import { Control, Controller } from "react-hook-form";
import { capitalize, findUserById } from "@/utils";
import { User, TransferMember, GroupFamily } from "@/types";

interface GroupFamilyProps {
  control: Control<GroupFamily>;
  selectedMembers: TransferMember[];
  allUsers: User[];
  ownerName: string;
  handleClearForm: () => void;
  handleEditGroupFamily: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
}

export const GroupFamilyForm = ({
  control,
  selectedMembers,
  allUsers,
  ownerName,
  handleClearForm,
  handleEditGroupFamily,
  isSubmitting,
  isEditing,
}: GroupFamilyProps) => {
  return (
    <Stack gap={2}>
      <Stack
        sx={{
          px: { xs: 2, sm: 4, md: 20 },
          pt: 2,
          width: { xs: "100%", md: "80%" },
          margin: "0 auto",
        }}
        gap={2}
      >
        <Stack direction={"column"} gap={2}>
          <EntradaTexto name="name" control={control} label="Nome" />
          <FormControl fullWidth>
            <InputLabel id="owner-select-label">Responsável</InputLabel>
            <Controller
              name="owner"
              control={control}
              rules={{ required: "Responsável é obrigatório" }}
              render={({ field }) => (
                <Select
                  labelId="owner-select-label"
                  id="owner-select"
                  label="Responsável"
                  {...field}
                >
                  {selectedMembers.map((member) => {
                    const user = findUserById(member.userId, allUsers);
                    return (
                      <MenuItem key={member.userId} value={member.userId}>
                        {user ? capitalize(user.name) : member.userId}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
            />
            {ownerName && (
              <FormHelperText>Responsável atual: {ownerName}</FormHelperText>
            )}
          </FormControl>
        </Stack>
      </Stack>
      <FormActions
        onClear={handleClearForm}
        onSave={handleEditGroupFamily}
        disabled={isSubmitting}
        isSubmitting={isSubmitting}
        isEditing={isEditing}
        isGroupFamilyEdit
      />
    </Stack>
  );
};
