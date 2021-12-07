import InputAdornment from '@material-ui/core/InputAdornment';
import MaterialTextField, {
  TextFieldProps as MaterialTextFieldprops,
} from '@material-ui/core/TextField';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import { useCallback, useEffect, useMemo, useState, ChangeEvent, KeyboardEvent, Ref } from 'react';

import type { SingleValue, TextFieldDeclaration } from '../types';

type TextChangeEvent = ChangeEvent<HTMLInputElement>;
type TextKeyPressEvent = KeyboardEvent<HTMLInputElement>;

export type KeyPress = {
  readonly key: TextKeyPressEvent['key'];
  readonly code: TextKeyPressEvent['code'];
};

export type TextProps<TFieldName extends string> = Pick<MaterialTextFieldprops, 'size'> &
  Omit<TextFieldDeclaration<TFieldName>, 'type' | 'name' | 'isRequired' | 'isDisabled'> & {
    readonly name?: string;
    readonly isRequired?: boolean;
    readonly isDisabled?: boolean;
    readonly value?: SingleValue;
    readonly hasError?: boolean;
    readonly onChange?: (value: SingleValue) => void;
    readonly onBlur?: () => void;
    readonly onKeyPress?: (keyPress: KeyPress) => void;
    readonly inputRef?: Ref<HTMLInputElement>;
  };

const DEBOUNCE_MILLIS = 200;

const Text = <TFieldName extends string>({
  name,
  isRequired,
  isDisabled,
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
  size = 'small',
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
      size={size}
      disabled={isDisabled}
      margin="none"
      variant="outlined"
      label={label}
      inputRef={inputRef}
      InputProps={{
        startAdornment: prefix ? <InputAdornment position="start">{prefix}</InputAdornment> : null,
        endAdornment: suffix ? <InputAdornment position="end">{suffix}</InputAdornment> : null,
        style: { backgroundColor: isDisabled ? '#ddd' : '#fff' },
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
