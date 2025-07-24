import React, { useMemo, memo } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Text from "../ui/text/Text";
import TextField from "@mui/material/TextField";
import { Box, Button, Checkbox, Stack } from "@mui/material";
import { Controller } from "react-hook-form";
import { capitalize, formatarTelefone } from "@/utils";
import { Visitor } from "@/types";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface SelectVisitorsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoiceForm: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  selectedVisitors: Visitor[];
  onSelectVisitors: (visitors: Visitor[]) => void;
  allVisitors: Visitor[];
  hasPadding?: boolean;
}

// Memoize the component to prevent unnecessary re-renders
const SelectVisitors = memo(function SelectVisitors({
  invoiceForm,
  control,
  selectedVisitors,
  onSelectVisitors,
  allVisitors,
  hasPadding,
}: SelectVisitorsProps) {
  // Memoize sorted options to prevent re-sorting on every render
  const sortedOptions = useMemo(() => {
    return (
      allVisitors
        ?.slice()
        .sort((a: Visitor, b: Visitor) => a.name.localeCompare(b.name)) || []
    );
  }, [allVisitors]);

  // Memoize the select all handler
  const handleSelectAll = useMemo(() => {
    return () => {
      onSelectVisitors(sortedOptions);
      // Atualiza o valor no formulário
      invoiceForm.setValue(
        "visitorsIds",
        sortedOptions
          .map((item: Visitor) => item._id || "")
          .filter((id: string) => id !== "")
      );
    };
  }, [sortedOptions, onSelectVisitors, invoiceForm]);

  // Memoize the clear all handler
  const handleClearAll = useMemo(() => {
    return () => {
      onSelectVisitors([]);
      invoiceForm.setValue("visitorsIds", []);
    };
  }, [onSelectVisitors, invoiceForm]);

  return (
    <Box
      sx={{
        width: "100%",
        px: hasPadding ? 2 : 0,
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Text variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
          Selecione os visitantes
        </Text>
        <Box
          sx={{
            mb: 1,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          <Button size="small" variant="outlined" onClick={handleSelectAll}>
            Selecionar Todos
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={handleClearAll}
          >
            Desmarcar Todos
          </Button>
        </Box>
      </Stack>

      <Controller
        name="visitorsIds"
        control={control}
        render={({ field: { onChange, ...restField } }) => (
          <Autocomplete
            {...restField}
            multiple
            id="checkboxes-tags-demo"
            options={sortedOptions}
            disableCloseOnSelect
            disableListWrap
            limitTags={3}
            size="small"
            filterSelectedOptions
            getOptionLabel={(option) => option.name} // Simplified option label
            value={selectedVisitors}
            onChange={(_, newValue) => {
              onSelectVisitors(newValue);
              onChange(
                newValue
                  .map((item: Visitor) => item._id || "")
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
                  <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                    <Text>{capitalize(option.name)}</Text>
                    {option.churchCore && <Text>{option.churchCore}</Text>}
                    {!option.churchCore && (
                      <Text>{formatarTelefone(option.telephone)}</Text>
                    )}
                  </Box>
                </li>
              );
            }}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Visitantes"
                placeholder="Visitantes"
              />
            )}
          />
        )}
      />
    </Box>
  );
});

export default SelectVisitors;
