import { Box } from "@mui/material";
import { ButtonComponent } from "../button/ButtonComponent";

interface FormActionsProps {
  onClear: () => void;
  onSave: () => void;
  disabled?: boolean;
  isSubmitting: boolean;
  isEditing?: boolean;
  isGroupFamilyEdit?: boolean;
  isFatura?: boolean;
}

export const FormActions = ({
  onClear,
  onSave,
  disabled,
  isSubmitting,
  isEditing,
  isGroupFamilyEdit,
  isFatura,
}: FormActionsProps) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-end",
      gap: 2,
      marginTop: 3,
      px: { xs: 2, sm: 4 },
    }}
  >
    <ButtonComponent
      variant="contained"
      color="error"
      onClick={() => {
        onClear();
      }}
      sx={{ paddingX: 7, borderRadius: "8px" }}
    >
      {isGroupFamilyEdit ? "Voltar" : "Limpar"}
    </ButtonComponent>
    <ButtonComponent
      variant="contained"
      color="success"
      onClick={onSave}
      disabled={disabled || isSubmitting}
      sx={{ paddingX: 10, borderRadius: "8px" }}
    >
      {isSubmitting && !isEditing
        ? "Cadastrando..."
        : isSubmitting && isEditing
        ? "Atualizando..."
        : !isSubmitting && isEditing
        ? "Atualizar"
        : isFatura
        ? "Gerar"
        : "Cadastrar"}
    </ButtonComponent>
  </Box>
);
