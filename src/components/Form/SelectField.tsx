import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import MaterialTextField from '@material-ui/core/TextField';
import type { FC } from 'react';

import type { MaybeError, SelectFieldDeclaration, MaybeValue } from './types';

type TextFieldChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type SelectFieldProps = SelectFieldDeclaration & {
  readonly error: MaybeError;
  readonly value: MaybeValue;
  readonly onChange: (event: TextFieldChangeEvent) => void;
  readonly onBlur: (event: TextFieldChangeEvent) => void;
};

const SelectField: FC<SelectFieldProps> = ({
  name,
  required,
  label,
  helperText,
  prefix,
  suffix,
  initialValue,
  value,
  options,
  error,
  onChange,
  onBlur,
}) => (
  <MaterialTextField
    name={name}
    select
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
  >
    {options.map(option => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </MaterialTextField>
);

export default SelectField;
