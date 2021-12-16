import InputAdornment from '@material-ui/core/InputAdornment';
import MaterialTextField, {
  TextFieldProps as MaterialTextFieldProps,
} from '@material-ui/core/TextField';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
  KeyboardEvent,
  ReactNode,
} from 'react';

export type KeyPress = {
  readonly key: KeyboardEvent<HTMLInputElement>['key'];
  readonly code: KeyboardEvent<HTMLInputElement>['code'];
};

export type TextFieldProps = {
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
  readonly onKeyPress?: (keyPress: KeyPress) => void;
  readonly prefix?: ReactNode;
  readonly size?: MaterialTextFieldProps['size'];
  readonly suffix?: ReactNode;
  readonly value?: string;
};

const DEBOUNCE_MILLIS = 200;

const TextField = ({
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
  onKeyPress,
  prefix,
  size = 'small',
  suffix,
  value = '',
}: TextFieldProps) => {
  const [localValue, setLocalValue] = useState<string>(value);
  const [keyPress, setKeyPress] = useState<KeyPress | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const onChangeLocal = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setLocalValue(event.target.value);
  }, []);

  const onChangeDebounced = useMemo(() => debounce(onChange ?? noop, DEBOUNCE_MILLIS), [onChange]);

  useEffect(() => {
    if (keyPress) {
      onKeyPress?.(keyPress);
      setKeyPress(null);
    }
  }, [keyPress, onKeyPress]);

  const onKeyPressWrapped = useCallback(
    ({ key, code }: KeyboardEvent<HTMLInputElement>) => {
      if (key === 'Enter') {
        onChangeDebounced.flush();
      }
      // in order to give the consuming component a chance to update itself first following the
      // flush, we defer the call to onKeyPress until the next render cycle
      setKeyPress({ key, code });
    },
    [onChangeDebounced]
  );

  useEffect(() => {
    onChangeDebounced(localValue);
  }, [onChangeDebounced, localValue]);

  return (
    <MaterialTextField
      disabled={isDisabled}
      error={hasError}
      fullWidth={fullWidth}
      helperText={helperText}
      inputRef={inputRef}
      InputProps={{
        startAdornment: prefix ? <InputAdornment position="start">{prefix}</InputAdornment> : null,
        endAdornment: suffix ? <InputAdornment position="end">{suffix}</InputAdornment> : null,
        style: { backgroundColor: isDisabled ? '#ddd' : '#fff' },
      }}
      label={label}
      margin="none"
      name={name}
      onBlur={onBlur}
      onChange={onChangeLocal}
      onKeyPress={onKeyPressWrapped}
      required={isRequired}
      size={size}
      variant="outlined"
      value={localValue}
    />
  );
};

export default TextField;
