import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Loader from './common/Loader';

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
        <Route element={<DefaultLayout />}>
          {/* La ruta index ahora renderiza HomePage */}
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