import React from "react";
import SelectFamilies from "../autoComplete/SelectFamilies";
import { CustomizedAccordions } from "../accordion/Accordion";
import { GroupFamilyWithOwner } from "@/types";
import { Search } from "./Search";
import { useForm } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

const STATUS_OPTIONS = [
  { value: "OPEN", label: "Em Aberto" },
  { value: "PARTIALLY_PAID", label: "Pago parcialmente" },
  { value: "PAID", label: "Pago" },
  { value: "", label: "Todos" },
];

export const InvoiceFilter = ({
  parametrosDeBusca,
  setParametrosDeBusca,
  status,
  setStatus,
  onGroupFamilyFilter,
}: {
  parametrosDeBusca: string;
  setParametrosDeBusca: React.Dispatch<React.SetStateAction<string>>;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  onGroupFamilyFilter: (families: GroupFamilyWithOwner[]) => void;
}) => {
  const { control, setValue } = useForm<{ groupFamilyIds: string[] }>({
    defaultValues: { groupFamilyIds: [] },
  });
  const [selectedFamiliesState, setSelectedFamiliesState] = React.useState<
    GroupFamilyWithOwner[]
  >([]);

  React.useEffect(() => {
    onGroupFamilyFilter(selectedFamiliesState);
  }, [selectedFamiliesState, onGroupFamilyFilter]);

  const handleSelectFamiliesInFilter = (families: GroupFamilyWithOwner[]) => {
    setSelectedFamiliesState(families);
  };

  return (
    <CustomizedAccordions title="Filtros" open={false}>
      <Stack direction="column" spacing={2} sx={{ p: 1 }}>
        <Stack direction="row" spacing={2}>
          <Search
            parametrosDeBusca={parametrosDeBusca}
            setParametrosDeBusca={setParametrosDeBusca}
          />

          <FormControl fullWidth sx={inputsStyles}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status-select"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <SelectFamilies
          invoiceForm={{ setValue }}
          control={control}
          selectedFamilies={selectedFamiliesState}
          onSelectFamilies={handleSelectFamiliesInFilter}
        />
      </Stack>
    </CustomizedAccordions>
  );
};

const inputsStyles = {
  my: 2,
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    maxHeight: "48px",
  },
  maxWidth: "249px",
};
