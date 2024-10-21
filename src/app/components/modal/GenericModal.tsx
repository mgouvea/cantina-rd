import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
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
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}

export default function GenericModal({
  title,
  children,
  cancelButtonText,
  confirmButtonText,
  open,
  handleClose,
  handleConfirm,
}: GenericModalProps) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{cancelButtonText}</Button>
          <Button onClick={handleConfirm}>{confirmButtonText}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
