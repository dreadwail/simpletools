import { useCallback, useMemo } from 'react';

import List from './fields/List';
import Select from './fields/Select';
import Text from './fields/Text';
import TupleList from './fields/TupleList';
import {
  FieldType,
  FieldDeclaration,
  OnBlurHandler,
  OnChangeHandler,
  Value,
  SingleValue,
  ListValue,
  TupleListValue,
} from './types';

const DEFAULT_HELPER_TEXT = ' ';

export type FieldProps<TFieldName extends string> = FieldDeclaration<TFieldName> & {
  readonly isRequired: boolean;
  readonly isDisabled: boolean;
  readonly hasBeenTouched: boolean;
  readonly error?: string;
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
  isDisabled,
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

  switch (field.type) {
    case FieldType.SELECT:
      return (
        <Select
          {...field}
          value={value as SingleValue | undefined}
          isRequired={isRequired}
          isDisabled={isDisabled}
          helperText={adjustedHelperText.text}
          hasError={adjustedHelperText.isError}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
        />
      );
    case FieldType.TEXT:
      return (
        <Text
          {...field}
          value={value as SingleValue | undefined}
          isRequired={isRequired}
          isDisabled={isDisabled}
          helperText={adjustedHelperText.text}
          hasError={adjustedHelperText.isError}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
        />
      );
    case FieldType.LIST:
      return (
        <List
          {...field}
          value={value as ListValue | undefined}
          isRequired={isRequired}
          isDisabled={isDisabled}
          helperText={adjustedHelperText.text}
          hasError={adjustedHelperText.isError}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
        />
      );
    case FieldType.TUPLE_LIST:
      return (
        <TupleList
          {...field}
          value={value as TupleListValue | undefined}
          isRequired={isRequired}
          isDisabled={isDisabled}
          helperText={adjustedHelperText.text}
          hasError={adjustedHelperText.isError}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
        />
      );
    default:
      return null;
  }
};

export default Field;
