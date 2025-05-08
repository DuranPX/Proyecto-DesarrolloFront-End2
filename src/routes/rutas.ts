import {lazy} from "react";
 
const SignIn = lazy(() => import('../pages/Authentication/LogIn'));
const restaurante = lazy(() => import("../components/ModelComponents/Restaurante"));
const motorcycles = lazy(() => import("../components/ModelComponents/Motorcycle"));

const coreRoutes = [
  //Autenticacion
    {
      path: '/SignIn',
      title: 'SignIn',
      component: SignIn,
    },
    {
      path: '/SignUp',
      title: 'SignUp',
      component: SignIn,
    },
    {
      path: '/SignOut',
      title: 'SignOut',
      component: SignIn,
    },
    {
      path: '/Visualizar-Mapa',
      title: 'Mapa',
      component: SignIn,
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