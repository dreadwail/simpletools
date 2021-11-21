import Box from '@material-ui/core/Box';
import { FC } from 'react';

import useRouting from '../../hooks/useRouting';
import Heading from '../Heading';
import Link from '../Link';

const NotFound: FC = () => {
  const { rootRoute } = useRouting();

  return (
    <Box p={2}>
      <Heading level={3}>Not Found</Heading>
      <Link href={rootRoute.path}>Return to home</Link>
    </Box>
  );
};

export default NotFound;
