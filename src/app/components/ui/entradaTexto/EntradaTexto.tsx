'use client';

import React, { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import {
  TextField,
  InputAdornment,
  IconButton,
  Theme,
  SxProps,
  TextFieldProps,
} from '@mui/material';

type EntradaTextoProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  autoComplete?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
  sx?: SxProps<Theme>;
  props?: TextFieldProps;
};

const UnioTextFieldBase = styled(TextField)({
  '& .MuiInputLabel-root': { paddingLeft: '8px' },
  '& .MuiInputLabel-shrink': {
    paddingLeft: '4px',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: '8px',
    },
    '& .MuiIconButton-root': {
      marginRight: '0px',
    },
    '& .MuiOutlinedInput-input': {
      paddingLeft: '22px',
    },
  },
});

export function EntradaTexto<T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  autoComplete,
  helperText,
  showPasswordToggle = false,
  props,
  sx,
}: Readonly<EntradaTextoProps<T>>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({
        field: { onChange, onBlur, value, ...field },
        fieldState: { invalid, error },
      }) => (
        <UnioTextFieldBase
          label={label}
          type={showPasswordToggle && showPassword ? 'text' : type}
          autoComplete={autoComplete}
          error={invalid}
          helperText={error ? error.message : helperText}
          required
          fullWidth
          InputProps={{
            endAdornment: showPasswordToggle ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="alterna visibilidade da senha"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : undefined,
          }}
          value={value}
          onChange={(e) => {
            const rawValue = e.target.value;
            onChange(rawValue);
          }}
          onBlur={(e) => {
            const rawValue = e.target.value;
            onBlur();
          }}
          {...field}
          {...props}
          sx={sx}
        />
      )}
    />
  );
}
