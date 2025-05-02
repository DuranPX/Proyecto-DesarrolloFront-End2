import React from 'react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="bg-gray-100 p-4 flex justify-between items-center">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-700 focus:outline-none">
        {/* Icono de menú */}
        ☰
      </button>
      <h1 className="text-xl font-semibold">Dashboard</h1>
      {/* Otros elementos del header */}
    </header>
  );
};

export default Header;