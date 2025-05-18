import React from 'react';
import { useParams } from 'react-router-dom';
import ModelCrudComponent from '../../hooks/ModelCRUD';
import { BaseModel } from '../../hooks/ModelCRUD';
import {
  getAllModel as getAllMenus,
  getModelById as getMenuById,
  createModel as createMenu,
  updateModel as updateMenu,
  deleteModel as deleteMenu,
  getModel_OfModelById
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

  const menuFields = [
    { label: 'Producto/s', key: 'product.name' as keyof Menu },
    { label: "", key:'Haz click aqui para agregar el menu al carrito' },
    { label: 'ID Restaurante', key: 'restaurant_id' as keyof Menu, type: 'number' },
    { label: 'Restaurante', key: 'restaurant.name' as keyof Menu },
    { label: 'ID Producto', key: 'product_id' as keyof Menu, type: 'number' },
    { label: 'Precio', key: 'price' as keyof Menu, type: 'number' },
    { label: 'Disponible', key: 'availability' as keyof Menu, type: 'boolean' },
    { label: 'Creado el', key: 'created_at' as keyof Menu }
  ];

  const fetchMenus = () => {
    if (restaurant_id) {
      // Si se accede desde /restaurants/:restaurant_id/menus
      return getModel_OfModelById(API_BASE_URL, "restaurants", Number(restaurant_id), "menus");
    } else {
      // Si se accede desde /menus
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
      redirectUrlBuilder={(item) => `/pedidos/${item.id}/menu`}
    />
  );
};

export default MenusComponent;
