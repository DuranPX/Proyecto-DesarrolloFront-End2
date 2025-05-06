import React from 'react';
import { Link } from 'react-router-dom';
import cerrarIcon from "../assets/images/CloseSideBar.png";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-gray-200 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } z-20`}
    >
      <div className="p-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 focus:outline-none p-2">
          <img src={cerrarIcon} alt="Cerrar menú" className="h-6 w-6 " />
        </button>
        <br />
        <h2 className="text-sm font-semibold mb-4">Secciones</h2>
        <ul>
          <li>
            <Link to="/Realizar_Pedido" onClick={() => setSidebarOpen(false)} className="block py-2 text-gray-700 hover:bg-gray-300">
              Realizar Pedido
            </Link>
          </li>
          <li>
            <Link to="/Menu" onClick={() => setSidebarOpen(false)} className="block py-2 text-gray-700 hover:bg-gray-300">
              Menús
            </Link>
          </li>
          <li>
            <Link to="/restaurantes" onClick={() => setSidebarOpen(false)} className="block py-2 text-gray-700 hover:bg-gray-300">
              Restaurantes
            </Link>
          </li>
          <li>
            <Link to="/Conductores" onClick={() => setSidebarOpen(false)} className="block py-2 text-gray-700 hover:bg-gray-300">
              Conductores
            </Link>
          </li>
          <li>
            <Link to="/Motos" onClick={() => setSidebarOpen(false)} className="block py-2 text-gray-700 hover:bg-gray-300">
              Motos
            </Link>
          </li>
          {/* Agrega más enlaces según tus subdivisiones */}
        </ul>
        <br />
        <h4 className="text-sm font-semibold mb-4">Otros</h4>
        <ul>
          <li>
            <Link to="/Analisis-Graficos" onClick={() => setSidebarOpen(false)} className="block py-2 text-gray-700 hover:bg-gray-300">
              Analisis Graficos
            </Link>
          </li>
          <li>
            <Link to="/Visualizar-Mapa" onClick={() => setSidebarOpen(false)} className="block py-2 text-gray-700 hover:bg-gray-300">
              Visualizar Mapa
            </Link>
          </li>
          <li>
            <Link to="/SignOut" onClick={() => setSidebarOpen(false)} className="block py-2 text-gray-700 hover:bg-gray-300">
              Log out
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;