"use client";

import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Pesquisa } from "./Pesquisa";
import { InvoiceFilter } from "./InvoiceFilter";
import { GroupFamilyWithOwner } from "@/types";

type FiltrosProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: (filteredRows: any[]) => React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
  type?: string;
};

export const Filtros: React.FC<FiltrosProps> = ({ children, rows, type }) => {
  const [parametrosDeBusca, setParametrosDeBusca] = useState("");
  const [selectedFamilies, setSelectedFamilies] = useState<
    GroupFamilyWithOwner[]
  >([]);
  const [finalFilteredRows, setFinalFilteredRows] = useState(rows || []);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    let result = rows || [];

    if (parametrosDeBusca) {
      result = result.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(parametrosDeBusca.toLowerCase())
        )
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
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: { xs: 250, sm: 300 },
          }}
        >
          {type !== "invoice" && (
            <Pesquisa
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
