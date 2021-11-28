import { useCallback, useEffect, useMemo, useState } from 'react';

import Flex from '../Flex';

import FieldBlock from './FieldBlock';
import {
  getCssWidth,
  getCssJustification,
  FieldType,
  Errors,
  BlockDeclaration,
  FieldDeclaration,
  OnBlurHandler,
  OnChangeHandler,
  Width,
  Touched,
  Values,
} from './types';

type FieldName = string;

type OnChangePayload<TFieldName extends string> = {
  readonly values: Values<TFieldName>;
  readonly errors: Errors<TFieldName>;
};

export type OnFormChange<TFieldName extends string> = (
  payload: OnChangePayload<TFieldName>
) => void;

export type FormProps<TFieldName extends string> = {
  readonly fields: BlockDeclaration<TFieldName>;
  readonly onChange: OnFormChange<TFieldName>;
};

const isBlockDeclaration = <TFieldName extends string>(
  block: FieldDeclaration<TFieldName> | BlockDeclaration<TFieldName>
): block is BlockDeclaration<TFieldName> =>
  Array.isArray((block as BlockDeclaration<TFieldName>).blocks);

const extractFields = <TFieldName extends string>(
  block: BlockDeclaration<TFieldName>
): Record<FieldName, FieldDeclaration<TFieldName>> =>
  block.blocks.reduce((memo, currentBlock) => {
    if (isBlockDeclaration(currentBlock)) {
      return { ...memo, ...extractFields(currentBlock) };
    }
    return { ...memo, [currentBlock.name]: currentBlock };
  }, {});

const Form = <TFieldName extends string>({ fields: block, onChange }: FormProps<TFieldName>) => {
  const fieldsByName = useMemo(() => extractFields(block), [block]);
  const initialValues = useMemo(
    () =>
      Object.keys(fieldsByName).reduce<Values<TFieldName>>(
        (memo, fieldName) => ({ ...memo, [fieldName]: fieldsByName[fieldName].initialValue }),
        {}
      ),
    [fieldsByName]
  );

  const [values, setValues] = useState<Values<TFieldName>>(initialValues);
  const [errors, setErrors] = useState<Errors<TFieldName>>({});
  const [touched, setTouched] = useState<Touched<TFieldName>>({});

  useEffect(() => {
    onChange({ values, errors });
  }, [onChange, values, errors]);

  const onChangeField = useCallback<OnChangeHandler<TFieldName>>(
    (name, value) => {
      const field = fieldsByName[name];
      if (
        field.type === FieldType.TEXT &&
        field.transform &&
        value !== null &&
        value !== undefined
      ) {
        const transformed = field.transform(value);
        setValues(oldValues => ({ ...oldValues, [name]: transformed }));
      } else {
        setValues(oldValues => ({ ...oldValues, [name]: value }));
      }
    },
    [fieldsByName]
  );

  const onBlurField = useCallback<OnBlurHandler<TFieldName>>(name => {
    setTouched(oldTouched => ({ ...oldTouched, [name]: true }));
  }, []);

  useEffect(() => {
    const newErrors = Object.keys(fieldsByName).reduce<Errors<TFieldName>>((memo, fieldName) => {
      const field = fieldsByName[fieldName];
      if (!field) {
        return memo;
      }

      const hasBeenTouched = !!touched[field.name];
      if (!hasBeenTouched) {
        return memo;
      }

      const isRequired =
        typeof field.isRequired === 'boolean' ? field.isRequired : !!field.isRequired?.(values);

      if (isRequired && !values[field.name]) {
        return { ...memo, [fieldName]: 'Required' };
      }

      const maybeError = field.validate?.(values);
      return { ...memo, [fieldName]: maybeError };
    }, {});
    setErrors(oldErrors => ({ ...oldErrors, ...newErrors }));
  }, [fieldsByName, values, touched]);

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
      <pre>{JSON.stringify({ values, errors, touched }, null, 2)}</pre>
    </>
  );
};

export default Form;
