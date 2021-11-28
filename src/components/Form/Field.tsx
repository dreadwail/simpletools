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
  readonly isRequired: boolean;
  readonly hasBeenTouched: boolean;
  readonly error: MaybeError;
  readonly value: MaybeValue;
  readonly onChange: OnChangeHandler;
  readonly onBlur: OnBlurHandler;
};

type TextFieldChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

type HelperText = {
  readonly text: string;
  readonly isError: boolean;
};

const Field: FC<FieldProps> = ({
  hasBeenTouched,
  value,
  error,
  onChange,
  onBlur,
  isRequired,
  ...field
}) => {
  const onChangeHandler = useCallback(
    (event?: TextFieldChangeEvent) => {
      // eslint-disable-next-line no-console
      console.log('onChangeHandler');
      // The event can be absent. See: https://v4.mui.com/api/input-base/#props
      if (event) {
        onChange(field.name, event.target.value);
      }
    },
    [onChange, field.name]
  );

  const onBlurHandler = useCallback(
    (event?: TextFieldChangeEvent) => {
      // eslint-disable-next-line no-console
      console.log('onBlurHandler');
      // The event can be absent. See: https://v4.mui.com/api/input-base/#props
      if (event) {
        onBlur(field.name, event.target.value);
      }
    },
    [onBlur, field.name]
  );

  const adjustedHelperText = useMemo((): HelperText => {
    if (error) {
      return { text: error, isError: true };
    }
    if (isRequired && !value) {
      return { text: 'Required', isError: hasBeenTouched };
    }
    return { text: field.helperText ?? DEFAULT_HELPER_TEXT, isError: false };
  }, [error, isRequired, value, field.helperText, hasBeenTouched]);

  switch (field.type) {
    case FieldType.SELECT:
      return (
        <SelectField
          {...field}
          value={value}
          options={field.options}
          isRequired={isRequired}
          helperText={adjustedHelperText.text}
          hasError={adjustedHelperText.isError}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
        />
      );
    case FieldType.TEXT:
    default:
      return (
        <TextField
          {...field}
          value={value}
          isRequired={isRequired}
          helperText={adjustedHelperText.text}
          hasError={adjustedHelperText.isError}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
        />
      );
  }
};

export default Field;
