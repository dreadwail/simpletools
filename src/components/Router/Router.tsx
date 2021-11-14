import { FC, useEffect } from 'react';
import { BrowserRouter, useLocation, Route, Switch } from 'react-router-dom';

import useRouting from '../../hooks/useRouting';
import Header from '../Header';
import Layout from '../Layout';
import NotFound from '../NotFound';

const PathChangeScrollToTop: FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Routes: FC = () => {
  const { routes } = useRouting();

  return (
    <Switch>
      {Object.keys(routes).map(routeKey => (
        <Route key={routeKey} path={routes[routeKey].path} exact>
          {routes[routeKey].element}
        </Route>
      ))}
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};

const Router: FC = () => (
  <BrowserRouter>
    <PathChangeScrollToTop />
    <Layout header={<Header />}>
      <Routes />
    </Layout>
  </BrowserRouter>
);

export default Router;
