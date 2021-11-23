import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import type { FC } from 'react';
import { Provider } from 'react-redux';

import { store } from '../../state';
import Router from '../Router';

import theme from './theme';

const App: FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <Router />
    </Provider>
  </ThemeProvider>
);

export default App;
