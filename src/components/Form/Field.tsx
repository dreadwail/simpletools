import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { FC, useCallback, useMemo } from 'react';

import type { Error, FieldDeclaration, OnBlurHandler, OnChangeHandler, Value } from './types';

const DEFAULT_HELPER_TEXT = ' ';

export type FieldProps = FieldDeclaration & {
  readonly error: Error;
  readonly value: Value;
  readonly onChange: OnChangeHandler;
  readonly onBlur: OnBlurHandler;
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
  onBlur,
}) => {
  const onChangeHandler = useCallback(
    (event?: TextFieldChangeEvent) => {
      // The event can be absent. See: https://v4.mui.com/api/input-base/#props
      if (event) {
        const newValue = event.target.value;
        onChange(name, newValue);
      }
    },
    [onChange, name]
  );

  const onBlurHandler = useCallback(
    (event?: TextFieldChangeEvent) => {
      // The event can be absent. See: https://v4.mui.com/api/input-base/#props
      if (event) {
        onBlur(name);
      }
    },
    [onBlur, name]
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
      fullWidth
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
      onBlur={onBlurHandler}
    />
  );
};

export default Field;
