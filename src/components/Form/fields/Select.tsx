import MenuItem from '@material-ui/core/MenuItem';
import MaterialTextField from '@material-ui/core/TextField';
import { useCallback } from 'react';

import type { SelectFieldDeclaration } from '../types';

type TextFieldChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type SelectProps<TFieldName extends string> = Omit<
  SelectFieldDeclaration<TFieldName>,
  'type'
> & {
  readonly isRequired: boolean;
  readonly value?: string;
  readonly hasError: boolean;
  readonly onChange: (value: string) => void;
  readonly onBlur: () => void;
};

const Select = <TFieldName extends string>({
  name,
  isRequired,
  label,
  helperText,
  initialValue,
  value,
  options,
  hasError,
  onChange,
  onBlur,
}: SelectProps<TFieldName>) => {
  const onChangeHandler = useCallback(
    (event: TextFieldChangeEvent) => {
      // The event can be absent. See: https://v4.mui.com/api/input-base/#props
      if (event) {
        onChange(event.target.value);
      }
    },
    [onChange]
  );

  return (
    <MaterialTextField
      name={name}
      select
      fullWidth
      size="small"
      margin="none"
      variant="outlined"
      label={label}
      value={value ?? initialValue ?? ''}
      error={hasError}
      helperText={helperText}
      required={isRequired}
      onChange={onChangeHandler}
      onBlur={onBlur}
    >
      {options.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </MaterialTextField>
  );
};

export default Select;
