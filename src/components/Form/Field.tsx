import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { FC, useCallback, useMemo } from 'react';

import type { Error, FieldDeclaration, OnChangeHandler, Value } from './types';

const DEFAULT_HELPER_TEXT = ' ';

export type FieldProps = FieldDeclaration & {
  readonly error: Error;
  readonly value: Value;
  readonly onChange: OnChangeHandler;
  readonly fullWidth: boolean;
};

type TextFieldChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const Field: FC<FieldProps> = ({
  name,
  required,
  label,
  helperText,
  prefix,
  suffix,
  value,
  error,
  onChange,
  fullWidth,
}) => {
  const onChangeHandler = useCallback(
    (event?: TextFieldChangeEvent) => {
      // The event can be absent. See: https://v4.mui.com/api/input-base/#props
      if (onChange && event) {
        const newValue = event.target.value;
        onChange(name, newValue);
      }
    },
    [onChange, name]
  );

  const adjustedHelperText = useMemo((): string => {
    if (error) {
      return error;
    }
    if (helperText) {
      return helperText;
    }
    if (!value) {
      if (required) {
        return 'Required';
      }
      return 'Optional';
    }
    return DEFAULT_HELPER_TEXT;
  }, [error, helperText, value, required]);

  return (
    <TextField
      fullWidth={fullWidth}
      size="small"
      margin="none"
      variant="outlined"
      label={label}
      InputProps={{
        startAdornment: prefix ? <InputAdornment position="start">{prefix}</InputAdornment> : null,
        endAdornment: suffix ? <InputAdornment position="end">{suffix}</InputAdornment> : null,
      }}
      value={value}
      error={!!error}
      helperText={adjustedHelperText}
      required={required}
      onChange={onChangeHandler}
    />
  );
};

export default Field;
