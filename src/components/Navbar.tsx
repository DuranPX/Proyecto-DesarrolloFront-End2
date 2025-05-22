import { useEffect, useState } from "react";
import {
    Notification,
    notificationService,
    NotificationType
} from "../services/notificationService";
import "../assets/styles/NavbarCSS.css";

const Navbar = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [expandedNotification, setExpandedNotification] = useState<Notification | null>(null);

    useEffect(() => {
        const handler = (notif: Notification) => {
            console.log('Nueva notificación:', notif);
            setNotifications(prev => [notif, ...prev]);
            setUnreadCount(prev => prev + 1);
        };


        notificationService.subscribe(handler);

        return () => {
            notificationService.unsubscribe(); // <-- Usa la referencia del handler
        };
    }, []);

    const markAsRead = (notificationId: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => {
            const target = notifications.find(n => n.id === notificationId);
            return target?.read ? prev : Math.max(0, prev - 1);
        });
    };

    const markAllAsRead = () => {
        const unread = notifications.filter(n => !n.read).length;
        if (unread === 0) return;

        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case 'new_order': return '🛒';
            case 'order_cancelled': return '❌';
            case 'motorcycle_issue': return '⚠️';
            case 'motorcycle_moved': return '🏍️';
            default: return '🔔';
        }
    };

    return (
        <nav className="relative">
            {/* Botón principal de notificaciones */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown de notificaciones */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
                    {/* Encabezado */}
                    <div className="p-3 border-b flex justify-between items-center bg-gray-50">
                        <h3 className="font-semibold text-gray-800">Notificaciones</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Marcar todas
                                </button>
                            )}
                            <button
                                onClick={() => setShowDropdown(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Lista de notificaciones */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">No hay notificaciones</div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
                                >
                                    {/* Resumen de notificación */}
                                    <div
                                        className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => setExpandedNotification(
                                            expandedNotification?.id === notification.id ? null : notification
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl mt-1">
                                                {getNotificationIcon(notification.notificationType)}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className={`font-medium truncate ${!notification.read ? 'text-blue-800' : 'text-gray-800'
                                                    }`}>
                                                    {notification.title}
                                                </div>
                                                <div className="text-sm text-gray-600 truncate">
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {new Date(notification.timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setNotifications(prev => prev.filter(n => n.id !== notification.id));
                                                    setUnreadCount(prev => notification.read ? prev : prev - 1);
                                                }}
                                                className="text-gray-400 hover:text-red-500 ml-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Detalles expandidos */}
                                    {expandedNotification?.id === notification.id && (
                                        <div className="px-4 pb-3 pt-1 bg-white border-t">
                                            <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                                                <div className="col-span-1 font-semibold text-gray-500">Tipo:</div>
                                                <div className="col-span-2 capitalize">
                                                    {notification.notificationType.replace('_', ' ')}
                                                </div>

                                                <div className="col-span-1 font-semibold text-gray-500">Estado:</div>
                                                <div className="col-span-2">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${notification.read
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {notification.read ? 'Leída' : 'No leída'}
                                                    </span>
                                                </div>

                                                <>
                                                    {notification.notificationType === 'new_order' && (
                                                        <>
                                                            {notification.relatedData.customer?.name && (
                                                                <div>
                                                                    <strong>Cliente:</strong> {notification.relatedData.customer.name}
                                                                </div>
                                                            )}
                                                            {notification.relatedData.menu?.restaurant?.name && (
                                                                <div>
                                                                    <strong>Restaurante:</strong> {notification.relatedData.menu.restaurant.name}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                    {notification.notificationType === 'order_cancelled' && (
                                                        <>
                                                            {notification.relatedData.reason && (
                                                                <div>
                                                                    <strong>Razón:</strong> {notification.relatedData.reason}
                                                                </div>
                                                            )}
                                                            {notification.relatedData.orderId && (
                                                                <div>
                                                                    <strong>ID de orden:</strong> {notification.relatedData.orderId}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                    {notification.notificationType === 'motorcycle_moved' && (
                                                        <>
                                                            <div>
                                                                <strong>Moto:</strong>{' '}
                                                                {notification.relatedData.motorcycle?.plate || notification.relatedData.plate || 'Desconocida'}
                                                            </div>
                                                            {notification.relatedData.position && (
                                                                <div>
                                                                    <strong>Coordenadas:</strong>{' '}
                                                                    <strong>Lat: </strong>{notification.relatedData.position?.lat || 'Desconocida'}{' '}
                                                                    <strong>Lng: </strong>{notification.relatedData.position?.lng || 'Desconocida'}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                    {notification.notificationType === 'motorcycle_issue' && (
                                                        <>
                                                            <div>
                                                                <strong>Moto:</strong>{' '}
                                                                {notification.relatedData.motorcycle?.plate || notification.relatedData.plate || 'Desconocida'}
                                                            </div>
                                                            {notification.relatedData.issue && (
                                                                <div>
                                                                    <strong>Problema:</strong> {notification.relatedData.issue}
                                                                </div>
                                                            )}
                                                            {notification.relatedData.description && (
                                                                <div>
                                                                    <strong>Descripción:</strong> {notification.relatedData.description}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                    {['model_created', 'model_updated', 'model_deleted'].includes(notification.notificationType) && (
                                                        <>
                                                            {notification.relatedData.modelData ? (
                                                                Object.entries(notification.relatedData.modelData).map(([key, value]) => (
                                                                    <div key={key}>
                                                                        <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong> {String(value)}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="text-gray-500">Sin detalles del modelo.</div>
                                                            )}
                                                        </>
                                                    )}
                                                </>


                                            </div>

                                            <div className="flex justify-end gap-2 mt-2">
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="px-3 py-1 text-xs rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200"
                                                >
                                                    {notification.read ? 'Marcar como no leída' : 'Marcar como leída'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setNotifications(prev => prev.filter(n => n.id !== notification.id));
                                                        setUnreadCount(prev => notification.read ? prev : prev - 1);
                                                        setExpandedNotification(null);
                                                    }}
                                                    className="px-3 py-1 text-xs rounded-md bg-red-100 text-red-800 hover:bg-red-200"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;