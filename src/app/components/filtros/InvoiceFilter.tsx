import React from "react";
import { CustomizedAccordions } from "../accordion/Accordion";
import { Select, MenuItem, Stack } from "@mui/material";
import { Pesquisa } from "./Pesquisa";
import { GroupFamily } from "@/types";
import { useGroupFamilyStore } from "@/contexts";
import SelectFamilies from "../autoComplete/SelectFamilies";

export const InvoiceFilter = ({
  parametrosDeBusca,
  setParametrosDeBusca,
}: {
  parametrosDeBusca: string;
  setParametrosDeBusca: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { allGroupFamilies } = useGroupFamilyStore();
  const [selectedFamily, setSelectedFamily] = React.useState<string>("");

  return (
    <CustomizedAccordions title="Filtros" open={false}>
      <Stack direction="row" spacing={2}>
        <Pesquisa
          parametrosDeBusca={parametrosDeBusca}
          setParametrosDeBusca={setParametrosDeBusca}
        />

        <SelectFamilies families={allGroupFamilies!} />
      </Stack>
    </CustomizedAccordions>
  );
};
