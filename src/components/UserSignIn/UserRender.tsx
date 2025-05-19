import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { setUser } from "../../store/userSlice";
import Swal from 'sweetalert2'; 
import { createCustomerOnLogin } from '../../services/CustomerService';

interface EditFieldProps {
  fieldName: string;
  initialValue: string;
  onSave: (newValue: string | null) => void;
}

const EditField: React.FC<EditFieldProps> = ({ fieldName, initialValue, onSave }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#F6F0F0] rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2 text-[#111111]">Editar {fieldName}</h3>
        <input
          type="text"
          className="border rounded w-full p-2 mb-3 text-[#111111]"
          placeholder={`Nuevo ${fieldName}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded" onClick={() => onSave(null)}>Cancelar</button>
          <button className="bg-[#F2DC2A] hover:bg-[#e6c500] text-[#111111] font-semibold py-2 px-4 rounded" onClick={() => onSave(value)}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

const UserInfo = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const [editingField, setEditingField] = useState<string | null>(null);
  const creatingCustomer = useRef(false);

  useEffect(() => {
    if (
      user &&
      !user.id && // Solo si aún no tiene id
      user.name &&
      user.email &&
      user.phone &&
      !creatingCustomer.current // Evita doble ejecución
    ) {
      creatingCustomer.current = true;
      dispatch(createCustomerOnLogin(user)).finally(() => {
        creatingCustomer.current = false;
      });
    }
  }, [user, dispatch]);

  const handleEditClick = (fieldName: string) => {
    setEditingField(fieldName);
  };

  const handleSave = async (fieldName: string, newValue: string | null) => {
    setEditingField(null);
    if (newValue !== null && user) {
      const updatedUser = {
        ...user,
        [fieldName]: fieldName === "phone" ? Number(newValue) : newValue
      };

      // ✅ Actualiza el store (y localStorage)
      dispatch(setUser(updatedUser));

      // ✅ Notifica con SweetAlert
      await Swal.fire({
        icon: 'success',
        title: 'Dato actualizado',
        text: `${fieldName[0].toUpperCase() + fieldName.slice(1)} actualizado correctamente.`,
        confirmButtonColor: '#F2DC2A'
      });
    }
  };

  if (!user) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Importante!</strong>
      <span className="block sm:inline"> No has iniciado sesión.</span>
    </div>
  );

  const requiredFields = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Teléfono' }
  ];

  return (
    <div className="bg-[#F6F0F0] rounded-lg shadow-xl p-6 flex flex-col items-center space-y-6">
      <div className="flex items-center space-x-5 w-full">
        <div className="relative">
          <img
            src={user.picture || "/default-profile.png"}
            alt="Foto de perfil"
            className="rounded-full w-20 h-20 object-cover border-2 border-[#111111]"
          />
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#F6F0F0]"></span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#111111]">{user.name || "Sin nombre"}</h2>
          <span className="text-[#B70000] text-sm block mt-2">Proveedor: {user.provider || "Desconocido"}</span>
          <p className="text-[#111111] mt-1"><strong>ID de usuario:</strong> {user.id ? user.id : <span className="italic text-gray-500">No asignado</span>}</p>
        </div>
      </div>
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-2 text-[#111111]">Datos de usuario</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requiredFields.map(field => (
            <div key={field.key}>
              <strong className="text-[#B70000]">{field.label}:</strong>
              {user[field.key as keyof typeof user] ? (
                <span className="text-[#111111] ml-2">{user[field.key as keyof typeof user]}</span>
              ) : (
                <button
                  onClick={() => handleEditClick(field.key)}
                  className="ml-2 text-[#F2DC2A] underline text-sm"
                >
                  Agregar {field.label}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Renderiza el campo de edición si está activo */}
      {editingField && (
        <EditField
          fieldName={
            editingField === "name" ? "Nombre" :
              editingField === "email" ? "Email" :
                editingField === "phone" ? "Teléfono" : "Dirección"
          }
          initialValue={editingField && user[editingField as keyof typeof user] !== undefined
            ? String(user[editingField as keyof typeof user] ?? '')
            : ''}
          onSave={(newValue) => handleSave(editingField, newValue)}
        />
      )}
    </div>
  );
};

export default UserInfo;