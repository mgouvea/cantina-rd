"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Box, Stack } from "@mui/material";
import { Categories, fotoUploadProps } from "@/types/products";
import { EntradaTexto } from "../entradaTexto/EntradaTexto";
import { useAddCategory } from "@/hooks/mutations";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSnackbar } from "../../snackbar/SnackbarProvider";
import { FormActions } from "./FormActions";
import { UploadPicture } from "../uploadFoto/UploadPicture";
import { useQueryClient } from "@tanstack/react-query";

const INITIAL_CATEGORY_FORM_VALUES: Categories = {
  name: "",
  imageBase64: "",
};

export const CategoriesForm = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const { mutateAsync: addCategory } = useAddCategory();

  const categoriesForm = useForm<Categories>({
    defaultValues: INITIAL_CATEGORY_FORM_VALUES,
    mode: "onChange", // Enable validation on change for immediate feedback
  });

  const {
    control: categoriesControl,
    getValues: getCategoriesValues,
    reset: resetCategories,
    watch,
  } = categoriesForm;

  // Watch the name field for changes
  const categoryName = watch("name");

  const [fotoCategory, setFotoCategory] = useState<fotoUploadProps | null>(
    null
  );
  const [hovering, setHovering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize the form validation to prevent unnecessary re-renders
  const isFormValid = useMemo(() => {
    return categoryName !== "" && fotoCategory !== null;
  }, [categoryName, fotoCategory]);

  // Use useCallback to memoize functions
  const handleSaveCategory = useCallback(async () => {
    setIsSubmitting(true);
    const categoryPayload: Categories = {
      ...getCategoriesValues(),
      imageBase64: fotoCategory?.base64 || "",
    };

    try {
      await addCategory(categoryPayload);
      showSnackbar({
        message: "Categoria cadastrada com sucesso!",
        severity: "success",
      });
      resetCategories();
      setFotoCategory(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      router.push("/categorias");
    } catch (error) {
      showSnackbar({
        message: `Erro ao salvar a categoria - ${error}`,
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    addCategory,
    getCategoriesValues,
    fotoCategory,
    resetCategories,
    router,
    showSnackbar,
    queryClient,
  ]);

  const handleClearForm = useCallback(() => {
    resetCategories(INITIAL_CATEGORY_FORM_VALUES);
    setFotoCategory(null);
  }, [resetCategories]);

  const handleHover = useCallback((value: boolean) => {
    setHovering(value);
  }, []);

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
          <UploadPicture
            fotoUpload={fotoCategory}
            onRemove={() => setFotoCategory(null)}
            onHover={handleHover}
            hovering={hovering}
            avatarTitle="Categoria"
            setFotoUpload={setFotoCategory}
          />
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
        onClear={handleClearForm}
        onSave={handleSaveCategory}
        disabled={!isFormValid}
        isSubmitting={isSubmitting}
      />
    </Stack>
  );
};
