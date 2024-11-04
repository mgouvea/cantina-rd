'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

type SnackbarMessage = {
  message: string;
  severity: AlertColor;
  duration?: number;
};

type SnackbarContextType = {
  showSnackbar: (options: SnackbarMessage) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] =
    useState<SnackbarMessage | null>(null);

  const showSnackbar = (options: SnackbarMessage) => {
    setSnackbarMessage(options);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={snackbarMessage?.duration || 3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarMessage?.severity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage?.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
