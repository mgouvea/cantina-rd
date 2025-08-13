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
  useTheme,
  useMediaQuery,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  React.useEffect(() => {
    onGroupFamilyFilter(selectedFamiliesState);
  }, [selectedFamiliesState, onGroupFamilyFilter]);

  const handleSelectFamiliesInFilter = (families: GroupFamilyWithOwner[]) => {
    setSelectedFamiliesState(families);
  };

  return (
    <CustomizedAccordions title="Filtros" open={false}>
      <Stack direction="column" spacing={isMobile ? 1 : 2} sx={{ p: isMobile ? 0.5 : 1 }}>
        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={isMobile ? 1 : 2}
          sx={{ width: "100%" }}
        >
          <Search
            parametrosDeBusca={parametrosDeBusca}
            setParametrosDeBusca={setParametrosDeBusca}
          />

          <FormControl 
            fullWidth 
            sx={{
              ...inputsStyles,
              maxWidth: isMobile ? "100%" : "249px",
              my: isMobile ? 0.5 : 2,
            }}
            size={isMobile ? "small" : "medium"}
          >
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
