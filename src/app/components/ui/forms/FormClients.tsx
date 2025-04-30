import { fotoUploadProps, User, UserAdmin } from "@/types";
import { Box, Stack } from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import Text from "../text/Text";
import { EntradaTexto } from "../entradaTexto/EntradaTexto";
import SwitchSelector from "react-switch-selector";
import { useState, useMemo, useCallback } from "react";
import { FormActions } from "./FormActions";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSnackbar } from "../../snackbar/SnackbarProvider";
import { useAddAdmin, useAddUser, useUpdateUser } from "@/hooks/mutations";
import { UploadPicture } from "../uploadFoto/UploadPicture";
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
};

export const FormClients = () => {
  const { allUsers, userToEdit, isEditing, updateUserToEdit, updateIsEditing } =
    useUserStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const EDITING_FORM_VALUES = {
    name: userToEdit?.name || "",
    telephone: userToEdit?.telephone || "",
  };

  const userForm = useForm<User>({
    defaultValues: isEditing ? EDITING_FORM_VALUES : INITIAL_FORM_VALUES,
    mode: "onChange",
  });
  const { control, getValues, reset } = userForm;
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

  // Memoize the form validation to prevent unnecessary re-renders
  const isFormValid = useMemo(() => {
    const requiredFields = [watchedNome, watchedTelefone];
    if (checked) {
      requiredFields.push(watchedEmail!);
    }

    return requiredFields.every(
      (field) => typeof field === "string" && field.trim() !== ""
    );
  }, [watchedNome, watchedEmail, watchedTelefone, checked]);

  const handleSetChecked = useCallback((value: boolean) => {
    setChecked(value);
  }, []);

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
    const userExists = allUsers?.some(
      (user) => user.telephone === watchedTelefone
    );

    if (userExists && !isEditing) {
      showSnackbar({
        message: "Cliente já cadastrado!",
        severity: "warning",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { name, email, ...userValues } = getValues();
      const isEditingFotoPerfil = userToEdit?.imageBase64 || "";

      const userPayload: User = {
        ...userValues,
        name,
        isAdmin: checked,
        imageBase64: isEditing ? isEditingFotoPerfil : fotoPerfil?.base64 || "",
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
    allUsers,
    watchedTelefone,
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
            fotoUpdate={userToEdit?.imageBase64}
          />
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
          <EntradaTexto name="name" control={control} label="Nome" />
          {!checked && (
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
            <EntradaTexto
              name="telephone"
              control={control}
              label="Telefone"
              mask="(99) 99999-9999"
            />
          </Stack>
        )}

        {!isEditing && (
          <>
            <Text color="textSecondary" fontWeight="bold">
              Perfil do usuário
            </Text>

            <SwitchSelector
              onChange={handleSetChecked}
              options={optionsSwitch}
              initialSelectedIndex={optionsSwitch.findIndex(
                ({ value }) => value === (checked ? 1 : 0) // Compare with 1 for true (Admin) and 0 for false (Client)
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
};
