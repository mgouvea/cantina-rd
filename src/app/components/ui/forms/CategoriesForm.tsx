"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Box, Stack } from "@mui/material";
import { Categories, fotoUploadProps } from "@/types/products";
import { EntradaTexto } from "../entradaTexto/EntradaTexto";
import { FormActions } from "./FormActions";
import { UploadPicture } from "../uploadFoto/UploadPicture";
import { useAddCategory, useUpdateCategory } from "@/hooks/mutations";
import { useCategoryStore } from "@/contexts";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSnackbar } from "../../snackbar/SnackbarProvider";

const INITIAL_CATEGORY_FORM_VALUES: Categories = {
  name: "",
  imageBase64: "",
};

export const CategoriesForm = () => {
  const { updateCategoryToEdit, updateIsEditing, isEditing, categoryToEdit } =
    useCategoryStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync: addCategory } = useAddCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const { showSnackbar } = useSnackbar();

  const EDITING_CATEGORY_FORM_VALUES: Categories = {
    name: categoryToEdit?.name || "",
    imageBase64: categoryToEdit?.imageBase64 || "",
  };

  const categoriesForm = useForm<Categories>({
    defaultValues: isEditing
      ? EDITING_CATEGORY_FORM_VALUES
      : INITIAL_CATEGORY_FORM_VALUES,
    mode: "onChange", // Enable validation on change for immediate feedback
  });

  const {
    control: categoriesControl,
    getValues: getCategoriesValues,
    reset: resetCategories,
    watch,
  } = categoriesForm;

  const categoryName = watch("name");

  const [fotoCategory, setFotoCategory] = useState<fotoUploadProps | null>(
    categoryToEdit?.imageBase64
      ? { base64: categoryToEdit.imageBase64, name: "", size: 0, type: "" }
      : null
  );
  const [hovering, setHovering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = useMemo(() => {
    // Quando estiver editando, considere válido se tiver nome e (fotoCategory OU imageBase64 existente)
    return (
      categoryName !== "" &&
      (fotoCategory !== null || (isEditing && categoryToEdit?.imageBase64))
    );
  }, [categoryName, fotoCategory, isEditing, categoryToEdit?.imageBase64]);

  const handleSaveCategory = useCallback(async () => {
    setIsSubmitting(true);

    const categoryId = categoryToEdit?._id || "";
    const imageBase64ToEditing = fotoCategory?.base64 || "";

    const categoryPayload: Categories = {
      ...getCategoriesValues(),
      imageBase64: isEditing
        ? imageBase64ToEditing
        : fotoCategory?.base64 || "",
    };

    try {
      if (isEditing) {
        await updateCategory({
          categoriesId: categoryId,
          categories: categoryPayload,
        });
      } else {
        await addCategory(categoryPayload);
      }
      showSnackbar({
        message: `Categoria ${
          isEditing ? "editada" : "cadastrada"
        } com sucesso!`,
        severity: "success",
      });
      resetCategories();
      setFotoCategory(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      router.push("/categorias");
    } catch (error) {
      showSnackbar({
        message: `Erro ao ${isEditing ? "editar" : "cadastrar"} a categoria`,
        severity: "error",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    categoryToEdit?._id,
    fotoCategory?.base64,
    isEditing,
    queryClient,
    router,
    getCategoriesValues,
    showSnackbar,
    resetCategories,
    updateCategory,
    addCategory,
  ]);

  const handleClearForm = useCallback(() => {
    resetCategories(INITIAL_CATEGORY_FORM_VALUES);
    setFotoCategory(null);
    updateIsEditing(false);
    updateCategoryToEdit(null);
  }, [resetCategories, updateIsEditing, updateCategoryToEdit]);

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
            fotoUpdate={categoryToEdit?.imageBase64}
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
        isEditing={isEditing}
      />
    </Stack>
  );
};
