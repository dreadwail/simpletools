import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import WebIcon from '@material-ui/icons/Language';
import LinkIcon from '@material-ui/icons/Link';
import { FC, useCallback, useMemo, useState } from 'react';

import Form, {
  BlockDeclaration,
  FieldDeclaration,
  ControlType,
  FormProps,
  Direction,
  Width,
} from '../Form';
import Heading from '../Heading';
import Link, { LinkProps } from '../Link';
import Text from '../Text';

const validSchemes = [
  'https://',
  'http://',
  // 'file://',
  // 'git://',
  // 'mailto:',
  'ftp://',
  // 'ldap://',
  // 'ldaps://',
  // 'blob:',
  // 'cvs://',
] as const;

type ValidScheme = typeof validSchemes[number];

type URLComposerForm = {
  readonly scheme: ValidScheme;
  readonly host: string;
  readonly port?: number;
  readonly path?: string;
  readonly fragment?: string;
  readonly queryParams?: [string, string][];
  readonly username?: string;
  readonly password?: string;
};

const pathField: FieldDeclaration<URLComposerForm, 'path'> = {
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

const fragmentField: FieldDeclaration<URLComposerForm, 'fragment'> = {
  controlType: ControlType.INPUT,
  name: 'fragment',
  width: Width.HALF,
  isRequired: false,
  label: 'Fragment (Hash)',
};

const queryParamsField: FieldDeclaration<URLComposerForm, 'queryParams'> = {
  controlType: ControlType.LIST,
  name: 'queryParams',
  width: Width.FULL,
  isRequired: false,
  helperText: 'stuff!',
  label: 'Query Params',
  fields: ['Key', 'Value'],
};

const usernameField: FieldDeclaration<URLComposerForm, 'username'> = {
  controlType: ControlType.INPUT,
  name: 'username',
  width: Width.HALF,
  label: 'Username',
};

const passwordField: FieldDeclaration<URLComposerForm, 'password'> = {
  controlType: ControlType.INPUT,
  name: 'password',
  width: Width.HALF,
  isRequired: false,
  label: 'Password',
};

const fields: BlockDeclaration<URLComposerForm> = {
  blocks: [
    {
      label: 'Connection',
      direction: Direction.HORIZONTAL,
      blocks: [
        {
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
        },
        {
          controlType: ControlType.INPUT,
          name: 'host',
          width: Width.HALF,
          isRequired: true,
          label: 'Host',
        },
        {
          controlType: ControlType.INPUT,
          name: 'port',
          width: Width.QUARTER,
          isRequired: false,
          label: 'Port',
          initialValue: 443,
        },
      ],
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
    queryParamsField,
  ],
};

const normalizePort = (
  scheme: URLComposerForm['scheme'] | undefined,
  port: URLComposerForm['port'] | undefined
): string => {
  if (scheme === 'http://' && port === 80) {
    return '';
  }
  if (scheme === 'https://' && port === 443) {
    return '';
  }
  return String(port);
};

const normalizeFragment = (fragment: URLComposerForm['fragment'] | undefined): string => {
  if (fragment && typeof fragment === 'string' && !fragment.startsWith('#')) {
    return `#${fragment}`;
  }
  return fragment ?? '';
};

const buildQueryParams = (queryParams: URLComposerForm['queryParams'] | undefined = []): string => {
  if (queryParams.length === 0) {
    return '';
  }
  const params = new URLSearchParams('');
  queryParams.forEach(([key, value]) => {
    params.append(key, value);
  });
  return `?${params.toString()}`;
};

const normalizeCredentials = (
  username: URLComposerForm['username'] | undefined,
  password: URLComposerForm['password'] | undefined
): string => {
  if (!username) {
    return '';
  }
  return `${[username, password].filter(x => x).join(':')}@`;
};

const normalizePath = (path: URLComposerForm['path'] | undefined): string => {
  if (!path) {
    return '';
  }
  if (path.startsWith('/')) {
    return path;
  }
  return `/${path}`;
};

const resources: LinkProps[] = [
  { children: 'MDN: URL', href: 'https://developer.mozilla.org/en-US/docs/Web/API/URL' },
  { children: 'Wikipedia: URL', href: 'https://en.wikipedia.org/wiki/URL' },
  { children: 'WHATWG: URL Living Standard', href: 'https://url.spec.whatwg.org/#urls' },
];

const URLComposer: FC = () => {
  const [values, setValues] = useState<Partial<URLComposerForm>>({});
  const [isValid, setIsValid] = useState<boolean>(false);

  const onChange = useCallback<FormProps<URLComposerForm>['onChange']>(payload => {
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
      <Box mb={4}>
        <Text>Use the fields below to construct a URL.</Text>
        <Paper variant="outlined">
          <Box display="flex" alignItems="center" p={1}>
            <WebIcon fontSize="large" />
            <Box ml={2}>
              <Heading level={2} visualLevel={4}>
                {url}
              </Heading>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Grid container>
        <Grid item xs={12} md={7}>
          <Form fields={fields} onChange={onChange} />
        </Grid>
        <Grid item xs={12} md={5}>
          <Box px={4} py={2} flexBasis="50%">
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
        </Grid>
      </Grid>
    </div>
  );
};

export default URLComposer;
