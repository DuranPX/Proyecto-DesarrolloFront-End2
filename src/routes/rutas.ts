import {lazy} from "react";
 
const SignIn = lazy(() => import('../pages/Authentication/LogIn'));

const coreRoutes = [
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
];

const routes = [...coreRoutes];
export default routes;