import Box from '@material-ui/core/Box';
import { FC } from 'react';

import useRouting from '../../hooks/useRouting';
import Heading from '../Heading';
import Link from '../Link';

const defaultAppName = 'SimpleTools';
const appName = process.env.REACT_APP_NAME ?? defaultAppName;

const Header: FC = () => {
  const { rootPath, currentRoute } = useRouting();

  return (
    <Box display="flex" justifyContent="space-between">
      <Link href={rootPath}>
        <Heading level={1} visualLevel={3} color="primary">
          <strong>{appName}</strong>
        </Heading>
      </Link>
      <Heading level={2} visualLevel={3} color="secondary">
        <strong>{currentRoute.title}</strong>
      </Heading>
    </Box>
  );
};

export default Header;
