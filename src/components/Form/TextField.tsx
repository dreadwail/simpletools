import InputAdornment from '@material-ui/core/InputAdornment';
import MaterialTextField from '@material-ui/core/TextField';
import type { FC } from 'react';

import type { MaybeError, TextFieldDeclaration, MaybeValue } from './types';

type TextFieldChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type TextFieldProps = TextFieldDeclaration & {
  readonly error: MaybeError;
  readonly value: MaybeValue;
  readonly onChange: (event: TextFieldChangeEvent) => void;
  readonly onBlur: (event: TextFieldChangeEvent) => void;
};

const TextField: FC<TextFieldProps> = ({
  name,
  required,
  label,
  helperText,
  prefix,
  suffix,
  initialValue,
  value,
  error,
  onChange,
  onBlur,
}) => (
  <MaterialTextField
    name={name}
    fullWidth
    size="small"
    margin="none"
    variant="outlined"
    label={label}
    InputProps={{
      startAdornment: prefix ? <InputAdornment position="start">{prefix}</InputAdornment> : null,
      endAdornment: suffix ? <InputAdornment position="end">{suffix}</InputAdornment> : null,
    }}
    value={value ?? initialValue ?? ''}
    error={!!error}
    helperText={helperText}
    required={required}
    onChange={onChange}
    onBlur={onBlur}
  />
);

export default TextField;
