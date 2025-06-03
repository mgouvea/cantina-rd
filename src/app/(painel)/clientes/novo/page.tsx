"use client";

import { fotoUploadProps, User, UserAdmin } from "@/types";
import { Box, Checkbox, FormControlLabel, Stack } from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import { EntradaTexto } from "@/app/components/";
import SwitchSelector from "react-switch-selector";
import { useState, useMemo, useCallback, useEffect } from "react";
import { FormActions } from "@/app/components";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/app/components";
import { useAddAdmin, useAddUser, useUpdateUser } from "@/hooks/mutations";
import { UploadPicture } from "@/app/components";
import Text from "@/app/components/ui/text/Text";
import { removerMascaraTelefone } from "@/utils";
import { useUserStore } from "@/contexts";

const optionsSwitch = [
  {
    label: "Cliente",
    value: 0,
    selectedBackgroundColor: "#4caf50",
  },
  {
    label: "Administrador",
    value: 1,
    selectedBackgroundColor: "#1565c0",
  },
];

const INITIAL_FORM_VALUES = {
  name: "",
  email: undefined,
  telephone: "",
  isAdmin: false,
  password: "",
  groupFamily: "",
  isChild: false,
};

export default function FormClientsPage() {
  const { allUsers, userToEdit, isEditing, updateUserToEdit, updateIsEditing } =
    useUserStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const EDITING_FORM_VALUES = {
    name: userToEdit?.name || "",
    telephone: userToEdit?.telephone || "",
    isChild: userToEdit?.isChild || false,
  };

  const userForm = useForm<User>({
    defaultValues: isEditing ? EDITING_FORM_VALUES : INITIAL_FORM_VALUES,
    mode: "onChange",
  });
  const { control, getValues, reset, setValue } = userForm;
  const { showSnackbar } = useSnackbar();

  const { mutateAsync: addUser } = useAddUser();
  const { mutateAsync: updateUser } = useUpdateUser();
  const { mutateAsync: addAdmin } = useAddAdmin();

  const [checked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fotoPerfil, setFotoPerfil] = useState<fotoUploadProps | null>(null);
  const [hovering, setHovering] = useState(false);

  const watchedNome = useWatch<User>({ control, name: "name" }) as string;
  const watchedEmail = useWatch<User>({ control, name: "email" }) as
    | string
    | undefined;
  const watchedTelefone = useWatch<User>({
    control,
    name: "telephone",
  }) as string;
  const watchedIsChild = useWatch<User>({
    control,
    name: "isChild",
  }) as boolean;

  // Initialize isChild from form values
  useEffect(() => {
    if (isEditing && userToEdit?.isChild !== undefined) {
      setValue("isChild", userToEdit.isChild);
    }
  }, [isEditing, userToEdit, setValue]);

  // Memoize the form validation to prevent unnecessary re-renders
  const isFormValid = useMemo(() => {
    const requiredFields = [watchedNome];

    // Only require telephone if not a child
    if (!watchedIsChild) {
      requiredFields.push(watchedTelefone);
    }

    if (checked) {
      requiredFields.push(watchedEmail!);
    }

    return requiredFields.every(
      (field) => typeof field === "string" && field.trim() !== ""
    );
  }, [watchedNome, watchedEmail, watchedTelefone, checked, watchedIsChild]);

  const handleSetChecked = useCallback((value: boolean) => {
    setChecked(value);
  }, []);

  const handleIsChildChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChildChecked = event.target.checked;
      setValue("isChild", isChildChecked);

      // If child, clear telephone field
      if (isChildChecked) {
        setValue("telephone", "");
        // If child is checked, ensure admin is not checked
        setChecked(false);
      }
    },
    [setValue]
  );

  const handleHover = useCallback((value: boolean) => {
    setHovering(value);
  }, []);

  const handleClearForm = useCallback(() => {
    reset(INITIAL_FORM_VALUES);
    setFotoPerfil(null);
    updateIsEditing(false);
    updateUserToEdit(null);
  }, [reset, updateIsEditing, updateUserToEdit]);

  const handleRemoveFoto = useCallback(() => {
    setFotoPerfil(null);
  }, []);

  const handleSaveClient = useCallback(async () => {
    setIsSubmitting(true);

    const telefoneNormalizado = removerMascaraTelefone(watchedTelefone);

    const userExists = allUsers?.some(
      (user) => removerMascaraTelefone(user.telephone) === telefoneNormalizado
    );

    if (userExists && !isEditing) {
      showSnackbar({
        message:
          "Cliente já cadastrado! Este telefone já consta em nossa base de dados.",
        severity: "warning",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { name, email, ...userValues } = getValues();
      const isEditingFotoPerfil = userToEdit?.urlImage || "";

      const userPayload: User = {
        ...userValues,
        name,
        telephone: removerMascaraTelefone(watchedTelefone),
        isAdmin: checked,
        urlImage: isEditing ? isEditingFotoPerfil : fotoPerfil?.base64 || "",
      };

      if (isEditing && userToEdit) {
        await updateUser({
          userPayload: userPayload,
          userId: userToEdit._id!,
        });
      } else {
        const newUser = await addUser(userPayload);

        if (checked) {
          const adminPayload: UserAdmin = {
            idUser: newUser._id,
            name: name,
            email: email!,
            password: "udv@realeza",
          };
          await addAdmin(adminPayload);
        }
      }

      router.replace("/clientes");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      updateIsEditing(false);
      updateUserToEdit(null);
      reset(INITIAL_FORM_VALUES);
      setFotoPerfil(null);
      showSnackbar({
        message: `Cliente ${isEditing ? "editado" : "cadastrado"} com sucesso!`,
        severity: "success",
      });
    } catch (error) {
      showSnackbar({
        message: `Ocorreu um erro ao ${
          isEditing ? "editar" : "cadastrar"
        } o cliente! `,
        severity: "error",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    checked,
    fotoPerfil,
    queryClient,
    router,
    watchedTelefone,
    allUsers,
    userToEdit,
    isEditing,
    addAdmin,
    addUser,
    getValues,
    reset,
    showSnackbar,
    updateIsEditing,
    updateUserToEdit,
    updateUser,
  ]);

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
            fotoUpload={fotoPerfil}
            onRemove={handleRemoveFoto}
            onHover={handleHover}
            hovering={hovering}
            avatarTitle="Perfil"
            setFotoUpload={setFotoPerfil}
            fotoUpdate={userToEdit?.urlImage}
          />
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
          <EntradaTexto name="name" control={control} label="Nome" />
          {!checked && !watchedIsChild && (
            <EntradaTexto
              name="telephone"
              control={control}
              label="Telefone"
              mask="(99) 99999-9999"
            />
          )}
        </Stack>
        {!!checked && (
          <Stack direction="row" gap={1}>
            <EntradaTexto name="email" control={control} label="Email" />
            {!watchedIsChild && (
              <EntradaTexto
                name="telephone"
                control={control}
                label="Telefone"
                mask="(99) 99999-9999"
              />
            )}
          </Stack>
        )}

        <Stack sx={{ justifyContent: "center" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={watchedIsChild || false}
                onChange={handleIsChildChange}
                name="isChild"
              />
            }
            label={
              <Text variant="h6" fontWeight="normal" fontSize={16}>
                É criança?
              </Text>
            }
          />
        </Stack>

        {!isEditing && !watchedIsChild && (
          <>
            <Text variant="h6" fontWeight="bold">
              Perfil do usuário
            </Text>

            <SwitchSelector
              onChange={handleSetChecked}
              options={optionsSwitch}
              initialSelectedIndex={optionsSwitch.findIndex(
                ({ value }) => value === (checked ? 1 : 0)
              )}
              backgroundColor={"#666666"}
              fontColor={"#f5f6fa"}
              fontSize={17}
            />
          </>
        )}
      </Stack>
      <FormActions
        onClear={handleClearForm}
        onSave={handleSaveClient}
        disabled={!isFormValid}
        isSubmitting={isSubmitting}
        isEditing={isEditing}
      />
    </Stack>
  );
}
