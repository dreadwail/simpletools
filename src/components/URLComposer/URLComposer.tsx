import { FC, useCallback, useMemo, useState } from 'react';

import Form, {
  BlockDeclaration,
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

changing select from same value to same value does not trigger touched/validation
debounce onChange
type safety on values everywhere based on supplied fields (if even possible?)
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

const fields: BlockDeclaration = {
  blocks: [
    {
      direction: Direction.HORIZONTAL,
      blocks: [
        {
          label: 'Connection',
          direction: Direction.HORIZONTAL,
          width: Width.HALF,
          blocks: [
            {
              type: FieldType.SELECT,
              name: 'scheme',
              width: Width.QUARTER,
              isRequired: true,
              label: 'Scheme',
              options: validSchemes.map(scheme => ({ label: scheme, value: scheme })),
              initialValue: 'https://',
              validate: values => {
                const value = values.scheme;
                if (value && !validSchemes.includes(value)) {
                  return 'Invalid scheme';
                }
              },
            },
            {
              type: FieldType.TEXT,
              name: 'host',
              width: Width.HALF,
              isRequired: true,
              label: 'Host',
            },
            {
              type: FieldType.TEXT,
              name: 'port',
              width: Width.QUARTER,
              isRequired: false,
              label: 'Port',
              initialValue: '80',
            },
          ],
        },
        {
          label: 'Resource',
          direction: Direction.HORIZONTAL,
          width: Width.HALF,
          blocks: [
            {
              type: FieldType.TEXT,
              name: 'path',
              width: Width.HALF,
              isRequired: true,
              label: 'Path',
            },
            {
              type: FieldType.TEXT,
              name: 'fragment',
              width: Width.HALF,
              isRequired: false,
              label: 'Fragment (Hash)',
            },
          ],
        },
      ],
    },
    {
      direction: Direction.HORIZONTAL,
      blocks: [
        {
          width: Width.TWO_THIRDS,
          label: 'Query Params',
          blocks: [
            {
              type: FieldType.TEXT,
              name: 'queryParams',
              width: Width.FULL,
              isRequired: false,
              label: 'Query Parameters',
            },
          ],
        },
        {
          direction: Direction.HORIZONTAL,
          width: Width.THIRD,
          label: 'Credentials (Optional)',
          blocks: [
            {
              type: FieldType.TEXT,
              name: 'username',
              width: Width.HALF,
              isRequired: values => values.scheme === 'mailto:',
              label: 'Username',
            },
            {
              type: FieldType.TEXT,
              name: 'password',
              width: Width.HALF,
              isRequired: false,
              label: 'Password',
            },
          ],
        },
      ],
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
      <Form fields={fields} onChange={onChange} />
      <pre>{JSON.stringify({ url }, null, 2)}</pre>
    </div>
  );
};

export default URLComposer;
