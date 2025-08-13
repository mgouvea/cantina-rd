import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/contexts";
import { useDeleteProduct } from "@/hooks/mutations/useProducts.mutation";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { Products } from "@/types";

interface CardProductsProps extends Products {
  handleDeleteClick?: () => void;
}

export const CardProducts = ({
  _id,
  name,
  price,
  urlImage,
  isActive,
  description,
  subcategoryId,
  handleDeleteClick: externalHandleDeleteClick,
  ...rest
}: CardProductsProps) => {
  const router = useRouter();
  const { updateProductToEdit, updateIsEditing } = useProductStore();
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const handleEditClick = () => {
    // Update product store with current product data
    updateProductToEdit({
      _id,
      name,
      price,
      urlImage,
      isActive,
      description,
      subcategoryId,
      ...rest,
    });
    updateIsEditing(true);
    router.push("/produtos/novo");
  };

  const internalHandleDeleteClick = async () => {
    if (_id) {
      await deleteProduct({ productId: _id });
    }
  };

  // Use external handler if provided, otherwise use internal handler
  const handleDeleteClick =
    externalHandleDeleteClick || internalHandleDeleteClick;

  const subcategory = subcategoryId;
  // Check if subcategory is an object with a name property
  const subcategoryName =
    typeof subcategory === "object" && subcategory !== null
      ? subcategory.name
      : "";

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: "12px",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "100%",
        }}
      >
        {/* Content section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "70%",
            p: 2.5,
            position: "relative",
          }}
        >
          {/* Status indicator */}
          <Box sx={{ position: "absolute", top: 12, right: 12 }}>
            <Switch
              checked={isActive}
              onChange={() => {}}
              size="small"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#4CAF50",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#81C784",
                },
              }}
            />
          </Box>

          {/* Product info */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 0.5,
                color: "#333",
                fontSize: "1.1rem",
              }}
            >
              {name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 2,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                height: "40px",
              }}
            >
              {description}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: "1.5rem",
              }}
            >
              R$ {price}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Bottom section with category and actions */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {subcategoryName && (
              <Chip
                icon={<LocalOfferIcon fontSize="small" />}
                label={subcategoryName}
                size="small"
                sx={{
                  bgcolor: "rgba(25, 118, 210, 0.08)",
                  color: "primary.main",
                  fontWeight: 500,
                  "& .MuiChip-icon": {
                    color: "primary.main",
                  },
                }}
              />
            )}

            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton
                size="small"
                sx={{
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.08)" },
                }}
                onClick={handleEditClick}
              >
                <EditIcon sx={{ fontSize: 23, color: "#555" }} />
              </IconButton>

              <IconButton
                size="small"
                sx={{
                  bgcolor: "rgba(155, 11, 0, 0.04)",
                  "&:hover": { bgcolor: "rgba(155, 11, 0, 0.08)" },
                }}
                onClick={handleDeleteClick}
              >
                <DeleteIcon sx={{ fontSize: 23, color: "#9B0B00" }} />
              </IconButton>
            </Box>
          </Stack>
        </Box>

        {/* Image section */}
        <Box
          sx={{
            width: "30%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f5f5f5",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Image
            src={urlImage}
            alt={name}
            width={120}
            height={120}
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};
