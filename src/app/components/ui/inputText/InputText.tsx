"use client";

import React, { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { styled } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputMask from "react-input-mask";

import {
  TextField,
  InputAdornment,
  IconButton,
  Theme,
  SxProps,
  TextFieldProps,
} from "@mui/material";

type EntradaTextoProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  autoComplete?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
  mask?: string;
  sx?: SxProps<Theme>;
  props?: TextFieldProps;
};

const UnioTextFieldBase = styled(TextField)({
  "& .MuiInputLabel-root": { paddingLeft: "8px" },
  "& .MuiInputLabel-shrink": {
    paddingLeft: "4px",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: "8px",
    },
    "& .MuiIconButton-root": {
      marginRight: "0px",
    },
    "& .MuiOutlinedInput-input": {
      paddingLeft: "22px",
    },
  },
});

export function EntradaTexto<T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  autoComplete,
  helperText,
  showPasswordToggle = false,
  mask,
  sx,
  props,
}: Readonly<EntradaTextoProps<T>>) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field, fieldState: { error } }) => (
        <>
          {mask ? (
            <InputMask
              mask={mask}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(inputProps: any) => (
                <UnioTextFieldBase
                  {...inputProps}
                  {...props}
                  label={label}
                  type={showPassword ? "text" : type}
                  error={!!error}
                  helperText={error ? error.message : helperText}
                  sx={sx}
                  fullWidth
                  InputProps={{
                    ...inputProps.InputProps,
                    endAdornment: showPasswordToggle && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </InputMask>
          ) : (
            <UnioTextFieldBase
              {...field}
              {...props}
              label={label}
              type={showPassword ? "text" : type}
              error={!!error}
              helperText={error ? error.message : helperText}
              sx={sx}
              fullWidth
              autoComplete={autoComplete}
              InputProps={{
                endAdornment: showPasswordToggle && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        </>
      )}
    />
  );
}
