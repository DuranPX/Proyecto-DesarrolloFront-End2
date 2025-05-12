import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../pages/Ui/LogOutButton';
import UserOne from '../assets/images/peli.jpg';

import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (user?
  <div>
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="h-12 w-12 rounded-full">
          {user.picture?
            <img className="rounded-full" src={user.picture} alt="User"/>:
            <img src={UserOne} alt="Peli"/>
          }  
        </span>
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
          <li>
            <Link
              to="/perfil"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              Mi Perfil
            </Link>
          </li>
        </ul>
      <LogoutButton></LogoutButton>  
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  </div>:
  <div>
      <Link
        to="/signin" className="block py-2 text-gray-700 hover:bg-gray-300">
                <button>Iniciar sesión</button>
      </Link>
  </div>
  );
};

export default DropdownUser;