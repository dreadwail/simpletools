import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Divider from '@material-ui/core/Divider';
import type { FC } from 'react';

import useRouting from '../../hooks/useRouting';
import Link from '../Link';
import Text from '../Text';

const Navigation: FC = () => {
  const { rootRoute, currentRoute } = useRouting();

  const isNotRoot = currentRoute.path !== rootRoute.path;

  return (
    <Box mb={3}>
      {isNotRoot && (
        <Breadcrumbs aria-label="breadcrumb">
          <Link href={rootRoute.path}>{rootRoute.title}</Link>
          <Text color="textSecondary" paragraph={false}>
            {currentRoute.title}
          </Text>
        </Breadcrumbs>
      )}
      <Box my={1}>
        <Divider />
      </Box>
    </Box>
  );
};

export default Navigation;
