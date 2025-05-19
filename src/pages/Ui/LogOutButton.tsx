import { useDispatch } from "react-redux";
import { logout } from "../../store/userSlice";
import "../../assets/styles/LogOutButtonCSS.css";

const LogoutButton = () => {
  const dispatch = useDispatch();
  
  console.log("Eliminando el localStorage");

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      <span className="icon">🚪</span>
      <span>Cerrar sesión</span>
    </button>
  );
};

export default LogoutButton;