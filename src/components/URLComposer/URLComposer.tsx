import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import WebIcon from '@material-ui/icons/Language';
import LinkIcon from '@material-ui/icons/Link';
import { FC, useCallback, useMemo, useState } from 'react';

import Flex from '../Flex';
import Form, {
  BlockDeclaration,
  FieldDeclaration,
  ControlType,
  FormProps,
  Direction,
  Width,
  Values,
  Value,
} from '../Form';
import Heading from '../Heading';
import Link, { LinkProps } from '../Link';
import Text from '../Text';

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
  controlType: ControlType.SELECT,
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
  controlType: ControlType.INPUT,
  name: 'host',
  width: Width.HALF,
  isRequired: true,
  label: 'Host',
};

const portField: FieldDeclaration<URLFieldName> = {
  controlType: ControlType.INPUT,
  name: 'port',
  width: Width.QUARTER,
  isRequired: false,
  label: 'Port',
  initialValue: '443',
};

const pathField: FieldDeclaration<URLFieldName> = {
  controlType: ControlType.INPUT,
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
  controlType: ControlType.INPUT,
  name: 'fragment',
  width: Width.HALF,
  isRequired: false,
  label: 'Fragment (Hash)',
};

const queryParamsField: FieldDeclaration<URLFieldName> = {
  controlType: ControlType.TUPLE_LIST,
  name: 'queryParams',
  width: Width.FULL,
  isRequired: false,
  label: 'Query Params',
  fields: ['Key', 'Value'],
};

const usernameField: FieldDeclaration<URLFieldName> = {
  controlType: ControlType.INPUT,
  name: 'username',
  width: Width.HALF,
  isRequired: values => values.scheme === 'mailto:',
  label: 'Username',
};

const passwordField: FieldDeclaration<URLFieldName> = {
  controlType: ControlType.INPUT,
  name: 'password',
  width: Width.HALF,
  isRequired: false,
  label: 'Password',
};

const fields: BlockDeclaration<URLFieldName> = {
  blocks: [
    {
      label: 'Connection',
      direction: Direction.HORIZONTAL,
      blocks: [schemeField, hostField, portField],
    },
    {
      label: 'Resource',
      direction: Direction.HORIZONTAL,
      blocks: [pathField, fragmentField],
    },
    {
      label: 'Credentials (Optional)',
      direction: Direction.HORIZONTAL,
      blocks: [usernameField, passwordField],
    },
    {
      label: 'Query Params',
      blocks: [queryParamsField],
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

const resources: LinkProps[] = [
  { children: 'MDN: URL', href: 'https://developer.mozilla.org/en-US/docs/Web/API/URL' },
  { children: 'Wikipedia: URL', href: 'https://en.wikipedia.org/wiki/URL' },
  { children: 'WHATWG: URL Living Standard', href: 'https://url.spec.whatwg.org/#urls' },
];

const URLComposer: FC = () => {
  const [values, setValues] = useState<Values<URLFieldName>>({});
  const [isValid, setIsValid] = useState<boolean>(false);

  const onChange = useCallback<FormProps<URLFieldName>['onChange']>(payload => {
    setValues(payload.values);
    setIsValid(payload.isValid);
  }, []);

  const url = useMemo(() => {
    if (!isValid) {
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
  }, [values, isValid]);

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
      <Flex>
        <Form fields={fields} onChange={onChange} />
        <Box p={4} flexBasis="50%">
          <Heading level={3} visualLevel={6}>
            Resources:
          </Heading>
          <List dense>
            {resources.map(({ href, children }) => (
              <ListItem key={href}>
                <ListItemIcon>
                  <LinkIcon />
                </ListItemIcon>
                <ListItemText>
                  <Link href={href}>{children}</Link>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Box>
      </Flex>
    </div>
  );
};

export default URLComposer;
