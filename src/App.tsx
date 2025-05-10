import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Loader from './common/Loader';
import routes from './routes/rutas'; 
import SignIn from './pages/Authentication/SignIn';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));
const HomePage = lazy(() => import('./pages/Dashboard/homePage')); // Importa HomePage

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />
      
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          {routes.map((routes, index) => {
            const { path, component: Component } = routes;
            return (
              <Route
                key={index}
                path={path}
                element={
                  <Suspense fallback={<Loader />}>
                    <Component/>
                  </Suspense>
                }
              />
            );
          })}
        </Route>
      </Routes>
    </>
  );
}

export default App;