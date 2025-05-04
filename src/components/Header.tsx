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
      {/* Otros elementos del header */}
      <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <input type="text" name="" id="" placeholder='navbar' />
            <p>notificaciones</p>
            <p>perfil</p>
          </ul>

          
        </div>
    </header>
  );
};

export default Header;