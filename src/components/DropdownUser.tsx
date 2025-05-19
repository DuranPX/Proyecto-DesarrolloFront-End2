import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../pages/Ui/LogOutButton';
import UserOne from '../assets/images/peli.jpg';
import "../assets/styles/DropdownUserCSS.css";

import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const trigger = useRef<HTMLDivElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current || !trigger.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      ) {
        return;
      }
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [dropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return user ? (
    <div className="dropdown-container">
      <div className="popup">
        <div 
          ref={trigger}
          tabIndex={0}
          className="burger profile-trigger"
          onClick={toggleDropdown}
          onKeyDown={(e) => e.key === 'Enter' && toggleDropdown()}
        >
          {user.picture ? (
            <img className="profileImage" src={user.picture} alt="User" />
          ) : (
            <img className="profileImage" src={UserOne} alt="Peli" />
          )}
        </div>
        
        <div
          ref={dropdown}
          className={`popup-window ${dropdownOpen ? 'active' : ''}`}
        >
          <div className="dropdown-title">Mi Cuenta</div>
          <ul>
            <li>
              <Link to="/perfil" className="dropdown-link">
                <span className="icon">👤</span>
                <span>Mi Perfil</span>
              </Link>
            </li>
            <li>
              <LogoutButton />
            </li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="auth-links">
      <Link to="/signin" className="auth-link">
        <button>
          <span className="icon">🔑</span>
          <span>Iniciar Sesión</span>
        </button>
      </Link>
    </div>
  );
};

export default DropdownUser;