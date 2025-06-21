"use client";

import React, { FormEvent, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import ForgotPassword from "./forgotPassword";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Card, Theme, Toolbar } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "./components";
import Image from "next/image";
import { isValidEmail } from "@/utils";
import { useRouter } from "next/navigation";
import { useAdmins, useUsers } from "@/hooks/queries";
import { User, UserAdmin } from "@/types";
import { useUserStore } from "@/contexts";

const muiCardStyles = (theme: Theme) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    theme.palette.mode === "dark"
      ? "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px"
      : "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
});

const signInContainerStyles = (theme: Theme) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      theme.palette.mode === "dark"
        ? "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))"
        : "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
  },
});

export default function Home() {
  const { showSnackbar } = useSnackbar();

  const { data: admins } = useAdmins();
  const { data: users } = useUsers();
  const { updateUserLogged } = useUserStore();

  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickOpen = () => {
    alert("Liga pro Clésio");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    validateInputs();
  };

  const validateInputs = () => {
    // Reset previous errors
    setEmailError(false);
    setEmailErrorMessage("");
    setPasswordError(false);
    setPasswordErrorMessage("");

    // Validate email
    const validateEmail: boolean | undefined = isValidEmail(email);
    if (!validateEmail) {
      setEmailError(true);
      setEmailErrorMessage("Digite um e-mail válido");
      showSnackbar({
        severity: "error",
        message: "Digite um e-mail válido!",
      });
      return;
    }

    // Validate password
    if (!password) {
      setPasswordError(true);
      setPasswordErrorMessage("Digite sua senha");
      showSnackbar({
        severity: "error",
        message: "Digite sua senha!",
      });
      return;
    }

    // Find the admin with matching email
    const adminFound: UserAdmin | undefined = admins
      ? admins.find((admin: UserAdmin) => admin.email === email)
      : null;

    // Check if email exists in admin records
    if (!adminFound) {
      showSnackbar({
        severity: "error",
        message: "Acesso não autorizado. Apenas administradores podem entrar.",
      });
      return;
    }

    // Check if password matches
    if (adminFound.password !== password) {
      setPasswordError(true);
      setPasswordErrorMessage("Senha incorreta");
      showSnackbar({
        severity: "error",
        message: "Senha incorreta!",
      });
      return;
    }

    // Show loading state
    setIsLoading(true);

    // Find the corresponding user
    const userFound = users?.find(
      (user: User) => user._id === adminFound.idUser
    );

    // Update user in store and redirect
    updateUserLogged(userFound);
    router.replace("/dashboard");
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <Stack
        direction="column"
        justifyContent="space-between"
        sx={signInContainerStyles}
      >
        <Card variant="outlined" sx={muiCardStyles}>
          <Toolbar sx={{ justifyContent: "center", padding: "0.5rem 0 0 0" }}>
            <Image
              src="/cantinaRD.svg"
              width={110}
              height={110}
              alt="logo da cantina realeza divina"
            />
          </Toolbar>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="seu@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
                sx={{ ariaLabel: "email" }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Senha</FormLabel>
              <TextField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Entrando...
                </Box>
              ) : (
                "Entrar"
              )}
            </Button>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              Esqueceu a senha?
            </Link>
          </Box>
        </Card>
      </Stack>
    </>
  );
}
