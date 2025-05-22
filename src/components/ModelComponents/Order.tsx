import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store.ts';
import {
    getAllModel as getAllOrders,
    createModel as createOrder,
    createModel as createAdress,
    deleteModel as deleteOrder,
    updateModel as updateOrder
} from '../../services/modelsService';
import { BaseModel } from '../../hooks/ModelCRUD';
import { Customer } from './Customer.tsx';
import { Motocicleta } from './Motorcycle.tsx';
import { Adress } from './Adress.tsx';
import { Menu } from './Menu.tsx';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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
const Api_Url_Adresses = "http://127.0.0.1:5000/addresses";
const Api_Url_Menus = "http://127.0.0.1:5000/menus";

const MySwal = withReactContent(Swal);

const OrderComponent: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
    const [editedQuantity, setEditedQuantity] = useState<number>(1);
    const [menuPreview, setMenuPreview] = useState<any | null>(null);

    const { menu_id } = useParams();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user);

    // Cargar pedidos existentes del usuario
    const fetchOrders = async () => {
        const data = await getAllOrders(Api_Url_Orders);
        if (user && user.id) {
            setOrders(data.filter((order: Order) => order.customer_id === user.id));
            console.log("Pedidos del usuario:", data.filter((order: Order) => order.customer_id === user.id));
        } else {
            setOrders([]);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user]);

    // Si hay menu_id en la ruta, busca el menú y lo muestra como preliminar
    useEffect(() => {
        const fetchMenu = async () => {
            if (menu_id) {
                const res = await fetch(`${Api_Url_Menus}/${menu_id}`);
                if (res.ok) {
                    const menu = await res.json();
                    setMenuPreview({
                        id: Number(menu_id),
                        menu_id: Number(menu_id),
                        menu: menu,
                        quantity: 1,
                        total_price: menu.price,
                    });
                }
            } else {
                setMenuPreview(null);
            }
        };
        fetchMenu();
    }, [menu_id]);

    const handleDelete = async (id: number) => {
        await deleteOrder(Api_Url_Orders, id);
        console.log("Orden eliminada:", id);
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

    // Solicita la dirección y la asocia a la orden
    const solicitarDireccion = async (orderId: number) => {
        if (!user || !user.id) {
            Swal.fire('Error', 'Usuario no autenticado', 'error');
            return;
        }
        // 1. Obtén direcciones guardadas del usuario
        const res = await fetch(`http://127.0.0.1:5000/addresses?customer_id=${user.id}`);
        console.log("Direcciones del usuario:", res);
        const direcciones = await res.json();
        console.log("Direcciones:", direcciones);

        // 2. Construye las opciones para el select
        const options = direcciones.length
            ? direcciones.map((dir: any) =>
                `<option value="${dir.id}">${dir.street}, ${dir.city}</option>`
            ).join('') + `<option value="nueva">Ingresar nueva dirección</option>`
            : `<option value="nueva">Ingresar nueva dirección</option>`;

        // 3. Muestra el Swal con el select y los inputs
        const { value: formValues } = await MySwal.fire({
            title: 'Selecciona o ingresa tu dirección',
            html:
                `<select id="swal-address-select" class="swal2-input">${options}</select>` +
                `<div id="swal-new-address-fields" style="display:none">
                    <input id="swal-street" class="swal2-input" placeholder="Calle" />
                    <input id="swal-city" class="swal2-input" placeholder="Ciudad" />
                    <input id="swal-state" class="swal2-input" placeholder="Departamento" />
                    <input id="swal-postal" class="swal2-input" placeholder="Código Postal" />
                    <input id="swal-info" class="swal2-input" placeholder="Información adicional" />
                </div>`,
            didOpen: () => {
                const select = document.getElementById('swal-address-select') as HTMLSelectElement;
                const newFields = document.getElementById('swal-new-address-fields') as HTMLDivElement;
                if (select && newFields) {
                    // Mostrar/ocultar según la opción seleccionada al abrir
                    newFields.style.display = select.value === 'nueva' ? '' : 'none';
                    select.addEventListener('change', () => {
                        newFields.style.display = select.value === 'nueva' ? '' : 'none';
                    });
                }
            },
            preConfirm: () => {
                const select = document.getElementById('swal-address-select') as HTMLSelectElement;
                if (select.value === 'nueva') {
                    return {
                        nueva: true,
                        street: (document.getElementById('swal-street') as HTMLInputElement).value,
                        city: (document.getElementById('swal-city') as HTMLInputElement).value,
                        state: (document.getElementById('swal-state') as HTMLInputElement).value,
                        postal_code: (document.getElementById('swal-postal') as HTMLInputElement).value,
                        additional_info: (document.getElementById('swal-info') as HTMLInputElement).value,
                    };
                } else {
                    return { nueva: false, address_id: Number(select.value) }; // <-- aquí el cambio
                }
            }
        });

        // 4. Usa la dirección seleccionada o crea una nueva
        if (formValues) {
            if (formValues.nueva) {
                // Crea la nueva dirección y la asocia a la orden
                const addressPayload = {
                    order_id: orderId,
                    street: formValues.street,
                    city: formValues.city,
                    state: formValues.state,
                    postal_code: formValues.postal_code,
                    additional_info: formValues.additional_info,
                };
                await createAdress(Api_Url_Adresses, addressPayload);
            } else {
                const selectedAddressId = formValues.address_id;
                // Obtener la orden actual y actualizar el campo
                const orderRes = await fetch(`${Api_Url_Orders}/${orderId}`);
                const currentOrder = await orderRes.json();
                currentOrder.address = selectedAddressId;
                console.log("Actualizando orden con dirección:", currentOrder);
                console.log("ID de la addres:", selectedAddressId);
                await updateOrder(Api_Url_Orders, orderId, currentOrder);
            }
            await fetchOrders();
            Swal.fire('¡Dirección guardada y pedido realizado!', '', 'success');
            navigate('/pedidos');
        }
    };

    // Al hacer click en "Realizar Pedido"
    const handleRealizarPedido = async () => {
        if (user && user.id && menuPreview) {
            const orderPayload = {
                customer_id: user.id,
                menu_id: menuPreview.menu_id,
                motorcycle_id: 1,
                quantity: menuPreview.quantity,
                total_price: menuPreview.menu.price * menuPreview.quantity,
                status: 'pending',
            };
            console.log("Creando orden:", orderPayload);
            const newOrder = await createOrder(Api_Url_Orders, orderPayload);
            const orderObj = Array.isArray(newOrder) ? newOrder[0] : (newOrder?.data ?? newOrder);

            if (orderObj && orderObj.id) {
                console.log("Orden creada:", orderObj);
                console.log("ID de la orden:", orderObj.id);
                await solicitarDireccion(orderObj.id);
            } else {
                Swal.fire('Error', 'No se pudo crear la orden', 'error');
            }
        } else {
            if (!user || !user.id) {
                Swal.fire('Error', 'Usuario no autenticado', 'error');
                navigate('/signin');
            } else {
                Swal.fire('Error', 'No hay menú seleccionado', 'error');
            }
        }
    };

    // Permite editar la cantidad del menú preliminar
    const handleEditMenuPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (menuPreview && value > 0) {
            setMenuPreview({
                ...menuPreview,
                quantity: value,
                total_price: menuPreview.menu.price * value,
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center py-20">
            <div className="shopping-cart p-6 border rounded w-full max-w-md bg-white shadow">
                <div className="header flex items-center gap-2 mb-4">
                    <i className="fas fa-shopping-cart text-xl"></i>
                    <span className="font-bold">Pedidos ({orders.length + (menuPreview ? 1 : 0)})</span>
                </div>
                <ul className="cart-items space-y-2">
                    {menuPreview && (
                        <li className="flex flex-col border-b pb-2 bg-green-50">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{menuPreview.menu?.product?.name ?? 'Producto'}</span>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={menuPreview.quantity}
                                        onChange={handleEditMenuPreview}
                                        className="w-16 px-1 border rounded text-sm"
                                        min={1}
                                    />
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">
                                Cantidad: {menuPreview.quantity} | Total: ${menuPreview.total_price.toFixed(2)}
                            </div>
                        </li>
                    )}
                    {orders.length === 0 && !menuPreview ? (
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
                {menuPreview && (
                    <button
                        onClick={handleRealizarPedido}
                        className="mt-2 block w-full text-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Realizar Pedido
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderComponent;