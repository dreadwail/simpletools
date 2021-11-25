import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import FieldBlock from './FieldBlock';
import type {
  Error,
  Errors,
  BlockDeclaration,
  FieldDeclaration,
  OnBlurHandler,
  OnChangeHandler,
  Value,
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

const normalizeValue = (value: Value): string => value ?? '';

const extractFields = (block: BlockDeclaration): Record<FieldName, FieldDeclaration> =>
  block.blocks.reduce((memo, currentBlock) => {
    if (isBlockDeclaration(currentBlock)) {
      return { ...memo, ...extractFields(currentBlock) };
    }
    return { ...memo, [currentBlock.name]: currentBlock };
  }, {});

const computeError = (field: FieldDeclaration, value: Value): Error => {
  const normalizedValue = normalizeValue(value);

  if (field.required && normalizedValue === '') {
    return 'Required';
  }

  if (normalizedValue === '') {
    return null;
  }

  const error = field.validate?.(normalizedValue);
  if (error) {
    return error;
  }

  return null;
};

const Form: FC<FormProps> = ({ fields: block, onChange }) => {
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    onChange({ values, errors });
  }, [onChange, values, errors]);

  const fieldsByName = useMemo(() => extractFields(block), [block]);

  const onChangeField = useCallback<OnChangeHandler>((name, value) => {
    const normalizedValue = normalizeValue(value);
    setValues(oldValues => ({ ...oldValues, [name]: normalizedValue }));
  }, []);

  const onBlurField = useCallback<OnBlurHandler>(
    name => {
      const field = fieldsByName[name];
      if (!field) {
        return;
      }

      const value = values[field.name];
      const error = computeError(field, value);
      setErrors(oldErrors => ({ ...oldErrors, [name]: error }));
    },
    [fieldsByName, values]
  );

  return (
    <FieldBlock
      block={block}
      values={values}
      errors={errors}
      onChangeField={onChangeField}
      onBlurField={onBlurField}
    />
  );
};

export default Form;
