import {lazy} from "react";
const restaurante = lazy(() => import("../components/ModelComponents/Restaurante"));
const motorcycles = lazy(() => import("../components/ModelComponents/Motorcycle"));
const Menu = lazy(() => import("../components/ModelComponents/Menu"));

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
  // motorcycles ruta
  ,
    {
      path: '/Motocicletas',
      title: 'Motocicletas',
      component: motorcycles,
    }
  ,
    {
      path: "/Menus",
      title: "Menus",
      component: Menu,
    }
];

const routes = [...coreRoutes];
export default routes;