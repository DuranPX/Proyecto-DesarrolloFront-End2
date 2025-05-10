import React from 'react';
import ModelCrudComponent from '../../hooks/ModelCRUD';
import { BaseModel } from '../../hooks/ModelCRUD';
import { Customer } from './Customer.tsx';
import { Motocicleta } from './Motorcycle.tsx';
import { Adress } from './Adress.tsx';
import { Menu } from './Menu.tsx';
import {
    getAllModel as getAllOrders,
    getModelById as getOrderById,
    createModel as createOrder,
    updateModel as updateOrder,
    deleteModel as deleteOrder,
} from '../../services/modelsService';

export interface Order extends BaseModel {
    created_at: string;
    id: number;
    customer_id: number;
    menu_id: number;
    motorcycle_id: number;
    quantity: number;
    total_price: number;
    status: string;
    address: Adress;
    customer: Customer;
    menu: Menu;
    motorcycle: Motocicleta;
}

const Api_Url_Orders = "http://127.0.0.1:5000/orders";

const OrderComponent: React.FC = () => {
    const orderFields = [
        { label: 'Cliente', key: 'customer.name' as keyof Order },
        { label: 'Restaurante', key: 'menu.restaurant.name' as keyof Order },
        { label: 'Producto/s', key: 'menu.product.name' as keyof Order },
        { label: 'Precio', key: 'total_price' as keyof Order, type: 'number' },
        { label: 'Disponible', key: 'status' as keyof Order },
        { label: 'Creado el', key: 'created_at' as keyof Order}
    ];

    return (
        <ModelCrudComponent<Order>
            apiUrl={Api_Url_Orders}
            modelNameSingular="pedido"
            modelNamePlural="pedidos"
            modelFields={orderFields}
            fetchData={getAllOrders}
            fetchSingleData={getOrderById}
            createData={createOrder}
            updateData={updateOrder}
            deleteData={deleteOrder}
        />
    );
};

export default OrderComponent;