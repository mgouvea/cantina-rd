"use client";
import React from "react";
import GenericModal from "./GenericModal";
import { Box, IconButton, useTheme, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { capitalizeFirstLastName } from "@/utils";

type ImageModalProps = {
  userName: string;
  description: string;
  urlImage: string;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
};

export const ImageModal: React.FC<ImageModalProps> = ({
  userName,
  description,
  urlImage,
  openModal,
  setOpenModal,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  return (
    <GenericModal
      title={`${description} - ${capitalizeFirstLastName(userName)}`}
      open={openModal}
      handleClose={() => {
        setOpenModal(false);
      }}
      isImageModal
      handleConfirm={() => setOpenModal(false)}
    >
      <Box sx={{ p: 3, position: "relative" }}>
        <IconButton
          aria-label="close"
          onClick={() => setOpenModal(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "grey.500",
            bgcolor: "rgba(255, 255, 255, 0.7)",
            zIndex: 1,
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.9)",
              color: "grey.800",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            width: "100%",
            height: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={urlImage}
            alt={description}
            width={isMobile ? 300 : isTablet ? 400 : 500}
            height={isMobile ? 300 : isTablet ? 400 : 500}
            style={{
              maxWidth: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>
    </GenericModal>
  );
};
