import { useDispatch } from "react-redux";
import { logout } from "../../store/userSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  console.log("eliminando localstorage");
  const handleLogout = () => {
    dispatch(logout());
  };

  return <button onClick={handleLogout}>Cerrar sesión</button>;
};

export default LogoutButton;