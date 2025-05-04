import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Loader from './common/Loader';
import routes from './routes/rutas'; // Importa tu array de rutas

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
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <Suspense fallback={<Loader />}>
                <route.component />
              </Suspense>
            }
          />
        ))}
        {/* Puedes mantener esta ruta si HomePage sigue siendo la página de inicio dentro del DefaultLayout */}
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={
            <Suspense fallback={<Loader />}>
              <HomePage />
            </Suspense>
          } />
        </Route>
      </Routes>
    </>
  );
}

export default App;