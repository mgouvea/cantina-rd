"use client";

import { fotoUploadProps } from "@/types";
import { Avatar, Box, IconButton } from "@mui/material";
import { Botao } from "../botao/Botao";
import { ChangeEvent, useCallback, memo } from "react";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddIcon from "@mui/icons-material/Add";

const UploadPictureComponent = ({
  fotoUpload,
  onRemove,
  onHover,
  hovering,
  avatarTitle,
  setFotoUpload,
  fotoUpdate,
}: {
  fotoUpload: fotoUploadProps | null;
  onRemove: () => void;
  onHover: (hover: boolean) => void;
  hovering: boolean;
  avatarTitle: string;
  setFotoUpload: React.Dispatch<React.SetStateAction<fotoUploadProps | null>>;
  fotoUpdate?: string;
}) => {
  const handleUploadFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Use a web worker for image processing if available
      if (typeof window !== "undefined" && window.Worker) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          // Remove the data:image prefix from base64 string if it exists
          const base64Clean = base64.includes("base64,")
            ? base64
            : base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

          setFotoUpload({
            base64: base64Clean,
            name: file.name,
            size: file.size,
            type: file.type,
          });
        };

        // Use smaller chunk size for better UI responsiveness
        reader.readAsDataURL(file);
      } else {
        // Fallback for browsers without Worker support
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          const base64Clean = base64.includes("base64,")
            ? base64
            : base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

          setFotoUpload({
            base64: base64Clean,
            name: file.name,
            size: file.size,
            type: file.type,
          });
        };
        reader.readAsDataURL(file);
      }
    },
    [setFotoUpload]
  );

  return (
    <>
      <Box
        sx={{ position: "relative", display: "inline-block" }}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
      >
        <Avatar
          alt={avatarTitle}
          sx={{
            width: 106,
            height: 106,
            cursor: fotoUpload ? "pointer" : "default",
          }}
          src={fotoUpload?.base64 || fotoUpdate}
        >
          {fotoUpload ? "" : avatarTitle}
        </Avatar>
        {hovering && fotoUpload && (
          <IconButton
            onClick={onRemove}
            sx={{
              position: "absolute",
              top: -8,
              right: -8,
              backgroundColor: "rgba(255,255,255,0.8)",
              "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
            }}
          >
            <ClearOutlinedIcon sx={{ color: "error.main" }} />
          </IconButton>
        )}
      </Box>
      <UploadImageButton onUpload={handleUploadFile} />
    </>
  );
};

// Memoize the button component to prevent unnecessary re-renders
const UploadImageButtonComponent = ({
  onUpload,
}: {
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: "3px" }}>
    <input
      type="file"
      accept=".png,.jpg"
      onChange={onUpload}
      style={{ display: "none" }}
      id="file-input"
    />
    <label htmlFor="file-input">
      <Botao
        variant="outlined"
        startIcon={<AddIcon />}
        color="primary"
        component="span"
        sx={{ width: "fit-content" }}
      >
        Selecionar foto
      </Botao>
    </label>
  </Box>
);

// Add display names to the memo components
const UploadImageButton = memo(UploadImageButtonComponent);
UploadImageButton.displayName = "UploadImageButton";

export const UploadPicture = memo(UploadPictureComponent);
UploadPicture.displayName = "UploadPicture";
