import Box from '@material-ui/core/Box';
import { FC } from 'react';

import Link from '../Link';

const Home: FC = () => (
  <Box p={2}>
    <Link href="/url-composer">URL Composer</Link>
  </Box>
);

export default Home;
