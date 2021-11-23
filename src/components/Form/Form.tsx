import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { FC, useMemo, useState } from 'react';

import Field from './Field';
import type { FieldDeclaration, FieldSetDeclaration, Value } from './types';

const DEFAULT_HELPER_TEXT = ' ';

type FieldName = string;
type Values = Record<FieldName, Value>;
type Error = string | null | undefined;
type Errors = Record<FieldName, Error>;
type OnChangeHandler = (value: Value) => void;
type OnChangeHandlers = Record<FieldName, OnChangeHandler>;
type HelperText = string;
type HelperTexts = Record<FieldName, HelperText>;

export enum Direction {
  HORIZONTAL,
  VERTICAL,
}

export type FormConfig = (FieldSetDeclaration | FieldDeclaration)[];

export type FormProps = {
  readonly direction: Direction;
  readonly config: FormConfig;
  readonly onSubmitSuccess: (values: Values) => void;
};

const isFieldSet = (
  suspect: FieldDeclaration | FieldSetDeclaration
): suspect is FieldSetDeclaration => !(suspect as FieldDeclaration).name;

const isField = (suspect: FieldDeclaration | FieldSetDeclaration): suspect is FieldDeclaration =>
  !isFieldSet(suspect);

const Form: FC<FormProps> = ({ direction, config }) => {
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});

  const fields = useMemo(
    () =>
      config.reduce<FieldDeclaration[]>((memo, fieldOrFieldSet) => {
        if (isField(fieldOrFieldSet)) {
          return [...memo, fieldOrFieldSet];
        }
        return [...memo, ...fieldOrFieldSet.fields];
      }, []),
    [config]
  );

  const onChangeHandlers = useMemo<OnChangeHandlers>(
    () =>
      fields.reduce<OnChangeHandlers>(
        (handlers, field) => ({
          ...handlers,
          [field.name]: (value: Value) => {
            const normalizedValue = value ?? '';
            setValues(oldValues => ({ ...oldValues, [field.name]: normalizedValue }));

            if (field.required && normalizedValue === '') {
              setErrors(oldErrors => ({ ...oldErrors, [field.name]: 'Required' }));
            } else if (normalizedValue === '') {
              setErrors(oldErrors => ({ ...oldErrors, [field.name]: null }));
            } else {
              const error = field.validate?.(normalizedValue);
              if (error) {
                setErrors(oldErrors => ({ ...oldErrors, [field.name]: error }));
              } else {
                setErrors(oldErrors => ({ ...oldErrors, [field.name]: null }));
              }
            }
          },
        }),
        {}
      ),
    [fields]
  );

  const helperTexts = useMemo<HelperTexts>(
    () =>
      fields.reduce<HelperTexts>((memo, field) => {
        const error = errors[field.name];
        if (error) {
          return { ...memo, [field.name]: error };
        }
        const helperText = field.helperText;
        if (helperText) {
          return { ...memo, [field.name]: helperText };
        }
        if (!values[field.name]) {
          if (field.required) {
            return { ...memo, [field.name]: 'Required' };
          }
          return { ...memo, [field.name]: 'Optional' };
        }

        return { ...memo, [field.name]: DEFAULT_HELPER_TEXT };
      }, {}),
    [fields, values, errors]
  );

  return (
    <>
      {config.map((fieldOrFieldSet, index) => {
        if (isFieldSet(fieldOrFieldSet)) {
          return (
            <Box pb={1}>
              <Paper variant="elevation" elevation={0}>
                <FormControl
                  key={`fieldset-${index}`}
                  component="fieldset"
                  fullWidth={direction === Direction.VERTICAL}
                >
                  <Box px={1} py={1}>
                    <FormLabel component="legend">
                      <Typography variant="subtitle2" color="primary">
                        {fieldOrFieldSet.label}
                      </Typography>
                    </FormLabel>
                  </Box>
                  <Box px={2}>
                    {fieldOrFieldSet.fields.map(field => (
                      <Field
                        key={field.name}
                        {...field}
                        helperText={helperTexts[field.name]}
                        hasError={!!errors[field.name]}
                        value={values[field.name]}
                        onChange={onChangeHandlers[field.name]}
                        fullWidth={direction === Direction.VERTICAL}
                      />
                    ))}
                  </Box>
                </FormControl>
              </Paper>
            </Box>
          );
        }
        return (
          <Field
            key={fieldOrFieldSet.name}
            {...fieldOrFieldSet}
            helperText={helperTexts[fieldOrFieldSet.name]}
            hasError={!!errors[fieldOrFieldSet.name]}
            value={values[fieldOrFieldSet.name]}
            onChange={onChangeHandlers[fieldOrFieldSet.name]}
            fullWidth={direction === Direction.VERTICAL}
          />
        );
      })}
      <pre>{JSON.stringify({ values, errors }, null, 2)}</pre>
    </>
  );
};

export default Form;
