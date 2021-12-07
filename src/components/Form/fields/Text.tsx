import InputAdornment from '@material-ui/core/InputAdornment';
import MaterialTextField from '@material-ui/core/TextField';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
  KeyboardEvent,
  RefObject,
} from 'react';

import type { SingleValue, TextFieldDeclaration } from '../types';

type TextChangeEvent = ChangeEvent<HTMLInputElement>;
type TextKeyPressEvent = KeyboardEvent<HTMLInputElement>;

export type KeyPress = {
  readonly key: TextKeyPressEvent['key'];
  readonly code: TextKeyPressEvent['code'];
};

export type TextProps<TFieldName extends string> = Omit<
  TextFieldDeclaration<TFieldName>,
  'type' | 'name'
> & {
  readonly name?: string;
  readonly isRequired: boolean;
  readonly value?: SingleValue;
  readonly hasError: boolean;
  readonly onChange?: (value: SingleValue) => void;
  readonly onBlur?: () => void;
  readonly onKeyPress?: (keyPress: KeyPress) => void;
  readonly inputRef?: RefObject<HTMLInputElement>;
};

const DEBOUNCE_MILLIS = 200;

const Text = <TFieldName extends string>({
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
  onKeyPress,
  inputRef,
}: TextProps<TFieldName>) => {
  const [localValue, setLocalValue] = useState(value ?? initialValue ?? '');
  const [lastKeyPress, setLastKeyPress] = useState<KeyPress | null>(null);

  const onChangeLocal = useCallback((event: TextChangeEvent) => {
    // The event can be absent. See: https://v4.mui.com/api/input-base/#props
    if (event) {
      setLocalValue(event.target.value);
    }
  }, []);

  const onChangeDebounced = useMemo(() => debounce(onChange ?? noop, DEBOUNCE_MILLIS), [onChange]);

  useEffect(() => {
    if (lastKeyPress) {
      onKeyPress?.(lastKeyPress);
      setLastKeyPress(null);
    }
  }, [lastKeyPress, onKeyPress]);

  const onKeyPressWrapped = useCallback(
    ({ key, code }: TextKeyPressEvent) => {
      if (key === 'Enter') {
        onChangeDebounced.flush();
      }
      // in order to give the consuming component a chance to update itself first following the
      // flush, we defer the call to onKeyPress until the next render cycle
      setLastKeyPress({ key, code });
    },
    [onChangeDebounced]
  );

  useEffect(() => {
    setLocalValue(value ?? '');
  }, [value]);

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
      inputRef={inputRef}
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
      onKeyPress={onKeyPressWrapped}
    />
  );
};

export default Text;
