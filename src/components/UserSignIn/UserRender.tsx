import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const UserInfo = () => {
  const user = useSelector((state: RootState) => state.user);

  if (!user) return <p>No has iniciado sesión.</p>;

  return (
    <div>
      <img src={user.picture} alt="Foto de perfil" width={60} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <span>Proveedor: {user.provider}</span>
    </div>
  );
};

export default UserInfo;
