import isEmpty from 'lodash/isEmpty';
import { useCallback, useEffect, useMemo, useState } from 'react';

import FieldBlock, { FieldBlockProps } from './FieldBlock';
import {
  isFieldDeclaration,
  Errors,
  BlockDeclaration,
  FieldDeclaration,
  Touched,
  FormShape,
} from './types';

export type OnChangePayload<TType extends FormShape> = {
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
  [key in keyof TType]?: FieldDeclaration<TType, keyof TType>;
};

const extractFields = <TType extends FormShape>(
  block: BlockDeclaration<TType>
): FieldDeclarations<TType> =>
  block.blocks.reduce<FieldDeclarations<TType>>((memo, currentBlock) => {
    if (isFieldDeclaration(currentBlock)) {
      return { ...memo, [currentBlock.name]: currentBlock };
    }
    return { ...memo, ...extractFields(currentBlock) };
  }, {});

const Form = <TType extends FormShape>({ fields: block, onChange }: FormProps<TType>) => {
  const fieldsByName = useMemo(() => extractFields(block), [block]);
  const fieldNames = useMemo<(keyof TType)[]>(() => Object.keys(fieldsByName), [fieldsByName]);
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

      const toValidate = values[field.name];

      if (
        toValidate === null ||
        toValidate === undefined ||
        (typeof toValidate !== 'boolean' && isEmpty(toValidate))
      ) {
        if (isRequired) {
          return { ...memo, [fieldName]: 'Required' };
        }
        return memo;
      }

      return { ...memo, [fieldName]: field.validate?.(toValidate, values) };
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
