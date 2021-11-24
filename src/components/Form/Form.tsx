import Box from '@material-ui/core/Box';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import Flex from '../Flex';

import FieldBlock from './FieldBlock';
import FieldSet from './FieldSet';
import type {
  Error,
  FieldDeclaration,
  FormConfig,
  OnBlurHandler,
  OnChangeHandler,
  Value,
} from './types';
import { Direction } from './types';

type FieldName = string;
type FieldsByName = Record<FieldName, FieldDeclaration>;

export type Values = Record<FieldName, Value>;
export type Errors = Record<FieldName, Error>;

type OnChangePayload = {
  readonly values: Values;
  readonly errors: Errors;
};

export type FormProps = {
  readonly config: FormConfig;
  readonly onChange: (payload: OnChangePayload) => void;
};

const normalizeValue = (value: Value): string => value ?? '';

const Form: FC<FormProps> = ({ config, onChange }) => {
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (onChange) {
      onChange({ values, errors });
    }
  }, [onChange, values, errors]);

  const fieldsByName = useMemo(() => {
    const fields = config.blocks.map(block => block.fields ?? []).flat();
    return fields.reduce<FieldsByName>((memo, field) => ({ ...memo, [field.name]: field }), {});
  }, [config.blocks]);

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
      const normalizedValue = normalizeValue(value);

      if (field.required && normalizedValue === '') {
        setErrors(oldErrors => ({ ...oldErrors, [name]: 'Required' }));
      } else if (normalizedValue === '') {
        setErrors(oldErrors => ({ ...oldErrors, [name]: null }));
      } else {
        const error = field.validate?.(normalizedValue);
        if (error) {
          setErrors(oldErrors => ({ ...oldErrors, [name]: error }));
        } else {
          setErrors(oldErrors => ({ ...oldErrors, [name]: null }));
        }
      }
    },
    [fieldsByName, values]
  );

  return (
    <Flex flexDirection={config.direction === Direction.HORIZONTAL ? 'row' : 'column'} gap={5}>
      {config.blocks.map(({ label, ...block }, index) => {
        const fieldBlock = (
          <FieldBlock
            {...block}
            values={values}
            errors={errors}
            onChangeField={onChangeField}
            onBlurField={onBlurField}
          />
        );

        if (label) {
          return (
            <Box key={index} mb={2}>
              <FieldSet label={label} direction={block.direction}>
                {fieldBlock}
              </FieldSet>
            </Box>
          );
        }

        return (
          <Box key={index} mb={2}>
            {fieldBlock}
          </Box>
        );
      })}
    </Flex>
  );
};

export default Form;
