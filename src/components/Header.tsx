import React from 'react';
import { Link } from 'react-router-dom';

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
      <Link to='/'  className=''>DEVLIVERY</Link>
      {/* Otros elementos del header */}
      <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <input type="text" name="" id="" placeholder='navbar' />
            <p>DropDown Messages</p>
            <p>Notificaciones</p>
          </ul>
          {/* User Area*/}
          {/* User Area*/} 
      </div>
    </header>
  );
};

export default Header;