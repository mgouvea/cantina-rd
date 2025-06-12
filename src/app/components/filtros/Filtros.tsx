"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import { Pesquisa } from "./Pesquisa";
import { InvoiceFilter } from "./InvoiceFilter";

type FiltrosProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: (filteredRows: any[]) => React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
  type?: string;
};

export const Filtros: React.FC<FiltrosProps> = ({ children, rows, type }) => {
  const [parametrosDeBusca, setParametrosDeBusca] = useState("");

  const filteredRows = rows?.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(parametrosDeBusca.toLowerCase())
    )
  );

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
            />
          )}
        </Box>
      </Box>
      {children(filteredRows)}
    </>
  );
};
