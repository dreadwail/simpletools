import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { FC, useCallback } from 'react';

import type { FieldDeclaration, Value } from './types';

type FieldProps = FieldDeclaration & {
  readonly hasError: boolean;
  readonly value: Value;
  readonly fullWidth: boolean;
  readonly onChange?: (value: Value) => void;
};

type TextFieldChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const Field: FC<FieldProps> = ({
  required,
  label,
  helperText,
  prefix,
  suffix,
  value,
  hasError,
  onChange,
  fullWidth,
}) => {
  const onChangeHandler = useCallback(
    (event: TextFieldChangeEvent) => {
      if (onChange) {
        const newValue = event.target.value;
        onChange(newValue);
      }
    },
    [onChange]
  );

  return (
    <TextField
      fullWidth={fullWidth}
      size="small"
      margin="dense"
      variant="outlined"
      label={label}
      InputProps={{
        startAdornment: prefix ? <InputAdornment position="start">{prefix}</InputAdornment> : null,
        endAdornment: suffix ? <InputAdornment position="end">{suffix}</InputAdornment> : null,
      }}
      value={value}
      error={hasError}
      helperText={helperText}
      required={required}
      onChange={onChangeHandler}
    />
  );
};

export default Field;
