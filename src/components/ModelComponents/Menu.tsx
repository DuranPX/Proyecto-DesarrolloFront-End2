import React from 'react';
import ModelCrudComponent from '../../hooks/ModelCRUD';
import { BaseModel } from '../../hooks/ModelCRUD';
import {
    getAllModel as getAllMenus,
    getModelById as getMenuById,
    createModel as createMenu,
    updateModel as updateMenu,
    deleteModel as deleteMenu,
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

interface Menu extends BaseModel{
  availability: boolean;
  created_at: string;
  id: number;
  price: number;
  product: Product;
  product_id: number;
  restaurant: Restaurant;
  restaurant_id: number;
}

const Api_Url_Menus="http://127.0.0.1:5000/menus";
const MenusComponent: React.FC = () => {

    const menuFields = [
        { label: 'Restaurante', key: 'restaurant.name' as keyof Menu },
        { label: 'Producto/s', key: 'product.name' as keyof Menu },
        { label: 'Precio', key: 'price' as keyof Menu, type: 'number' },
        { label: 'Disponible', key: 'availability' as keyof Menu, type: 'boolean'},
        { label: 'Creado el', key: 'created_at' as keyof Menu}
    ];

    return (
        <ModelCrudComponent<Menu>
            apiUrl={Api_Url_Menus}
            modelNameSingular="Menu"
            modelNamePlural="Menus"
            modelFields={menuFields}
            fetchData={getAllMenus}
            fetchSingleData={getMenuById}
            createData={createMenu}
            updateData={updateMenu}
            deleteData={deleteMenu}
        />
    );
};

export default MenusComponent;