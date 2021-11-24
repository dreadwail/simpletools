import Box from '@material-ui/core/Box';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import Flex from '../Flex';

import FieldBlock from './FieldBlock';
import FieldSet from './FieldSet';
import type { Error, FieldDeclaration, FormConfig, OnChangeHandler, Value } from './types';
import { Direction } from './types';

type FieldName = string;
type Values = Record<FieldName, Value>;
type Errors = Record<FieldName, Error>;
type FieldsByName = Record<FieldName, FieldDeclaration>;

type OnChangePayload = {
  readonly values: Values;
  readonly errors: Errors;
};

export type FormProps = {
  readonly config: FormConfig;
  readonly onChange?: (payload: OnChangePayload) => void;
};

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

  const onChangeField = useCallback<OnChangeHandler>(
    (name, value) => {
      const normalizedValue = value ?? '';
      setValues(oldValues => ({ ...oldValues, [name]: normalizedValue }));

      const field = fieldsByName[name];
      if (!field) {
        return;
      }

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
    [fieldsByName]
  );

  // const onChangeHandlers = useMemo(
  //   () =>
  //     fields.reduce<OnChangeHandlers>(
  //       (handlers, field) => ({
  //         ...handlers,
  //         [field.name]: (value: Value) => {
  //           const normalizedValue = value ?? '';
  //           setValues(oldValues => ({ ...oldValues, [field.name]: normalizedValue }));

  //           if (field.required && normalizedValue === '') {
  //             setErrors(oldErrors => ({ ...oldErrors, [field.name]: 'Required' }));
  //           } else if (normalizedValue === '') {
  //             setErrors(oldErrors => ({ ...oldErrors, [field.name]: null }));
  //           } else {
  //             const error = field.validate?.(normalizedValue);
  //             if (error) {
  //               setErrors(oldErrors => ({ ...oldErrors, [field.name]: error }));
  //             } else {
  //               setErrors(oldErrors => ({ ...oldErrors, [field.name]: null }));
  //             }
  //           }
  //         },
  //       }),
  //       {}
  //     ),
  //   [fields]
  // );

  return (
    <>
      <Flex flexDirection={config.direction === Direction.HORIZONTAL ? 'row' : 'column'} gap={5}>
        {config.blocks.map(({ label, ...block }, index) => {
          const fieldBlock = (
            <FieldBlock {...block} values={values} errors={errors} onChangeField={onChangeField} />
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
      <pre>{JSON.stringify({ values, errors }, null, 2)}</pre>
    </>
  );
};

export default Form;
