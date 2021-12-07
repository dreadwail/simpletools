import { useCallback, useEffect, useMemo, useState } from 'react';

import Flex from '../Flex';

import FieldBlock from './FieldBlock';
import {
  getCssWidth,
  getCssJustification,
  isBlockDeclaration,
  FieldType,
  Errors,
  BlockDeclaration,
  FieldDeclaration,
  OnBlurHandler,
  OnChangeHandler,
  Width,
  Touched,
  Values,
  SingleValue,
  ListValue,
  TupleListValue,
} from './types';

type OnChangePayload<TFieldName extends string> = {
  readonly values: Values<TFieldName>;
  readonly errors: Errors<TFieldName>;
  readonly isValid: boolean;
};

export type OnFormChange<TFieldName extends string> = (
  payload: OnChangePayload<TFieldName>
) => void;

export type FormProps<TFieldName extends string> = {
  readonly fields: BlockDeclaration<TFieldName>;
  readonly onChange: OnFormChange<TFieldName>;
};

type FieldDeclarations<TFieldName extends string> = {
  [key in TFieldName]?: FieldDeclaration<TFieldName>;
};

const extractFields = <TFieldName extends string>(
  block: BlockDeclaration<TFieldName>
): FieldDeclarations<TFieldName> =>
  block.blocks.reduce<FieldDeclarations<TFieldName>>((memo, currentBlock) => {
    if (isBlockDeclaration(currentBlock)) {
      return { ...memo, ...extractFields(currentBlock) };
    }
    return { ...memo, [currentBlock.name]: currentBlock };
  }, {});

const Form = <TFieldName extends string>({ fields: block, onChange }: FormProps<TFieldName>) => {
  const fieldsByName = useMemo(() => extractFields(block), [block]);
  const fieldNames = useMemo(() => Object.keys(fieldsByName) as TFieldName[], [fieldsByName]);
  const initialValues = useMemo(
    () =>
      fieldNames.reduce<Values<TFieldName>>(
        (memo, fieldName) => ({
          ...memo,
          [fieldName]: fieldsByName[fieldName]?.initialValue,
        }),
        {}
      ),
    [fieldNames, fieldsByName]
  );

  const [values, setValues] = useState<Values<TFieldName>>(initialValues);
  const [errors, setErrors] = useState<Errors<TFieldName>>({});
  const [touched, setTouched] = useState<Touched<TFieldName>>({});

  const isValid = useMemo(
    () => fieldNames.filter(fieldName => errors[fieldName]).length === 0,
    [fieldNames, errors]
  );

  useEffect(() => {
    onChange({ values, errors, isValid });
  }, [onChange, values, errors, isValid]);

  const onChangeField = useCallback<OnChangeHandler<TFieldName>>(
    (name, newValue) => {
      const field = fieldsByName[name];
      if (!field) {
        return;
      }
      setValues(oldValues => ({ ...oldValues, [name]: newValue }));
    },
    [fieldsByName]
  );

  const onBlurField = useCallback<OnBlurHandler<TFieldName>>(name => {
    setTouched(oldTouched => ({ ...oldTouched, [name]: true }));
  }, []);

  useEffect(() => {
    const newErrors = fieldNames.reduce<Errors<TFieldName>>((memo, fieldName) => {
      const field = fieldsByName[fieldName];
      if (!field) {
        return memo;
      }

      const isRequired =
        typeof field.isRequired === 'boolean' ? field.isRequired : !!field.isRequired?.(values);

      switch (field.type) {
        case FieldType.TEXT:
        case FieldType.SELECT:
          const textValue = values[field.name] as SingleValue | undefined;
          if (!textValue) {
            if (isRequired) {
              return { ...memo, [fieldName]: 'Required' };
            }
            return memo;
          }
          return { ...memo, [fieldName]: field.validate?.(textValue, values) };
        case FieldType.LIST:
          const listValue = values[field.name] as ListValue | undefined;
          if (!listValue || listValue.length === 0) {
            if (isRequired) {
              return { ...memo, [fieldName]: 'Required' };
            }
            return memo;
          }
          return { ...memo, [fieldName]: field.validate?.(listValue, values) };
        case FieldType.TUPLE_LIST:
          const tupleListValue = values[field.name] as TupleListValue | undefined;
          if (!tupleListValue || tupleListValue.length === 0) {
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
    <>
      <Flex width={getCssWidth(Width.FULL)} justifyContent={getCssJustification(block.alignment)}>
        <FieldBlock
          block={block}
          values={values}
          errors={errors}
          touched={touched}
          onChangeField={onChangeField}
          onBlurField={onBlurField}
        />
      </Flex>
      <pre>{JSON.stringify({ values, errors, touched, isValid }, null, 2)}</pre>
    </>
  );
};

export default Form;
