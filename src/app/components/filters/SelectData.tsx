"use client";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import React from "react";
import Text from "../ui/text/Text";
import { Box, Button, IconButton, Popover, TextField } from "@mui/material";
import {
  DateRange,
  RangeKeyDict,
  Range as DateRangePickerRange,
} from "react-date-range";

interface SelectDataProps {
  getDateRangeText: () => string;
  handleCalendarOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleCalendarClose: () => void;
  handleDateRangeSelect: (rangesByKey: RangeKeyDict) => void;
  handleDateRangeConfirm: () => void;
  open: boolean;
  anchorEl: null | HTMLElement;
  state: DateRangePickerRange[];
  isDashboard?: boolean;
}

export const SelectData: React.FC<SelectDataProps> = ({
  getDateRangeText,
  handleCalendarOpen,
  handleCalendarClose,
  handleDateRangeSelect,
  handleDateRangeConfirm,
  open,
  anchorEl,
  state,
  isDashboard = false,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        px: 2,
      }}
    >
      {!isDashboard && (
        <Text variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
          Selecione o período
        </Text>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            maxHeight: "48px",
          },
        }}
      >
        <TextField
          fullWidth
          value={getDateRangeText()}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <IconButton onClick={handleCalendarOpen} edge="end">
                <CalendarTodayIcon />
              </IconButton>
            ),
          }}
          label="Período"
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleCalendarClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Box sx={{ p: 1 }}>
            <DateRange
              editableDateInputs={true}
              onChange={handleDateRangeSelect}
              moveRangeOnFirstSelection={false}
              ranges={state}
              rangeColors={["#3f51b5", "#2196f3", "#00bcd4"]}
              maxDate={new Date()} // Limita a seleção até o dia atual
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 1,
              }}
            >
              <Button
                variant="contained"
                onClick={handleDateRangeConfirm}
                sx={{ borderRadius: "8px" }}
              >
                OK
              </Button>
            </Box>
          </Box>
        </Popover>
      </Box>
    </Box>
  );
};
