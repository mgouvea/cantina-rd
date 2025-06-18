import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Text from "../ui/text/Text";
import TextField from "@mui/material/TextField";
import { Avatar, Box, Button, Checkbox, Stack } from "@mui/material";
import { Controller } from "react-hook-form";
import { GroupFamilyWithOwner } from "@/types";
import { useGroupFamilyStore } from "@/contexts";

const OptionLabel = ({ option }: { option: GroupFamilyWithOwner }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
    }}
  >
    {option.ownerAvatar && (
      <Avatar
        src={option.ownerAvatar}
        alt={option.ownerName}
        sx={{ width: 40, height: 40 }}
      />
    )}
    <span>{option.name}</span>
  </Box>
);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface SelectFamiliesProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoiceForm: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  selectedFamilies: GroupFamilyWithOwner[];
  onSelectFamilies: (families: GroupFamilyWithOwner[]) => void;
  hasPadding?: boolean;
}

export default function SelectFamilies({
  invoiceForm,
  control,
  selectedFamilies,
  onSelectFamilies,
  hasPadding,
}: SelectFamiliesProps) {
  const { groupFamiliesWithOwner } = useGroupFamilyStore();

  return (
    <Box
      sx={{
        width: "100%",
        px: hasPadding ? 2 : 0,
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Text variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
          Selecione as famílias
        </Text>
        <Box
          sx={{
            mb: 1,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              const allFamilies =
                groupFamiliesWithOwner
                  ?.slice()
                  .sort((a: GroupFamilyWithOwner, b: GroupFamilyWithOwner) =>
                    a.name.localeCompare(b.name)
                  ) || [];
              onSelectFamilies(allFamilies);
              // Atualiza o valor no formulário
              invoiceForm.setValue(
                "groupFamilyIds",
                allFamilies
                  .map((item: GroupFamilyWithOwner) => item._id || "")
                  .filter((id: string) => id !== "")
              );
            }}
          >
            Selecionar Todos
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => {
              onSelectFamilies([]);
              invoiceForm.setValue("groupFamilyIds", []);
            }}
          >
            Desmarcar Todos
          </Button>
        </Box>
      </Stack>

      <Controller
        name="groupFamilyIds"
        control={control}
        render={({ field: { onChange, ...restField } }) => (
          <Autocomplete
            {...restField}
            multiple
            id="checkboxes-tags-demo"
            options={
              groupFamiliesWithOwner
                ?.slice()
                .sort((a: GroupFamilyWithOwner, b: GroupFamilyWithOwner) =>
                  a.name.localeCompare(b.name)
                ) || []
            }
            disableCloseOnSelect
            getOptionLabel={(option) =>
              (<OptionLabel option={option} />) as unknown as string
            }
            value={selectedFamilies}
            onChange={(_, newValue) => {
              onSelectFamilies(newValue);
              onChange(
                newValue
                  .map((item: GroupFamilyWithOwner) => item._id || "")
                  .filter((id: string) => id !== "")
              );
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderOption={(props, option, { selected }) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { key, ...optionProps } = props;
              return (
                <li key={option._id} {...optionProps}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />

                  <OptionLabel option={option} />
                </li>
              );
            }}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} label="Famílias" placeholder="Famílias" />
            )}
          />
        )}
      />
    </Box>
  );
}
