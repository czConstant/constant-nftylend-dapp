import { Routes, Route } from 'react-router-dom';
import Layout from 'src/common/components/layout';
import PageNotFound from 'src/apps/pawn/pages/notFound';

import routes from './routes';

const renderRoute = (Component: any) => {
  return (
    <Layout>
      <Component />
    </Layout>
  );
}

const AppRouter = () => (
  <Routes>
    <Route path='*' element={renderRoute(PageNotFound)} />
    {routes.map(route => {
      const { path, component } = route;
      return <Route key={path} path={path} element={renderRoute(component)} />
    })}
    
  </Routes>
);

export default AppRouter;