import { FC, useCallback, useMemo } from 'react';

import SelectField from './SelectField';
import TextField from './TextField';
import {
  FieldType,
  MaybeError,
  FieldDeclaration,
  OnBlurHandler,
  OnChangeHandler,
  MaybeValue,
} from './types';

const DEFAULT_HELPER_TEXT = ' ';

export type FieldProps = FieldDeclaration & {
  readonly error: MaybeError;
  readonly value: MaybeValue;
  readonly onChange: OnChangeHandler;
  readonly onBlur: OnBlurHandler;
};

type TextFieldChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const Field: FC<FieldProps> = ({ value, error, onChange, onBlur, ...field }) => {
  const { name, helperText, required } = field;

  const onChangeHandler = useCallback(
    (event?: TextFieldChangeEvent) => {
      // The event can be absent. See: https://v4.mui.com/api/input-base/#props
      if (event) {
        onChange(name, event.target.value);
      }
    },
    [onChange, name]
  );

  const onBlurHandler = useCallback(
    (event?: TextFieldChangeEvent) => {
      if (event) {
        onBlur(name, event.target.value);
      }
    },
    [onBlur, name]
  );

  const adjustedHelperText = useMemo((): string => {
    if (error) {
      return error;
    }
    if (helperText) {
      return helperText;
    }
    if (!value) {
      if (required) {
        return 'Required';
      }
      return 'Optional';
    }
    return DEFAULT_HELPER_TEXT;
  }, [error, helperText, value, required]);

  const runtimeProps = useMemo(
    () => ({
      helperText: adjustedHelperText,
      value,
      error,
      onChange: onChangeHandler,
      onBlur: onBlurHandler,
    }),
    [adjustedHelperText, error, onBlurHandler, onChangeHandler, value]
  );

  switch (field.type) {
    case FieldType.SELECT:
      return <SelectField {...field} {...runtimeProps} />;
    case FieldType.TEXT:
    default:
      return <TextField {...field} {...runtimeProps} />;
  }
};

export default Field;
