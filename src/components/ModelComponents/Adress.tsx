import React, { useEffect, useState } from 'react';
import {
    getAllModel as getAllAdresses,
    createModel as createAdress,
    updateModel as updateAdress,
    deleteModel as deleteAdress,
} from '../../services/modelsService';
import Swal from 'sweetalert2';

export interface Adress {
    created_at: string;
    id: number;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    additional_info: string;
}

const Api_Url_Adresses = "http://127.0.0.1:5000/addresses";

const AdressComponent: React.FC = () => {
    const [adresses, setAdresses] = useState<Adress[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editAdress, setEditAdress] = useState<Adress | null>(null);
    const [form, setForm] = useState<Omit<Adress, "id" | "created_at">>({
        street: "",
        city: "",
        state: "",
        postal_code: "",
        additional_info: ""
    });

    const fetchAdresses = async () => {
        setLoading(true);
        const data = await getAllAdresses(Api_Url_Adresses);
        setAdresses(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAdresses();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreateClick = () => {
        setEditAdress(null);
        setForm({ street: "", city: "", state: "", postal_code: "", additional_info: "" });
        setShowForm(true);
    };

    const handleEditClick = (adress: Adress) => {
        setEditAdress(adress);
        setForm({
            street: adress.street,
            city: adress.city,
            state: adress.state,
            postal_code: adress.postal_code,
            additional_info: adress.additional_info
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Seguro que deseas eliminar esta dirección?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (result.isConfirmed) {
            await deleteAdress(Api_Url_Adresses, id);
            await fetchAdresses();
            Swal.fire('Eliminado', 'La dirección ha sido eliminada.', 'success');
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editAdress) {
            await updateAdress(Api_Url_Adresses, editAdress.id, form);
        } else {
            await createAdress(Api_Url_Adresses, form);
        }
        setShowForm(false);
        fetchAdresses();
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditAdress(null);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Direcciones</h2>
            <button
                className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleCreateClick}
            >
                Crear nueva dirección
            </button>
            {showForm && (
                <form className="mb-4 p-4 border rounded bg-gray-50" onSubmit={handleFormSubmit}>
                    <div className="mb-2">
                        <label className="block">Calle:</label>
                        <input
                            className="border px-2 py-1 w-full"
                            name="street"
                            value={form.street}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block">Ciudad:</label>
                        <input
                            className="border px-2 py-1 w-full"
                            name="city"
                            value={form.city}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block">Estado:</label>
                        <input
                            className="border px-2 py-1 w-full"
                            name="state"
                            value={form.state}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block">Código Postal:</label>
                        <input
                            className="border px-2 py-1 w-full"
                            name="postal_code"
                            value={form.postal_code}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block">Información Adicional:</label>
                        <input
                            className="border px-2 py-1 w-full"
                            name="additional_info"
                            value={form.additional_info}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {editAdress ? "Actualizar" : "Crear"}
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            onClick={handleCancel}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
            {loading ? (
                <div>Cargando...</div>
            ) : (
                <table className="min-w-full border">
                    <thead>
                        <tr>
                            <th className="border px-2 py-1">ID</th>
                            <th className="border px-2 py-1">Calle</th>
                            <th className="border px-2 py-1">Ciudad</th>
                            <th className="border px-2 py-1">Estado</th>
                            <th className="border px-2 py-1">Código Postal</th>
                            <th className="border px-2 py-1">Información Adicional</th>
                            <th className="border px-2 py-1">Creado el</th>
                            <th className="border px-2 py-1">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adresses.map(a => (
                            <tr key={a.id}>
                                <td className="border px-2 py-1">{a.id}</td>
                                <td className="border px-2 py-1">{a.street}</td>
                                <td className="border px-2 py-1">{a.city}</td>
                                <td className="border px-2 py-1">{a.state}</td>
                                <td className="border px-2 py-1">{a.postal_code}</td>
                                <td className="border px-2 py-1">{a.additional_info}</td>
                                <td className="border px-2 py-1">{a.created_at}</td>
                                <td className="border px-2 py-1 flex gap-2">
                                    <button
                                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={() => handleEditClick(a)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={() => handleDelete(a.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdressComponent;