import type { FC } from 'react';

import Form, { FormConfig, Direction } from '../Form';

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

// type FieldName =
//   | 'scheme'
//   | 'username'
//   | 'password'
//   | 'host'
//   | 'port'
//   | 'path'
//   | 'queryParams'
//   | 'fragment';
const config: FormConfig = {
  direction: Direction.HORIZONTAL,
  blocks: [
    {
      label: 'Connection',
      direction: Direction.VERTICAL,
      fields: [
        {
          name: 'scheme',
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
          required: true,
          label: 'Host',
          validate: _value => null,
        },
        {
          name: 'port',
          required: false,
          label: 'Port',
          validate: _value => null,
        },
      ],
    },
    {
      label: 'Resource',
      direction: Direction.VERTICAL,
      fields: [
        {
          name: 'path',
          required: true,
          label: 'Path',
          validate: _value => null,
        },
        {
          name: 'queryParams',
          required: false,
          label: 'Query Parameters',
          validate: _value => null,
        },
        {
          name: 'fragment',
          required: false,
          label: 'Fragment (Hash)',
          validate: _value => null,
        },
      ],
    },
    {
      label: 'Credentials',
      direction: Direction.VERTICAL,
      fields: [
        {
          name: 'username',
          required: false,
          label: 'Username',
          validate: _value => null,
        },
        {
          name: 'password',
          required: false,
          label: 'Password',
          validate: _value => null,
        },
      ],
    },
  ],
};

const URLComposer: FC = () => (
  <div>
    <Form config={config} />
  </div>
);

export default URLComposer;
