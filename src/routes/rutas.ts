import {lazy} from "react";
const restaurante = lazy(() => import("../components/ModelComponents/Restaurante"));
const motorcycles = lazy(() => import("../components/ModelComponents/Motorcycle"));
const HomePage = lazy(() => import('../pages/Dashboard/homePage'));

const coreRoutes = [
  // HomePage Ruta
  {
    path: "/",
    title:"Dashboard",
    component: HomePage,
  },
  // Mapa Ruta
    {
      path: '/Visualizar-Mapa',
      title: 'Mapa',
      component: restaurante,
    }
  //restaurante Ruta
  ,
    {
      path: '/restaurantes',
      title: 'Restaurantes',
      component: restaurante,
    }
  // motorsaicles ruta
  ,
    {
      path: '/Motocicletas',
      title: 'Motocicletas',
      component: motorcycles,
    }
];

const routes = [...coreRoutes];
export default routes;