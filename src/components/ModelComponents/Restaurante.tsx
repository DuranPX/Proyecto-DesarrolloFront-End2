import React, { useEffect, useState } from 'react';
import {
    getAllModel as getAllRestaurantes,
    createModel as createRestaurante,
    updateModel as updateRestaurante,
    deleteModel as deleteRestaurante,
} from '../../services/modelsService';
import Swal from 'sweetalert2';

export interface Restaurante {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    created_at: string;
}

const Api_Url_Restaurantes = "http://127.0.0.1:5000/restaurants";

const RestauranteComponent: React.FC = () => {
    const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editRestaurante, setEditRestaurante] = useState<Restaurante | null>(null);
    const [form, setForm] = useState<Omit<Restaurante, "id" | "created_at">>({
        name: "",
        address: "",
        phone: "",
        email: ""
    });

    const fetchRestaurantes = async () => {
        setLoading(true);
        const data = await getAllRestaurantes(Api_Url_Restaurantes);
        setRestaurantes(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchRestaurantes();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreateClick = () => {
        setEditRestaurante(null);
        setForm({ name: "", address: "", phone: "", email: "" });
        setShowForm(true);
    };

    const handleEditClick = (restaurante: Restaurante) => {
        setEditRestaurante(restaurante);
        setForm({
            name: restaurante.name,
            address: restaurante.address,
            phone: restaurante.phone,
            email: restaurante.email
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Seguro que deseas eliminar este restaurante?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (result.isConfirmed) {
            await deleteRestaurante(Api_Url_Restaurantes, id);
            await fetchRestaurantes();
            Swal.fire('Eliminado', 'El restaurante ha sido eliminado.', 'success');
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editRestaurante) {
            await updateRestaurante(Api_Url_Restaurantes, editRestaurante.id, form);
        } else {
            await createRestaurante(Api_Url_Restaurantes, form);
        }
        setShowForm(false);
        fetchRestaurantes();
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditRestaurante(null);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Restaurantes</h2>
            <button
                className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleCreateClick}
            >
                Crear nuevo restaurante
            </button>
            {showForm && (
                <form className="mb-4 p-4 border rounded bg-gray-50" onSubmit={handleFormSubmit}>
                    <div className="mb-2">
                        <label className="block">Nombre:</label>
                        <input
                            className="border px-2 py-1 w-full"
                            name="name"
                            value={form.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block">Dirección:</label>
                        <input
                            className="border px-2 py-1 w-full"
                            name="address"
                            value={form.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block">Teléfono:</label>
                        <input
                            className="border px-2 py-1 w-full"
                            name="phone"
                            value={form.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block">Email:</label>
                        <input
                            className="border px-2 py-1 w-full"
                            name="email"
                            value={form.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {editRestaurante ? "Actualizar" : "Crear"}
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
                            <th className="border px-2 py-1">Nombre</th>
                            <th className="border px-2 py-1">Dirección</th>
                            <th className="border px-2 py-1">Teléfono</th>
                            <th className="border px-2 py-1">Email</th>
                            <th className="border px-2 py-1">Creado</th>
                            <th className="border px-2 py-1">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurantes.map(r => (
                            <tr key={r.id}>
                                <td className="border px-2 py-1">{r.id}</td>
                                <td className="border px-2 py-1">{r.name}</td>
                                <td className="border px-2 py-1">{r.address}</td>
                                <td className="border px-2 py-1">{r.phone}</td>
                                <td className="border px-2 py-1">{r.email}</td>
                                <td className="border px-2 py-1">{r.created_at}</td>
                                <td className="border px-2 py-1 flex gap-2">
                                    <button
                                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={() => handleEditClick(r)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={() => handleDelete(r.id)}
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

export default RestauranteComponent;