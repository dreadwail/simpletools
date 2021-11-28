import InputAdornment from '@material-ui/core/InputAdornment';
import MaterialTextField from '@material-ui/core/TextField';
import type { FC } from 'react';

import type { TextFieldDeclaration, MaybeValue } from './types';

type TextFieldChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type TextFieldProps = TextFieldDeclaration & {
  readonly isRequired: boolean;
  readonly value: MaybeValue;
  readonly hasError: boolean;
  readonly onChange: (event: TextFieldChangeEvent) => void;
  readonly onBlur: (event: TextFieldChangeEvent) => void;
};

const TextField: FC<TextFieldProps> = ({
  name,
  isRequired,
  label,
  helperText,
  prefix,
  suffix,
  initialValue,
  value,
  hasError,
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
    error={hasError}
    helperText={helperText}
    required={isRequired}
    onChange={onChange}
    onBlur={onBlur}
  />
);

export default TextField;
