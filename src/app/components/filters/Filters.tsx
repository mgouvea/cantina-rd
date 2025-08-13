"use client";

import React, { useEffect, useState } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { GroupFamilyWithOwner } from "@/types";
import { InvoiceFilter } from "./InvoiceFilter";
import { Search } from "./Search";

// Função para normalizar texto removendo acentos
const normalizeText = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

type FiltersProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: (filteredRows: any[]) => React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
  type?: string;
};

export const Filters: React.FC<FiltersProps> = ({ children, rows, type }) => {
  const [parametrosDeBusca, setParametrosDeBusca] = useState("");
  const [selectedFamilies, setSelectedFamilies] = useState<
    GroupFamilyWithOwner[]
  >([]);
  const [finalFilteredRows, setFinalFilteredRows] = useState(rows || []);
  const [status, setStatus] = useState<string>("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    let result = rows || [];

    if (parametrosDeBusca) {
      const normalizedSearch = normalizeText(parametrosDeBusca);
      result = result.filter((row) =>
        Object.values(row).some((value) => {
          const normalizedValue = normalizeText(String(value));
          return normalizedValue.includes(normalizedSearch);
        })
      );
    }

    if (type === "invoice" && selectedFamilies.length > 0) {
      const familyIds = selectedFamilies.map((f) => f._id);
      result = result.filter((row) => familyIds.includes(row.groupFamilyId));
    }

    if (type === "invoice" && status) {
      result = result.filter((row) => row.status === status);
    }

    setFinalFilteredRows(result);
  }, [rows, parametrosDeBusca, selectedFamilies, type, status]);

  const handleGroupFamilyFilter = (families: GroupFamilyWithOwner[]) => {
    setSelectedFamilies(families);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          flexWrap: "wrap",
          alignItems: isMobile ? "stretch" : "center",
          justifyContent: "space-between",
          gap: isMobile ? 1 : 2,
          mb: isMobile ? 1 : 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            flex: 1,
            width: "100%",
            minWidth: { xs: "100%", sm: 300 },
          }}
        >
          {type !== "invoice" && (
            <Search
              parametrosDeBusca={parametrosDeBusca}
              setParametrosDeBusca={setParametrosDeBusca}
            />
          )}
          {type === "invoice" && (
            <InvoiceFilter
              parametrosDeBusca={parametrosDeBusca}
              setParametrosDeBusca={setParametrosDeBusca}
              status={status}
              setStatus={setStatus}
              onGroupFamilyFilter={handleGroupFamilyFilter}
            />
          )}
        </Box>
      </Box>
      {children(finalFilteredRows)}
    </>
  );
};
