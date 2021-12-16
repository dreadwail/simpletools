import { useCallback, useEffect, useMemo, useState } from 'react';

import FieldBlock, { FieldBlockProps } from './FieldBlock';
import {
  isBlockDeclaration,
  ControlType,
  Errors,
  BlockDeclaration,
  FieldDeclaration,
  Touched,
  FormShape,
} from './types';

type OnChangePayload<TType extends FormShape> = {
  readonly values: Partial<TType>;
  readonly errors: Errors<TType>;
  readonly isValid: boolean;
};

export type OnFormChange<TType extends FormShape> = (payload: OnChangePayload<TType>) => void;

export type FormProps<TType extends FormShape> = {
  readonly fields: BlockDeclaration<TType>;
  readonly onChange: OnFormChange<TType>;
};

type FieldDeclarations<TType extends FormShape> = {
  [key in keyof TType]?: FieldDeclaration<TType, string & keyof TType>;
};

const extractFields = <TType extends FormShape>(
  block: BlockDeclaration<TType>
): FieldDeclarations<TType> =>
  block.blocks.reduce<FieldDeclarations<TType>>((memo, currentBlock) => {
    if (isBlockDeclaration(currentBlock)) {
      return { ...memo, ...extractFields(currentBlock) };
    }
    return { ...memo, [currentBlock.name]: currentBlock };
  }, {});

const Form = <TType extends FormShape>({ fields: block, onChange }: FormProps<TType>) => {
  const fieldsByName = useMemo(() => extractFields(block), [block]);
  const fieldNames = useMemo(() => Object.keys(fieldsByName) as (keyof TType)[], [fieldsByName]);
  const initialValues = useMemo(
    () =>
      fieldNames.reduce<Partial<TType>>(
        (memo, fieldName) => ({
          ...memo,
          [fieldName]: fieldsByName[fieldName]?.initialValue,
        }),
        {}
      ),
    [fieldNames, fieldsByName]
  );

  const [values, setValues] = useState<Partial<TType>>(initialValues);
  const [errors, setErrors] = useState<Errors<TType>>({});
  const [touched, setTouched] = useState<Touched<TType>>({});

  const isValid = useMemo(
    () => fieldNames.filter(fieldName => errors[fieldName]).length === 0,
    [fieldNames, errors]
  );

  useEffect(() => {
    onChange({ values, errors, isValid });
  }, [onChange, values, errors, isValid]);

  const onChangeField = useCallback<FieldBlockProps<TType>['onChangeField']>(
    (name, newValue) => {
      const field = fieldsByName[name];
      if (!field) {
        return;
      }
      setValues(oldValues => ({ ...oldValues, [name]: newValue }));
    },
    [fieldsByName]
  );

  const onBlurField = useCallback<FieldBlockProps<TType>['onBlurField']>(name => {
    setTouched(oldTouched => ({ ...oldTouched, [name]: true }));
  }, []);

  useEffect(() => {
    const newErrors = fieldNames.reduce<Errors<TType>>((memo, fieldName) => {
      const field = fieldsByName[fieldName];
      if (!field) {
        return memo;
      }

      const isRequired =
        typeof field.isRequired === 'boolean' ? field.isRequired : !!field.isRequired?.(values);

      switch (field.controlType) {
        case ControlType.INPUT:
        case ControlType.SELECT:
          const inputValue = values[field.name];
          if (!inputValue) {
            if (isRequired) {
              return { ...memo, [fieldName]: 'Required' };
            }
            return memo;
          }
          return { ...memo, [fieldName]: field.validate?.(inputValue, values) };
        case ControlType.LIST:
          const listValue = values[field.name];
          if (!listValue || listValue.length === 0) {
            if (isRequired) {
              return { ...memo, [fieldName]: 'Required' };
            }
            return memo;
          }
          return { ...memo, [fieldName]: field.validate?.(tupleListValue, values) };
        default:
          return memo;
      }
    }, {});
    setErrors(oldErrors => ({ ...oldErrors, ...newErrors }));
  }, [fieldNames, fieldsByName, values]);

  return (
    <FieldBlock
      block={block}
      values={values}
      errors={errors}
      touched={touched}
      onChangeField={onChangeField}
      onBlurField={onBlurField}
    />
  );
};

export default Form;
