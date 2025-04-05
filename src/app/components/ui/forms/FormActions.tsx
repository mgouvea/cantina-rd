import { Box } from "@mui/material";
import { Botao } from "../botao/Botao";

interface FormActionsProps {
  onClear: () => void;
  onSave: () => void;
  disabled?: boolean;
  isSubmitting: boolean;
}

export const FormActions = ({
  onClear,
  onSave,
  disabled,
  isSubmitting,
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
      disabled={disabled || isSubmitting}
      sx={{ paddingX: 10, borderRadius: "8px" }}
    >
      {isSubmitting ? "Cadastrando..." : "Cadastrar"}
    </Botao>
  </Box>
);
