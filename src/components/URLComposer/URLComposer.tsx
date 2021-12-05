import { FC, useCallback, useMemo, useState } from 'react';

import Form, {
  BlockDeclaration,
  FieldDeclaration,
  FieldType,
  FormProps,
  Direction,
  Errors,
  Width,
  Values,
} from '../Form';

/*
generated url
copy button for generated url

additional resources section
https://developer.mozilla.org/en-US/docs/Web/API/URL
https://en.wikipedia.org/wiki/URL
https://url.spec.whatwg.org/#urls
*/

/*
WIP:

form control for accumulating many values (query params)
*/

const validSchemes: string[] = [
  'https://',
  'http://',
  'file://',
  'git://',
  'mailto:',
  'ftp://',
  'ldap://',
  'ldaps://',
  'blob:',
  'cvs://',
];

type URLFieldName =
  | 'scheme'
  | 'host'
  | 'port'
  | 'path'
  | 'fragment'
  | 'queryParams'
  | 'username'
  | 'password';

const schemeField: FieldDeclaration<URLFieldName> = {
  type: FieldType.SELECT,
  name: 'scheme',
  width: Width.QUARTER,
  isRequired: true,
  label: 'Scheme',
  options: validSchemes.map(scheme => ({ label: scheme, value: scheme })),
  initialValue: 'https://',
  validate: value => {
    if (value && !validSchemes.includes(value)) {
      return 'Invalid scheme';
    }
  },
};

const hostField: FieldDeclaration<URLFieldName> = {
  type: FieldType.TEXT,
  name: 'host',
  width: Width.HALF,
  isRequired: true,
  label: 'Host',
};

const portField: FieldDeclaration<URLFieldName> = {
  type: FieldType.TEXT,
  name: 'port',
  width: Width.QUARTER,
  isRequired: false,
  label: 'Port',
  initialValue: '80',
};

const pathField: FieldDeclaration<URLFieldName> = {
  type: FieldType.TEXT,
  name: 'path',
  width: Width.HALF,
  isRequired: true,
  label: 'Path',
};

const fragmentField: FieldDeclaration<URLFieldName> = {
  type: FieldType.TEXT,
  name: 'fragment',
  width: Width.HALF,
  isRequired: false,
  label: 'Fragment (Hash)',
};

const queryParamsField: FieldDeclaration<URLFieldName> = {
  type: FieldType.LIST,
  name: 'queryParams',
  width: Width.FULL,
  isRequired: false,
  label: 'Query Parameters',
};

const usernameField: FieldDeclaration<URLFieldName> = {
  type: FieldType.TEXT,
  name: 'username',
  width: Width.HALF,
  isRequired: values => values.scheme === 'mailto:',
  label: 'Username',
};

const passwordField: FieldDeclaration<URLFieldName> = {
  type: FieldType.TEXT,
  name: 'password',
  width: Width.HALF,
  isRequired: false,
  label: 'Password',
};

const fields: BlockDeclaration<URLFieldName> = {
  direction: Direction.HORIZONTAL,
  blocks: [
    {
      direction: Direction.VERTICAL,
      width: Width.HALF,
      blocks: [
        {
          label: 'Connection',
          direction: Direction.HORIZONTAL,
          width: Width.FULL,
          blocks: [schemeField, hostField, portField],
        },
        {
          label: 'Resource',
          direction: Direction.HORIZONTAL,
          width: Width.FULL,
          blocks: [pathField, fragmentField],
        },
      ],
    },
    {
      direction: Direction.VERTICAL,
      width: Width.HALF,
      blocks: [
        {
          direction: Direction.HORIZONTAL,
          width: Width.FULL,
          label: 'Credentials (Optional)',
          blocks: [usernameField, passwordField],
        },
        {
          width: Width.FULL,
          label: 'Query Params',
          blocks: [queryParamsField],
        },
      ],
    },
  ],
};

const URLComposer: FC = () => {
  const [values, setValues] = useState<Values<URLFieldName>>({});
  const [errors, setErrors] = useState<Errors<URLFieldName>>({});

  const onChange = useCallback<FormProps<URLFieldName>['onChange']>(payload => {
    setValues(payload.values);
    setErrors(payload.errors);
  }, []);

  const url = useMemo(() => {
    const hasErrors = Object.values(errors).filter(val => val).length > 0;
    if (hasErrors) {
      return 'Invalid';
    }
    const { scheme, host, port, path /* , queryParams, fragment */, username, password } = values;
    const credentials = [username, password].filter(val => val).join(':');
    const authority = [host, port].filter(val => val).join(':');
    return [scheme, credentials, authority, path].join('');
  }, [values, errors]);

  return (
    <div>
      <Form fields={fields} onChange={onChange} />
      <pre>{JSON.stringify({ url }, null, 2)}</pre>
    </div>
  );
};

export default URLComposer;
