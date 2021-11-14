import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { FC, ReactNode } from 'react';

export type LayoutProps = {
  readonly header: ReactNode;
  readonly navigation?: ReactNode;
};

const Layout: FC<LayoutProps> = ({ header, navigation, children }) => (
  <Container maxWidth="lg">
    <Box m={5}>
      <header>{header}</header>
      {navigation && <nav>{navigation}</nav>}
      <main>{children}</main>
    </Box>
  </Container>
);

export default Layout;
