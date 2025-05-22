import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ModelCrudComponent from '../../hooks/ModelCRUD';
import { BaseModel } from '../../hooks/ModelCRUD';
import {
  getAllModel as getAllMenus,
  getModelById as getMenuById,
  createModel as createMenu,
  updateModel as updateMenu,
  deleteModel as deleteMenu,
  getModel_OfModelById,
  getAllModel // Usar para productos y restaurantes
} from '../../services/modelsService';

interface Product {
  category: string;
  created_at: string;
  description: string;
  id: number;
  name: string;
  price: number;
}

interface Restaurant {
  address: string;
  created_at: string;
  email: string;
  id: number;
  name: string;
  phone: string;
}

export interface Menu extends BaseModel {
  availability: boolean;
  created_at: string;
  id: number;
  price: number;
  product: Product;
  product_id: number;
  restaurant: Restaurant;
  restaurant_id: number;
}

const API_BASE_URL = "http://127.0.0.1:5000";

const MenusComponent: React.FC = () => {
  const { restaurant_id } = useParams<{ restaurant_id?: string }>();

  // Estados para productos y restaurantes
  const [productos, setProductos] = useState<{ id: number; name: string }[]>([]);
  const [restaurantes, setRestaurantes] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    // Obtener productos
    getAllModel(`${API_BASE_URL}/products`).then(setProductos);
    // Obtener restaurantes
    getAllModel(`${API_BASE_URL}/restaurants`).then(setRestaurantes);
  }, []);

  const menuFields = [
    { label: 'Producto', key: 'product.name' as keyof Menu },
    { label: "", key:'Haz click aqui para agregar el menu al carrito' },
    { label: 'Restaurante', key: 'restaurant.name' as keyof Menu },
    { label: 'Precio', key: 'price' as keyof Menu, type: 'number' },
    { label: 'Disponible', key: 'availability' as keyof Menu, type: 'boolean' },
    { label: 'Creado el', key: 'created_at' as keyof Menu }
  ];

  const fetchMenus = () => {
    if (restaurant_id) {
      return getModel_OfModelById(API_BASE_URL, "restaurants", Number(restaurant_id), "menus");
    } else {
      return getAllMenus(`${API_BASE_URL}/menus`);
    }
  };

  return (
    <ModelCrudComponent<Menu>
      apiUrl={`${API_BASE_URL}/menus`}
      modelNameSingular="Menu"
      modelNamePlural="Menus"
      modelFields={menuFields}
      fetchData={fetchMenus}
      fetchSingleData={getMenuById}
      createData={createMenu}
      updateData={updateMenu}
      deleteData={deleteMenu}
      auxData={String(restaurant_id)}
      productos={productos}
      restaurantes={restaurantes}
      redirectUrlBuilder={(item) => `/pedidos/${item.id}/menu`}
    />
  );
};

export default MenusComponent;
