import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { FC, ReactNode, useMemo, useState } from 'react';

/*
form inputs (common)
scheme/protocol
host / domain
path
query params
hash / fragment

form inputs (advanced)
username / password
port

button to create

generated url
copy button for generated url

generated curl
copy button for generated curl

additional resources section
https://developer.mozilla.org/en-US/docs/Web/API/URL
https://en.wikipedia.org/wiki/URL
https://url.spec.whatwg.org/#urls

*/

type FieldName =
  | 'scheme'
  | 'username'
  | 'password'
  | 'host'
  | 'port'
  | 'path'
  | 'queryParams'
  | 'fragment';

type Field = {
  readonly required: boolean;
  readonly label: string;
  readonly startAdornment?: ReactNode;
  readonly endAdornment?: ReactNode;
  readonly validate: (value: string) => string | null;
};

const fields: Record<FieldName, Field> = {
  scheme: {
    required: true,
    label: 'Scheme (Protocol)',
    validate: value => {
      if (/^(https?|http|ftp|mailto):?(\/\/)?$/.test(value)) {
        return null;
      }
      return 'Invalid scheme/protocol.';
    },
  },
  username: {
    required: false,
    label: 'Username',
    validate: _value => null,
  },
  password: {
    required: false,
    label: 'Password',
    validate: _value => null,
  },
  host: {
    required: true,
    label: 'Host',
    validate: _value => null,
  },
  port: {
    required: false,
    label: 'Port',
    validate: _value => null,
  },
  path: {
    required: true,
    label: 'Path',
    validate: _value => null,
  },
  queryParams: {
    required: false,
    label: 'Query Parameters',
    validate: _value => null,
  },
  fragment: {
    required: false,
    label: 'Fragment (Hash)',
    validate: _value => null,
  },
};

const fieldNames = Object.keys(fields) as FieldName[];

type Values = { [key in FieldName]?: string };
type Errors = { [key in FieldName]?: string };
type TextFieldChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type OnChangeHandler = (event: TextFieldChangeEvent) => void;
type OnChangeHandlers = { [key in FieldName]?: OnChangeHandler };

const URLComposer: FC = () => {
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});

  const onChangeHandlers = useMemo<OnChangeHandlers>(
    () =>
      fieldNames.reduce<OnChangeHandlers>(
        (handlers, fieldName) => ({
          ...handlers,
          [fieldName]: (event: TextFieldChangeEvent) => {
            const value = event.target.value;
            const field = fields[fieldName];
            const error = field.validate(value);
            setValues(oldValues => ({ ...oldValues, [fieldName]: value }));
            if (error) {
              setErrors(oldErrors => ({ ...oldErrors, [fieldName]: error }));
            } else {
              setErrors(oldErrors => ({ ...oldErrors, [fieldName]: null }));
            }
          },
        }),
        {}
      ),
    []
  );

  return (
    <>
      {fieldNames.map(fieldName => (
        <TextField
          key={fieldName}
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          label={fields[fieldName].label}
          InputProps={{
            startAdornment: fields[fieldName].startAdornment ? (
              <InputAdornment position="start">{fields[fieldName].startAdornment}</InputAdornment>
            ) : null,
            endAdornment: fields[fieldName].endAdornment ? (
              <InputAdornment position="end">{fields[fieldName].endAdornment}</InputAdornment>
            ) : null,
          }}
          value={values[fieldName]}
          error={!!errors[fieldName]}
          helperText={errors[fieldName]}
          required={fields[fieldName].required}
          onChange={onChangeHandlers[fieldName]}
        />
      ))}
      <pre>{JSON.stringify({ values, errors }, null, 2)}</pre>
    </>
  );
};

export default URLComposer;
