import { FC, useCallback, useMemo, useState } from 'react';

import Form, {
  BlockDeclaration,
  FieldDeclaration,
  FormProps,
  Direction,
  Errors,
  Width,
  Values,
} from '../Form';

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

const connectionFields: FieldDeclaration[] = [
  {
    name: 'scheme',
    width: Width.QUARTER,
    required: true,
    label: 'Scheme (Protocol)',
    suffix: '://',
    validate: value => {
      if (/^(https?|http|ftp|mailto)$/.test(value)) {
        return null;
      }
      return 'Invalid scheme/protocol.';
    },
  },
  {
    name: 'host',
    width: Width.HALF,
    required: true,
    label: 'Host',
    validate: _value => null,
  },
  {
    name: 'port',
    width: Width.QUARTER,
    required: false,
    label: 'Port',
    validate: _value => null,
  },
];

const resourceFields: FieldDeclaration[] = [
  {
    name: 'path',
    width: Width.THIRD,
    required: true,
    label: 'Path',
    validate: _value => null,
  },
  {
    name: 'queryParams',
    width: Width.THIRD,
    required: false,
    label: 'Query Parameters',
    validate: _value => null,
  },
  {
    name: 'fragment',
    width: Width.THIRD,
    required: false,
    label: 'Fragment (Hash)',
    validate: _value => null,
  },
];

const credentialsFields: FieldDeclaration[] = [
  {
    name: 'username',
    width: Width.FULL,
    required: false,
    label: 'Username',
    validate: _value => null,
  },
  {
    name: 'password',
    width: Width.FULL,
    required: false,
    label: 'Password',
    validate: _value => null,
  },
];

const block: BlockDeclaration = {
  direction: Direction.HORIZONTAL,
  width: Width.FULL,
  blocks: [
    {
      direction: Direction.VERTICAL,
      width: Width.TWO_THIRDS,
      blocks: [
        {
          label: 'Connection',
          direction: Direction.HORIZONTAL,
          width: Width.FULL,
          blocks: connectionFields,
        },
        {
          label: 'Resource',
          direction: Direction.HORIZONTAL,
          width: Width.FULL,
          blocks: resourceFields,
        },
      ],
    },
    {
      direction: Direction.VERTICAL,
      width: Width.THIRD,
      label: 'Credentials',
      blocks: credentialsFields,
    },
  ],
};

const URLComposer: FC = () => {
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});

  const onChange = useCallback<FormProps['onChange']>(payload => {
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
      <Form fields={block} onChange={onChange} />
      <pre>{JSON.stringify({ values, errors, url }, null, 2)}</pre>
    </div>
  );
};

export default URLComposer;
