import React from 'react';
import { Link } from 'react-router-dom';
import logoLarge from "../assets/images/Logo-Large-Devlivery.png";
import DropdownUser from './DropdownUser';
import Navbar from './Navbar';
interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="bg-[#0f0f0f] border-b border-[#b70000] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Botón para abrir/cerrar sidebar */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="text-white hover:text-[#b70000] focus:outline-none p-2"
        aria-label="Abrir menú lateral"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Logo */}
      <Link to="/" className="flex items-center justify-center">
        <img
          src={logoLarge}
          alt="Logo de la página"
          className="h-10 w-auto object-contain"
        />
      </Link>

      {/* Zona derecha */}
      <div className="flex items-center space-x-4">
        {/* Input de búsqueda */}
        <div className="hidden sm:block">
          <input
            type="text"
            placeholder="Buscar..."
            className="px-3 py-1 rounded-lg bg-[#1a1a1a] border border-[#333] text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b70000]"
          />
        </div>

        {/* Iconos de mensajes y notificaciones */}
        <Navbar></Navbar>

        {/* Dropdown de usuario */}
        <DropdownUser />
      </div>
    </header>
  );
};

export default Header;
