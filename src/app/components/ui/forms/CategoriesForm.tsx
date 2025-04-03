import AddIcon from "@mui/icons-material/Add";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import React, { ChangeEvent, useState } from "react";
import { Botao } from "../botao/Botao";
import { EntradaTexto } from "../entradaTexto/EntradaTexto";
import { Categories } from "@/types/products";
import { useForm } from "react-hook-form";
import { Avatar, Box, IconButton, Stack } from "@mui/material";
import { useSnackbar } from "../../snackbar/SnackbarProvider";
import { useRouter } from "next/navigation";
import { useAddCategory } from "@/hooks/mutations";

interface fotoCategoryProps {
  base64Image: string;
  name: string;
  size: number;
  type: string;
}

interface FormActionsProps {
  onClear: () => void;
  onSave: () => void;
  disabled?: boolean;
}

const INITIAL_CATEGORY_FORM_VALUES = {
  name: "",
};

export const CategoriesForm = () => {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const { mutateAsync: addCategory } = useAddCategory();

  const categoriesForm = useForm<Categories>({
    defaultValues: INITIAL_CATEGORY_FORM_VALUES,
  });
  const {
    control: categoriesControl,
    getValues: getCategoriesValues,
    reset: resetCategories,
  } = categoriesForm;

  const [fotoCategory, setFotoCategory] = useState<fotoCategoryProps | null>(
    null
  );
  const [hovering, setHovering] = useState(false);

  const handleUploadFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove the data:image prefix from base64 string if it exists
      const base64Clean = base64.includes("base64,")
        ? base64
        : base64.replace(/^data:image\/png;base64,/, "");

      setFotoCategory({
        base64Image: base64Clean,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCategory = async () => {
    const categoryPayload: Categories = {
      ...getCategoriesValues(),
      base64Image: fotoCategory?.base64Image || "",
    };

    console.log(categoryPayload);

    try {
      await addCategory(categoryPayload);
      showSnackbar({
        message: "Categoria cadastrada com sucesso!",
        severity: "success",
      });
      resetCategories();
      setFotoCategory(null);
      router.push("/painel/produtos");
    } catch (error) {
      showSnackbar({
        message: `Erro ao salvar a categoria - ${error}`,
        severity: "error",
      });
    }
  };

  return (
    <Stack gap={2}>
      <Stack
        sx={{
          px: { xs: 2, sm: 4, md: 25 },
          pt: 2,
          width: { xs: "100%", md: "80%" },
          margin: "0 auto",
        }}
        gap={2}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "end",
          }}
          gap={1}
        >
          <ProductPicture
            fotoCategory={fotoCategory}
            onRemove={() => setFotoCategory(null)}
            onHover={setHovering}
            hovering={hovering}
          />
          <UploadImageButton onUpload={handleUploadFile} />
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
          <EntradaTexto
            name="name"
            control={categoriesControl}
            label="Nome da categoria"
          />
        </Stack>
      </Stack>

      <FormActions
        onClear={() => {
          resetCategories(INITIAL_CATEGORY_FORM_VALUES);
          setFotoCategory(null);
        }}
        onSave={handleSaveCategory}
        disabled={getCategoriesValues().name === "" || fotoCategory === null}
      />
    </Stack>
  );
};

const ProductPicture = ({
  fotoCategory,
  onRemove,
  onHover,
  hovering,
}: {
  fotoCategory: fotoCategoryProps | null;
  onRemove: () => void;
  onHover: (hover: boolean) => void;
  hovering: boolean;
}) => (
  <Box
    sx={{ position: "relative", display: "inline-block" }}
    onMouseEnter={() => onHover(true)}
    onMouseLeave={() => onHover(false)}
  >
    <Avatar
      alt="Foto da categoria"
      sx={{
        width: 106,
        height: 106,
        cursor: fotoCategory ? "pointer" : "default",
      }}
      src={fotoCategory?.base64Image}
    >
      {fotoCategory ? "" : "Categoria"}
    </Avatar>
    {hovering && fotoCategory && (
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
);

const UploadImageButton = ({
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
        Alterar foto da categoria
      </Botao>
    </label>
  </Box>
);

const FormActions = ({ onClear, onSave, disabled }: FormActionsProps) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-end",
      gap: 2,
      marginTop: 3,
      px: { xs: 2, sm: 4 },
    }}
  >
    <Botao
      variant="contained"
      color="error"
      onClick={() => {
        onClear();
      }}
      sx={{ paddingX: 7, borderRadius: "8px" }}
    >
      Limpar
    </Botao>
    <Botao
      variant="contained"
      color="success"
      onClick={onSave}
      disabled={disabled}
      sx={{ paddingX: 10, borderRadius: "8px" }}
    >
      Cadastrar
    </Botao>
  </Box>
);
