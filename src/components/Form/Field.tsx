import { useCallback, useMemo } from 'react';

import SelectField from './SelectField';
import TextField from './TextField';
import { FieldType, Error, FieldDeclaration, OnBlurHandler, OnChangeHandler, Value } from './types';

const DEFAULT_HELPER_TEXT = ' ';

export type FieldProps<TFieldName extends string> = FieldDeclaration<TFieldName> & {
  readonly isRequired: boolean;
  readonly hasBeenTouched: boolean;
  readonly error?: Error;
  readonly value?: Value;
  readonly onChangeField: OnChangeHandler<TFieldName>;
  readonly onBlurField: OnBlurHandler<TFieldName>;
};

type HelperText = {
  readonly text: string;
  readonly isError: boolean;
};

const Field = <TFieldName extends string>({
  hasBeenTouched,
  value,
  error,
  onChangeField,
  onBlurField,
  isRequired,
  ...field
}: FieldProps<TFieldName>) => {
  const onChangeHandler = useCallback(
    (newValue: Value) => {
      onChangeField(field.name, newValue);
    },
    [onChangeField, field.name]
  );

  const onBlurHandler = useCallback(() => {
    onBlurField(field.name);
  }, [onBlurField, field.name]);

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
