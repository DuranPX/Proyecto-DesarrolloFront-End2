import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store.ts'; // Asegúrate de que esta ruta sea correcta
import {
    getAllModel as getAllOrders,
    createModel as createOrder,
    deleteModel as deleteOrder,
    updateModel as updateOrder
} from '../../services/modelsService';
import { BaseModel } from '../../hooks/ModelCRUD';
import { Customer } from './Customer.tsx';
import { Motocicleta } from './Motorcycle.tsx';
import { Adress } from './Adress.tsx';
import { Menu } from './Menu.tsx';

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
    const [orders, setOrders] = useState<Order[]>([]);
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
    const [editedQuantity, setEditedQuantity] = useState<number>(1);

    const { menu_id } = useParams();
    const navigate = useNavigate();
    const orderCreated = useRef(false);

    const user = useSelector((state: RootState) => state.user);

    useEffect(() => {
    const fetchOrders = async () => {
        const data = await getAllOrders(Api_Url_Orders);
        // Filtra solo las órdenes del usuario actual
        if (user && user.id) {
            setOrders(data.filter((order: Order) => order.customer_id === user.id));
        } else {
            setOrders([]);
        }
    };

    const createOrderIfNeeded = async () => {
        if (menu_id && user && !orderCreated.current) {
            const id = parseInt(menu_id);
            if (!isNaN(id)) {
                orderCreated.current = true;
                await createOrder(Api_Url_Orders, {
                    customer_id: user.id,
                    menu_id: id,
                    motorcycle_id: 1,
                    quantity: 1,
                    total_price: 1000,
                    status: 'pending',
                });
                navigate('/pedidos');
            }
        } else {
            fetchOrders();
        }
    };

    createOrderIfNeeded();
}, [menu_id, navigate, user]);

    const handleDelete = async (id: number) => {
        await deleteOrder(Api_Url_Orders, id);
        setOrders(prev => prev.filter(order => order.id !== id));
    };

    const handleEditClick = (order: Order) => {
        setEditingOrderId(order.id);
        setEditedQuantity(order.quantity);
    };

    const handleUpdate = async (order: Order) => {
        const updated = {
            ...order,
            quantity: editedQuantity,
            total_price: order.menu?.price ? order.menu.price * editedQuantity : order.total_price,
        };
        await updateOrder(Api_Url_Orders, updated.id, updated);
        setOrders(prev => prev.map(o => (o.id === updated.id ? updated : o)));
        setEditingOrderId(null);
    };

    const mostrarCarrito = () => {
        console.log(orders);
    };

    return (
        <div className="min-h-screen flex flex-col items-center py-20">
            <div className="shopping-cart p-6 border rounded w-full max-w-md bg-white shadow">
                <div className="header flex items-center gap-2 mb-4">
                    <i className="fas fa-shopping-cart text-xl"></i>
                    <span className="font-bold">Carrito ({orders.length})</span>
                </div>

                <ul className="cart-items space-y-2">
                    {orders.length === 0 ? (
                        <li className="text-gray-500">El carrito está vacío</li>
                    ) : (
                        orders.map((order) => (
                            <li key={order.id} className="flex flex-col border-b pb-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{order.menu?.product?.name ?? 'Producto'}</span>
                                    <div className="flex gap-2">
                                        {editingOrderId === order.id ? (
                                            <>
                                                <input
                                                    type="number"
                                                    value={editedQuantity}
                                                    onChange={(e) => setEditedQuantity(Number(e.target.value))}
                                                    className="w-16 px-1 border rounded text-sm"
                                                    min={1}
                                                />
                                                <button
                                                    onClick={() => handleUpdate(order)}
                                                    className="text-sm text-green-600 hover:underline"
                                                >
                                                    Guardar
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleEditClick(order)}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                Editar
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(order.id)}
                                            className="text-sm text-red-600 hover:underline"
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    Cantidad: {order.quantity} | Total: ${order.total_price.toFixed(2)}
                                </div>
                            </li>
                        ))
                    )}
                </ul>

                <Link
                    to="/menus"
                    className="mt-4 block text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Agregar producto
                </Link>
                <button
                    onClick={() => mostrarCarrito()}
                    className="mt-2 block w-full text-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Realizar Pedido
                </button>
            </div>
        </div>
    );
};

export default OrderComponent;
