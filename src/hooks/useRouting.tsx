import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import Catalog from '../components/Catalog';
import URLComposer from '../components/URLComposer';

type Route = {
  readonly path: string;
  readonly title?: string;
  readonly element: ReactNode;
};

type Routes = Record<string, Route>;

type Routing = {
  readonly rootPath: string;
  readonly currentRoute: Route;
  readonly routes: Routes;
};

const root: Route = {
  path: '/',
  title: 'Catalog',
  element: <Catalog />,
};

const urlComposer: Route = {
  path: '/url-composer',
  title: 'URL Composer',
  element: <URLComposer />,
};

const routes: Routes = {
  [root.path]: root,
  [urlComposer.path]: urlComposer,
};

const useRouting = (): Routing => {
  const { pathname } = useLocation();

  return {
    rootPath: root.path,
    currentRoute: routes[pathname] ?? root,
    routes,
  };
};

export default useRouting;
