import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import type { FC } from 'react';

import useRouting from '../../hooks/useRouting';
import Heading from '../Heading';
import Link from '../Link';

const defaultAppName = 'SimpleTools';
const appName = process.env.REACT_APP_NAME ?? defaultAppName;

const Header: FC = () => {
  const { rootRoute, currentRoute } = useRouting();

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Grid container>
      <Grid item xs={12} sm={6}>
        <Link href={rootRoute.path}>
          <Heading level={1} visualLevel={4} color="primary">
            <strong>{appName}</strong>
          </Heading>
        </Link>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Heading
          level={2}
          visualLevel={5}
          color="secondary"
          align={isLargeScreen ? 'right' : 'left'}
        >
          <strong>{currentRoute.title}</strong>
        </Heading>
      </Grid>
    </Grid>
  );
};

export default Header;
