import InputAdornment from '@material-ui/core/InputAdornment';
import MaterialTextField from '@material-ui/core/TextField';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { TextFieldDeclaration } from './types';

type TextFieldChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type TextFieldProps<TFieldName extends string> = TextFieldDeclaration<TFieldName> & {
  readonly isRequired: boolean;
  readonly value?: string;
  readonly hasError: boolean;
  readonly onChange: (value: string) => void;
  readonly onBlur: () => void;
};

const DEBOUNCE_MILLIS = 200;

const TextField = <TFieldName extends string>({
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
}: TextFieldProps<TFieldName>) => {
  const [localValue, setLocalValue] = useState(value ?? initialValue ?? '');

  const onChangeLocal = useCallback((event: TextFieldChangeEvent) => {
    // The event can be absent. See: https://v4.mui.com/api/input-base/#props
    if (event) {
      setLocalValue(event.target.value);
    }
  }, []);

  const onChangeDebounced = useMemo(() => debounce(onChange, DEBOUNCE_MILLIS), [onChange]);

  useEffect(() => {
    onChangeDebounced(localValue);
  }, [onChangeDebounced, localValue]);

  return (
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
      value={localValue}
      error={hasError}
      helperText={helperText}
      required={isRequired}
      onChange={onChangeLocal}
      onBlur={onBlur}
    />
  );
};

export default TextField;
