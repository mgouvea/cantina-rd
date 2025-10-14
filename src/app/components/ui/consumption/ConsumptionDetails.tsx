"use client";

import React from "react";
import { Box, Paper, Collapse, List, ListItem, ListItemText, Divider, Chip, Typography } from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { capitalizeFirstLastName, findUserById } from "@/utils";
import type { User } from "@/types";

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ConsumptionEntry {
  date: string | Date;
  products: Product[];
}

export interface ConsumptionByPerson {
  [userId: string]: ConsumptionEntry[];
}

interface ConsumptionDetailsProps {
  consumptionData: ConsumptionByPerson;
  dataUser: User[] | null;
}

const ConsumptionDetails: React.FC<ConsumptionDetailsProps> = ({ consumptionData, dataUser }) => {
  const [expandedUser, setExpandedUser] = React.useState<string | null>(null);

  if (!consumptionData || Object.keys(consumptionData).length === 0) {
    return <Typography variant="body2">Nenhum consumo registrado</Typography>;
  }

  const toggleUserExpand = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const calculateUserTotal = (entries: ConsumptionEntry[]): number => {
    return entries.reduce((total, entry) => {
      const entryTotal = entry.products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );
      return total + entryTotal;
    }, 0);
  };

  return (
    <Box sx={{ maxHeight: 300, overflow: "auto", width: "100%" }}>
      {Object.entries(consumptionData).map(([userId, entries]) => {
        const userTotal = calculateUserTotal(entries);

        return (
          <Paper key={userId} sx={{ mb: 1, p: 1 }}>
            <Box
              onClick={() => toggleUserExpand(userId)}
              sx={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle2">
                Membro: {capitalizeFirstLastName(findUserById(userId, dataUser)?.name)}
              </Typography>
              <Chip label={`R$ ${userTotal.toFixed(2)}`} color="primary" size="small" />
            </Box>

            <Collapse in={expandedUser === userId}>
              <List dense>
                {entries.map((entry, entryIndex) => (
                  <React.Fragment key={entryIndex}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {format(new Date(entry.date), "dd/MM/yyyy HH:mm", {
                              locale: ptBR,
                            })}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider />
                    {entry.products.map((product, productIndex) => (
                      <ListItem key={productIndex} sx={{ pl: 4 }}>
                        <ListItemText
                          primary={
                            <Typography variant="body2">
                              {product.name} - {product.quantity}x R$ {product.price.toFixed(2)}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              Total: R$ {(product.price * product.quantity).toFixed(2)}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                    {entryIndex < entries.length - 1 && <Divider sx={{ my: 1 }} />}
                  </React.Fragment>
                ))}
              </List>
            </Collapse>
          </Paper>
        );
      })}
    </Box>
  );
};

export default ConsumptionDetails;
