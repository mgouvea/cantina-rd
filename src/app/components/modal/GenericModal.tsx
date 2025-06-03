import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Botao } from "../ui/botao/Botao";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface GenericModalProps {
  title: string;
  children: React.ReactNode;
  cancelButtonText: string;
  confirmButtonText: string;
  buttonColor?: "success" | "error";
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  disableConfirmButton?: boolean;
}

export default function GenericModal({
  title,
  children,
  cancelButtonText,
  confirmButtonText,
  buttonColor,
  open,
  handleClose,
  handleConfirm,
  disableConfirmButton = false,
}: GenericModalProps) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions sx={{ pb: 2, pr: 2 }}>
          <Botao variant="outlined" color="warning" onClick={handleClose}>
            {cancelButtonText}
          </Botao>
          <Botao
            variant="contained"
            color={buttonColor}
            onClick={handleConfirm}
            disabled={disableConfirmButton}
          >
            {confirmButtonText}
          </Botao>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
