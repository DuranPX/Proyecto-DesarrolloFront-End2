import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-gray-200 transition-transform duration-300 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } z-20`}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Menú</h2>
        <ul>
          <li>
            <Link to="/dashboard/section1" onClick={() => setSidebarOpen(false)} className="block py-2 text-gray-700 hover:bg-gray-300">
              Sección 1
            </Link>
          </li>
          <li>
            <Link to="/dashboard/section2" onClick={() => setSidebarOpen(false)} className="block py-2 text-gray-700 hover:bg-gray-300">
              Sección 2
            </Link>
          </li>
          <li>
            <Link to="/dashboard/section3" onClick={() => setSidebarOpen(false)} className="block py-2 text-gray-700 hover:bg-gray-300">
              Sección 3
            </Link>
          </li>
          {/* Agrega más enlaces según tus subdivisiones */}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;