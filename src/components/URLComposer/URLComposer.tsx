import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import WebIcon from '@material-ui/icons/Language';
import { FC, useCallback, useMemo, useState } from 'react';

import Flex from '../Flex';
import Form, {
  BlockDeclaration,
  FieldDeclaration,
  FieldType,
  FormProps,
  Direction,
  Errors,
  Width,
  Values,
  Value,
} from '../Form';
import Heading from '../Heading';
import Text from '../Text';

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
  initialValue: '443',
};

const pathField: FieldDeclaration<URLFieldName> = {
  type: FieldType.TEXT,
  name: 'path',
  width: Width.HALF,
  label: 'Path',
  isDisabled: values => {
    if (values.scheme && typeof values.scheme === 'string') {
      return !values.scheme.endsWith('//');
    }
    return false;
  },
};

const fragmentField: FieldDeclaration<URLFieldName> = {
  type: FieldType.TEXT,
  name: 'fragment',
  width: Width.HALF,
  isRequired: false,
  label: 'Fragment (Hash)',
};

const queryParamsField: FieldDeclaration<URLFieldName> = {
  type: FieldType.TUPLE_LIST,
  name: 'queryParams',
  width: Width.FULL,
  isRequired: false,
  label: 'Query Params',
  fields: ['Key', 'Value'],
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
  direction: Direction.VERTICAL,
  blocks: [
    {
      direction: Direction.HORIZONTAL,
      width: Width.FULL,
      blocks: [
        {
          label: 'Connection',
          direction: Direction.HORIZONTAL,
          width: Width.HALF,
          blocks: [schemeField, hostField, portField],
        },
        {
          label: 'Resource',
          direction: Direction.HORIZONTAL,
          width: Width.HALF,
          blocks: [pathField, fragmentField],
        },
      ],
    },
    {
      direction: Direction.HORIZONTAL,
      width: Width.FULL,
      blocks: [
        {
          direction: Direction.HORIZONTAL,
          width: Width.HALF,
          label: 'Credentials (Optional)',
          blocks: [usernameField, passwordField],
        },
        {
          label: 'Query Params',
          direction: Direction.VERTICAL,
          width: Width.HALF,
          blocks: [queryParamsField],
        },
      ],
    },
  ],
};

const normalizePort = (scheme: Value | undefined, port: Value | undefined): Value | undefined => {
  if (scheme === 'http://' && port === '80') {
    return '';
  }
  if (scheme === 'https://' && port === '443') {
    return '';
  }
  return port;
};

const normalizeFragment = (fragment: Value | undefined): Value | undefined => {
  if (fragment && typeof fragment === 'string' && !fragment.startsWith('#')) {
    return `#${fragment}`;
  }
  return fragment;
};

const buildQueryParams = (queryParams: Value | undefined): string => {
  if (Array.isArray(queryParams) && queryParams.length > 0 && Array.isArray(queryParams[0])) {
    const params = new URLSearchParams('');
    queryParams.forEach(([key, value]) => {
      params.append(key, value);
    });
    return `?${params.toString()}`;
  }
  return '';
};

const normalizeCredentials = (username: Value | undefined, password: Value | undefined): string => {
  if (!username) {
    return '';
  }
  return `${[username, password].filter(x => x).join(':')}@`;
};

const normalizePath = (path: Value | undefined): string => {
  if (path && typeof path === 'string') {
    if (!path.startsWith('/')) {
      return `/${path}`;
    }
    return path;
  }
  return '';
};

const URLComposer: FC = () => {
  const [values, setValues] = useState<Values<URLFieldName>>({});
  const [errors, setErrors] = useState<Errors<URLFieldName>>({});
  // const [isValid, setIsValid] = useState<boolean>(false);

  const onChange = useCallback<FormProps<URLFieldName>['onChange']>(payload => {
    setValues(payload.values);
    setErrors(payload.errors);
    // setIsValid(payload.isValid);
  }, []);

  const url = useMemo(() => {
    const hasErrors = Object.values(errors).filter(val => val).length > 0;
    if (hasErrors) {
      return '';
    }
    const { scheme, host, port, path, queryParams, fragment, username, password } = values;
    const authority = [host, normalizePort(scheme, port)].filter(val => val).join(':');
    const params = buildQueryParams(queryParams);

    return [
      scheme,
      normalizeCredentials(username, password),
      authority,
      normalizePath(path),
      params,
      normalizeFragment(fragment),
    ].join('');
  }, [values, errors]);

  return (
    <div>
      <Box mx={2} mb={4}>
        <Text>Use the fields below to construct a URL.</Text>
        <Paper variant="outlined">
          <Flex alignItems="center" p={1}>
            <WebIcon fontSize="large" />
            <Box ml={2}>
              <Heading level={2} visualLevel={4}>
                {url}
              </Heading>
            </Box>
          </Flex>
        </Paper>
      </Box>
      <Form fields={fields} onChange={onChange} />
    </div>
  );
};

export default URLComposer;
