import React, { useEffect, useState } from 'react';
import {
    getAllModel as getAllDrivers,
    createModel as createDriver,
    updateModel as updateDriver,
    deleteModel as deleteDriver
} from '../../services/modelsService';

export interface Driver {
    id: number; 
    name: string;
    license_number: string;
    phone: string;
    email: string;
    status: string;
    created_at: string;
}

const Api_Url_Drivers = "http://127.0.0.1:5000/drivers";

const DriverComponent: React.FC = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editDriver, setEditDriver] = useState<Driver | null>(null);
    const [form, setForm] = useState<Omit<Driver, "id" | "created_at">>({
        name: "",
        license_number: "",
        phone: "",
        email: "",
        status: ""
    });

    const fetchDrivers = async () => {
        setLoading(true);
        const data = await getAllDrivers(Api_Url_Drivers);
        setDrivers(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreateClick = () => {
        setEditDriver(null);
        setForm({ name: "", license_number: "", phone: "", email: "", status: "" });
        setShowForm(true);
    };

    const handleEditClick = (driver: Driver) => {
        setEditDriver(driver);
        setForm({
            name: driver.name,
            license_number: driver.license_number,
            phone: driver.phone,
            email: driver.email,
            status: driver.status
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("¿Seguro que deseas eliminar este conductor?")) {
            await deleteDriver(Api_Url_Drivers, id);
            fetchDrivers();
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editDriver) {
            await updateDriver(Api_Url_Drivers, editDriver.id, form);
        } else {
            await createDriver(Api_Url_Drivers, form);
        }
        setShowForm(false);
        fetchDrivers();
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditDriver(null);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Conductores</h2>
            <button
                className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleCreateClick}
            >
                Crear nuevo conductor
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
                        <label className="block">Número de licencia:</label>
                        <input
                            className="border px-2 py-1 w-full"
                            name="license_number"
                            value={form.license_number}
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
                            {editDriver ? "Actualizar" : "Crear"}
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
                            <th className="border px-2 py-1">Licencia</th>
                            <th className="border px-2 py-1">Teléfono</th>
                            <th className="border px-2 py-1">Email</th>
                            <th className="border px-2 py-1">Estado</th>
                            <th className="border px-2 py-1">Creado el</th>
                            <th className="border px-2 py-1">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map(d => (
                            <tr key={d.id}>
                                <td className="border px-2 py-1">{d.id}</td>
                                <td className="border px-2 py-1">{d.name}</td>
                                <td className="border px-2 py-1">{d.license_number}</td>
                                <td className="border px-2 py-1">{d.phone}</td>
                                <td className="border px-2 py-1">{d.email}</td>
                                <td className="border px-2 py-1">{d.status}</td>
                                <td className="border px-2 py-1">{d.created_at}</td>
                                <td className="border px-2 py-1 flex gap-2">
                                    <button
                                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={() => handleEditClick(d)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={() => handleDelete(d.id)}
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

export default DriverComponent;
