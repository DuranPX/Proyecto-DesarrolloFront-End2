import React, { useEffect, useState } from 'react';
import {
    getAllModel as getAllMotocicletas,
    createModel as createMotocicleta,
    updateModel as updateMotocicleta,
    deleteModel as deleteMotocicleta,
} from '../../services/modelsService';

export interface Motocicleta {
    id: number;
    license_plate: string;
    brand: string;
    year: number;
    status: string;
    created_at: string;
}

const Api_Url_Motocicletas = "http://127.0.0.1:5000/motorcycles";

const MotocicletaComponent: React.FC = () => {
    const [motocicletas, setMotocicletas] = useState<Motocicleta[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editMotocicleta, setEditMotocicleta] = useState<Motocicleta | null>(null);
    const [form, setForm] = useState<Omit<Motocicleta, "id" | "created_at">>({
        license_plate: "",
        brand: "",
        year: new Date().getFullYear(),
        status: ""
    });

    const fetchMotocicletas = async () => {
        setLoading(true);
        const data = await getAllMotocicletas(Api_Url_Motocicletas);
        setMotocicletas(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchMotocicletas();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreateClick = () => {
        setEditMotocicleta(null);
        setForm({ license_plate: "", brand: "", year: new Date().getFullYear(), status: "" });
        setShowForm(true);
    };

    const handleEditClick = (motocicleta: Motocicleta) => {
        setEditMotocicleta(motocicleta);
        setForm({
            license_plate: motocicleta.license_plate,
            brand: motocicleta.brand,
            year: motocicleta.year,
            status: motocicleta.status
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("¿Seguro que deseas eliminar esta motocicleta?")) {
            await deleteMotocicleta(Api_Url_Motocicletas, id);
            fetchMotocicletas();
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editMotocicleta) {
            await updateMotocicleta(Api_Url_Motocicletas, editMotocicleta.id, form);
        } else {
            await createMotocicleta(Api_Url_Motocicletas, form);
        }
        setShowForm(false);
        fetchMotocicletas();
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditMotocicleta(null);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Motocicletas</h2>
            <button
                className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleCreateClick}
            >
                Crear nueva motocicleta
            </button>
            {showForm && (
                <form className="mb-4 p-4 border rounded bg-gray-50" onSubmit={handleFormSubmit}>
                    <div className="mb-2">
                        <label className="block">Licencia:</label>
                        <input
                            className="border px-2 py-1 w-full"
                            name="license_plate"
                            value={form.license_plate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block">Marca:</label>
                        <input
                            className="border px-2 py-1 w-full"
                            name="brand"
                            value={form.brand}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block">Año:</label>
                        <input
                            className="border px-2 py-1 w-full"
                            name="year"
                            type="number"
                            value={form.year}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block">Estado:</label>
                        <input
                            className="border px-2 py-1 w-full"
                            name="status"
                            value={form.status}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {editMotocicleta ? "Actualizar" : "Crear"}
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
                            <th className="border px-2 py-1">Licencia</th>
                            <th className="border px-2 py-1">Marca</th>
                            <th className="border px-2 py-1">Año</th>
                            <th className="border px-2 py-1">Estado</th>
                            <th className="border px-2 py-1">Creado el</th>
                            <th className="border px-2 py-1">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {motocicletas.map(m => (
                            <tr key={m.id}>
                                <td className="border px-2 py-1">{m.id}</td>
                                <td className="border px-2 py-1">{m.license_plate}</td>
                                <td className="border px-2 py-1">{m.brand}</td>
                                <td className="border px-2 py-1">{m.year}</td>
                                <td className="border px-2 py-1">{m.status}</td>
                                <td className="border px-2 py-1">{m.created_at}</td>
                                <td className="border px-2 py-1 flex gap-2">
                                    <button
                                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={() => handleEditClick(m)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={() => handleDelete(m.id)}
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

export default MotocicletaComponent;