import {lazy} from "react";

const restaurante = lazy(() => import("../components/ModelComponents/Restaurante"));
const motorcycles = lazy(() => import("../components/ModelComponents/Motorcycle"));
const Menu = lazy(() => import("../components/ModelComponents/Menu"));
const Customers = lazy(() => import("../components/ModelComponents/Customer"));
const ListaOrder = lazy(() => import("../components/ModelComponents/Order"));
const Adress = lazy(() => import("../components/ModelComponents/Adress"));
const Issue = lazy(() => import("../components/ModelComponents/Issue"));
const Photo = lazy(() => import("../components/ModelComponents/Photo"));
const Driver = lazy(() => import("../components/ModelComponents/Driver"));
const Product = lazy(() => import("../components/ModelComponents/Product"));
const Turno = lazy(() => import("../components/ModelComponents/Shift"));
const HomePage = lazy(() => import('../pages/Dashboard/homePage'));
const Profile = lazy(() => import("../components/UserSignIn/UserRender"));
const MapTracker = lazy(() => import("../components/MapTracker"));


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
      component: MapTracker,
    }
  //restaurante Ruta
  ,
    {
      path: '/restaurants/:restaurant_id/menus',
      title: 'MenuById',
      component: Menu,
    }

  //restaurantes Ruta
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
  // Menus Ruta  
  ,
    {
      path: "/Menus",
      title: "Menus",
      component: Menu,
    }
  ,

    //Drives ruta
    {
      path: "/Conductores",
      title: "Conductores",
      component: Driver,
    }

  // Pedidos Ruta  
  ,
    {
      path: "/Pedidos",
      title: "Pedidos",
      component: ListaOrder,
    }
  // Pedidos Ruta  
  ,
    {
      path: "/pedidos/:menu_id/menu",
      title: "Pedidos",
      component: ListaOrder,
    }
  // Clientes Ruta
  ,
    {
      path: "/Clientes",
      title: "Clientes",
      component: Customers,
    }
  // Direcciones Ruta
  ,
    {
      path: "/Direcciones",
      title: "Direcciones",
      component: Adress,
    }
  ,
  // Fotos Ruta  
    {
      path: "/Fotos",
      title: "Fotos",
      component: Photo,
    }
  ,
  // Asuntos Ruta
    {
      path: "/Inconveniente",
      title: "Inconveniente",
      component: Issue,
    }
  ,
  // Productos Ruta
    {
      path: "/Productos",
      title: "Productos",
      component: Product,
    }
  ,
  // Productos Ruta
    {
      path: "/turnos",
      title: "Productos",
      component: Turno,
    }
  ,
  // Perfil Ruta
    {
      path: "/perfil",
      title: "Perfil",
      component: Profile,
    }
];

const routes = [...coreRoutes];
export default routes;