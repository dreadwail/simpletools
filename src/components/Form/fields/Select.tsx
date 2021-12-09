import MenuItem from '@material-ui/core/MenuItem';
import MaterialTextField from '@material-ui/core/TextField';
import { useCallback } from 'react';

import type { SelectFieldDeclaration, SingleValue } from '../types';

type TextFieldChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type SelectProps<TFieldName extends string> = Omit<
  SelectFieldDeclaration<TFieldName>,
  'controlType' | 'name' | 'isRequired' | 'isDisabled'
> & {
  readonly name?: string;
  readonly isRequired?: boolean;
  readonly isDisabled?: boolean;
  readonly value?: SingleValue;
  readonly hasError?: boolean;
  readonly onChange?: (value: SingleValue) => void;
  readonly onBlur?: () => void;
};

const Select = <TFieldName extends string>({
  name,
  isRequired,
  isDisabled,
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
        onChange?.(event.target.value);
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
      InputProps={{
        style: { backgroundColor: isDisabled ? '#ddd' : '#fff' },
      }}
      value={value ?? initialValue ?? ''}
      error={hasError}
      helperText={helperText}
      required={isRequired}
      disabled={isDisabled}
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
