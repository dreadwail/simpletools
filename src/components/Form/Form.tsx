import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import Flex from '../Flex';

import FieldBlock from './FieldBlock';
import {
  getCssWidth,
  getCssJustification,
  FieldType,
  MaybeError,
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

type OnChangePayload = {
  readonly values: Values;
  readonly errors: Errors;
};

export type OnFormChange = (payload: OnChangePayload) => void;

export type FormProps = {
  readonly fields: BlockDeclaration;
  readonly onChange: OnFormChange;
};

const isBlockDeclaration = (
  block: FieldDeclaration | BlockDeclaration
): block is BlockDeclaration => Array.isArray((block as BlockDeclaration).blocks);

const extractFields = (block: BlockDeclaration): Record<FieldName, FieldDeclaration> =>
  block.blocks.reduce((memo, currentBlock) => {
    if (isBlockDeclaration(currentBlock)) {
      return { ...memo, ...extractFields(currentBlock) };
    }
    return { ...memo, [currentBlock.name]: currentBlock };
  }, {});

type ComputeErrorOptions = {
  readonly field: FieldDeclaration;
  readonly values: Values;
  readonly touched: Touched;
};

const computeError = ({ field, values, touched }: ComputeErrorOptions): MaybeError => {
  if (!touched[field.name]) {
    return null;
  }

  const value = values[field.name] ?? '';

  if (field.required && !value) {
    return 'Required';
  }

  const error = field.validate?.({ value, values });
  if (error) {
    return error;
  }

  return null;
};

const Form: FC<FormProps> = ({ fields: block, onChange }) => {
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});

  const fieldsByName = useMemo(() => extractFields(block), [block]);

  const initialTouched = useMemo(
    () =>
      Object.keys(fieldsByName).reduce<Touched>((memo, name) => ({ ...memo, [name]: false }), {}),
    [fieldsByName]
  );

  const [touched, setTouched] = useState<Touched>(initialTouched);

  useEffect(() => {
    onChange({ values, errors });
  }, [onChange, values, errors]);

  const onChangeField = useCallback<OnChangeHandler>(
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

  const onBlurField = useCallback<OnBlurHandler>(
    name => {
      setTouched(oldTouched => ({ ...oldTouched, [name]: true }));
      const field = fieldsByName[name];
      if (field.onTouch) {
        const { values: newValues = {}, errors: newErrors = {} } =
          field.onTouch({ values, errors }) ?? {};
        setValues(oldValues => ({ ...oldValues, ...newValues }));
        setErrors(oldErrors => ({ ...oldErrors, ...newErrors }));
      }
    },
    [errors, fieldsByName, values]
  );

  useEffect(() => {
    const newErrors = Object.keys(fieldsByName).reduce<Errors>((memo, fieldName) => {
      const field = fieldsByName[fieldName];
      if (!field) {
        return memo;
      }
      const error = computeError({ field, values, touched });
      return { ...memo, [fieldName]: error };
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
          onChangeField={onChangeField}
          onBlurField={onBlurField}
        />
      </Flex>
      <pre>{JSON.stringify({ values, errors, touched }, null, 2)}</pre>
    </>
  );
};

export default Form;
