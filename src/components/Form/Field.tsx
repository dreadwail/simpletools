import { useCallback, useMemo } from 'react';

import ListField from '../ListField';
import SelectField from '../SelectField';
import TextField from '../TextField';

import { ControlType, FormShape, ErrorMessage, FieldDeclaration } from './types';

const DEFAULT_HELPER_TEXT = ' ';

export type FieldProps<TType extends FormShape, TFieldName extends keyof TType> = FieldDeclaration<
  TType,
  TFieldName
> & {
  readonly isRequired: boolean;
  readonly isDisabled: boolean;
  readonly hasBeenTouched: boolean;
  readonly error?: ErrorMessage;
  readonly value?: TType[TFieldName];
  readonly onChangeField: (name: TFieldName, value: TType[TFieldName]) => void;
  readonly onBlurField: (name: TFieldName) => void;
  readonly visualGap?: number;
};

type HelperText = {
  readonly text: string;
  readonly isError: boolean;
};

const Field = <TType extends FormShape, TFieldName extends keyof TType>({
  hasBeenTouched,
  value,
  error,
  onChangeField,
  onBlurField,
  visualGap,
  isRequired,
  isDisabled,
  ...field
}: FieldProps<TType, TFieldName>) => {
  const onChangeHandler = useCallback(
    (newValue: unknown) => {
      onChangeField(field.name, newValue);
    },
    [field, onChangeField]
  );

  const onBlurHandler = useCallback(() => {
    onBlurField(field.name);
  }, [onBlurField, field.name]);

  const adjustedHelperText = useMemo((): HelperText => {
    if (hasBeenTouched && error) {
      return { text: error, isError: true };
    }
    if (field.helperText) {
      return { text: field.helperText, isError: false };
    }
    if (isRequired) {
      return { text: 'Required', isError: false };
    }
    return { text: DEFAULT_HELPER_TEXT, isError: false };
  }, [error, field.helperText, hasBeenTouched, isRequired]);

  switch (field.controlType) {
    case ControlType.SELECT:
      return (
        <SelectField
          hasError={adjustedHelperText.isError}
          helperText={adjustedHelperText.text}
          isDisabled={isDisabled}
          isRequired={isRequired}
          label={field.label}
          name={field.name}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          options={field.options}
          value={value}
        />
      );
    case ControlType.INPUT:
      return (
        <TextField
          hasError={adjustedHelperText.isError}
          helperText={adjustedHelperText.text}
          isDisabled={isDisabled}
          isRequired={isRequired}
          label={field.label}
          name={field.name}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          prefix={field.prefix}
          suffix={field.suffix}
          value={value}
        />
      );
    case ControlType.LIST:
      return (
        <ListField
          fields={field.fields}
          hasError={adjustedHelperText.isError}
          helperText={adjustedHelperText.text}
          isDisabled={isDisabled}
          isRequired={isRequired}
          label={field.label}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          separator={field.separator}
          value={value}
          visualGap={visualGap}
        />
      );
    default:
      return null;
  }
};

export default Field;
