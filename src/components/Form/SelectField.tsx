import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import MaterialTextField from '@material-ui/core/TextField';
import type { FC } from 'react';

import type { SelectFieldDeclaration, MaybeValue } from './types';

type TextFieldChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type SelectFieldProps = SelectFieldDeclaration & {
  readonly isRequired: boolean;
  readonly value: MaybeValue;
  readonly hasError: boolean;
  readonly onChange: (event: TextFieldChangeEvent) => void;
  readonly onBlur: (event: TextFieldChangeEvent) => void;
};

const SelectField: FC<SelectFieldProps> = ({
  name,
  isRequired,
  label,
  helperText,
  prefix,
  suffix,
  initialValue,
  value,
  options,
  hasError,
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
    error={hasError}
    helperText={helperText}
    required={isRequired}
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
