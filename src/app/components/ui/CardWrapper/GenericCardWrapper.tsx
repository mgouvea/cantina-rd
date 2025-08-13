import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import React, { useState } from "react";
import Text from "../text/Text";
import { Box, Stack, TextField, InputAdornment } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import GenericBreadcrumbs from "../../breadcrumb/GenericBreadcrumb";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface GenericCardWrapperProps {
  children: React.ReactNode;
  title: string;
  breadcrumbItems?: BreadcrumbItem[];
  handlePlusClick?: () => void;
  searchable?: boolean;
  onSearch?: (searchTerm: string) => void;
}

export const GenericCardWrapper = ({
  children,
  title,
  breadcrumbItems,
  handlePlusClick,
  searchable = false,
  onSearch,
}: GenericCardWrapperProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchTerm, setSearchTerm] = useState("");

  // Filter children if they are an array and we're on mobile with searchable enabled
  const renderChildren = () => {
    if (!isMobile || !searchable || !Array.isArray(children)) {
      return children;
    }

    // If onSearch is provided, we let the parent component handle the filtering
    if (onSearch) {
      return children;
    }

    // Otherwise, we do client-side filtering
    // This assumes children are React elements with props that include a 'name' property
    return React.Children.toArray(children).filter((child) => {
      if (React.isValidElement(child) && child.props.name) {
        return child.props.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
      return true;
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {breadcrumbItems && <GenericBreadcrumbs items={breadcrumbItems} />}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={isMobile ? 1 : 2}
      >
        <Text variant={isMobile ? "h6" : "h5"}>{title}</Text>

        <IconButton
          aria-label="add"
          sx={{ color: "success.main" }}
          onClick={handlePlusClick}
        >
          <AddCircleIcon fontSize={isMobile ? "medium" : "large"} />
        </IconButton>
      </Stack>

      {isMobile && searchable && (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por nome..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (onSearch) {
                onSearch(e.target.value);
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#fff",
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.15)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.3)",
                },
              },
            }}
          />
        </Box>
      )}

      {searchable && isMobile}

      {renderChildren()}
    </Box>
  );
};
