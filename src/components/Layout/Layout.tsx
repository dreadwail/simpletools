import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { FC, ReactNode } from 'react';

export type LayoutProps = {
  readonly header: ReactNode;
  readonly navigation?: ReactNode;
};

const Layout: FC<LayoutProps> = ({ header, navigation, children }) => (
  <Container maxWidth="lg">
    <Box m={3}>
      <Paper variant="outlined">
        <Box p={3}>
          <header>{header}</header>
          {navigation && <nav>{navigation}</nav>}
          <main>{children}</main>
        </Box>
      </Paper>
    </Box>
  </Container>
);

export default Layout;
