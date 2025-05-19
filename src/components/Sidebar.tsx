import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cerrarIcon from "../assets/images/CloseSideBar.png";
import LogoutButton from '../pages/Ui/LogOutButton';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const user = useSelector((state: RootState) => state.user);

    return (
        <aside
            className={`fixed top-0 left-0 h-full w-64 bg-[#0f0f0f] shadow-xl border-r border-[#b70000] transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } z-50`}
        >
            <div className="flex flex-col h-full">
                {/* Header del panel */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-[#b70000] bg-[#0f0f0f]">
                    <h2 className="text-white text-lg font-bold tracking-wide">Panel</h2>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-white p-1 hover:scale-105 transition-transform"
                    >
                        <img src={cerrarIcon} alt="Cerrar menú" className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 text-white">
                    {/* Secciones */}
                    <p className="text-white font-bold text-sm mb-3 uppercase">Secciones</p>
                    <ul className="space-y-2">
                        {[
                            ['Realizar Pedido', '/Pedidos'],
                            ['Menús', '/Menus'],
                            ['Restaurantes', '/restaurantes'],
                            ['Productos', '/productos'],
                            ['Conductores', '/Conductores'],
                            ['Motos', '/Motocicletas'],
                            ['Clientes', '/clientes'],
                        ].map(([label, path]) => (
                            <li key={label}>
                                <Link
                                    to={path}
                                    onClick={() => setSidebarOpen(false)}
                                    className="block px-3 py-2 rounded-lg text-white font-medium hover:bg-[#1a1a1a] transition-colors"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="border-t border-[#b70000] my-5" />

                    {/* Otros */}
                    <p className="text-white font-bold text-sm mb-3 uppercase">Otros</p>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/Analisis-Graficos"
                                onClick={() => setSidebarOpen(false)}
                                className="block px-3 py-2 rounded-lg text-white font-medium hover:bg-[#1a1a1a]"
                            >
                                Análisis Gráficos
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/Visualizar-Mapa"
                                onClick={() => setSidebarOpen(false)}
                                className="block px-3 py-2 rounded-lg text-white font-medium hover:bg-[#1a1a1a]"
                            >
                                Visualizar Mapa
                            </Link>
                        </li>
                        <li>
                            {user ? (
                                <Link
                                    to="/"
                                    onClick={() => setSidebarOpen(false)}
                                    className="block px-3 py-2 rounded-lg text-[#b70000] font-semibold hover:bg-[#1a1a1a]"
                                >
                                    <LogoutButton />
                                </Link>
                            ) : (
                                <Link
                                    to="/signin"
                                    onClick={() => setSidebarOpen(false)}
                                    className="block px-3 py-2 rounded-lg text-white font-semibold hover:bg-[#1a1a1a]"
                                >
                                    Iniciar sesión
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>

    );
};

export default Sidebar;
