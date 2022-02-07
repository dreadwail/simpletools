import MenuItem from '@material-ui/core/MenuItem';
import MaterialTextField, {
  TextFieldProps as MaterialTextFieldProps,
} from '@material-ui/core/TextField';
import { useCallback, ChangeEvent } from 'react';

type Option = {
  readonly label: string;
  readonly value: string;
};

export type SelectFieldProps = {
  readonly fullWidth?: boolean;
  readonly hasError?: boolean;
  readonly helperText?: string;
  readonly inputRef?: MaterialTextFieldProps['inputRef'];
  readonly isDisabled?: boolean;
  readonly isRequired?: boolean;
  readonly label: string;
  readonly name?: string;
  readonly onBlur?: () => void;
  readonly onChange?: (value: string) => void;
  readonly options: Option[];
  readonly size?: MaterialTextFieldProps['size'];
  readonly value?: string;
};

const Select = ({
  fullWidth = true,
  hasError,
  helperText,
  inputRef,
  isDisabled,
  isRequired,
  label,
  name,
  onBlur,
  onChange,
  options,
  size,
  value = '',
}: SelectFieldProps) => {
  const onChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.value);
    },
    [onChange]
  );

  return (
    <MaterialTextField
      disabled={isDisabled}
      error={hasError}
      fullWidth={fullWidth}
      helperText={helperText}
      inputRef={inputRef}
      InputProps={{
        style: { backgroundColor: isDisabled ? '#ddd' : '#fff' },
      }}
      label={label}
      margin="none"
      name={name}
      onBlur={onBlur}
      onChange={onChangeHandler}
      required={isRequired}
      select
      size={size}
      value={value ?? ''}
      variant="outlined"
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
