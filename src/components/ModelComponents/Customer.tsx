import React, { useEffect, useState } from 'react';
import {
    getAllModel as getAllCustomers,
    createModel as createCustomer,
    updateModel as updateCustomer,
    deleteModel as deleteCustomer,
} from '../../services/modelsService';

export interface Customer {
    created_at: string;
    id: number;
    name: string;
    email: string;
    phone: string;
}

const Api_Url_Customers = "http://127.0.0.1:5000/customers";

const CustomerComponent: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
    const [form, setForm] = useState<Omit<Customer, "id" | "created_at">>({
        name: "",
        email: "",
        phone: ""
    });

    const fetchCustomers = async () => {
        setLoading(true);
        const data = await getAllCustomers(Api_Url_Customers);
        setCustomers(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreateClick = () => {
        setEditCustomer(null);
        setForm({ name: "", email: "", phone: "" });
        setShowForm(true);
    };

    const handleEditClick = (customer: Customer) => {
        setEditCustomer(customer);
        setForm({
            name: customer.name,
            email: customer.email,
            phone: customer.phone
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("¿Seguro que deseas eliminar este cliente?")) {
            await deleteCustomer(Api_Url_Customers, id);
            fetchCustomers();
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editCustomer) {
            await updateCustomer(Api_Url_Customers, editCustomer.id, form);
        } else {
            await createCustomer(Api_Url_Customers, form);
        }
        setShowForm(false);
        fetchCustomers();
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditCustomer(null);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Clientes</h2>
            <button
                className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleCreateClick}
            >
                Crear nuevo cliente
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
                        <label className="block">Correo:</label>
                        <input
                            className="border px-2 py-1 w-full"
                            name="email"
                            value={form.email}
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
                    <div className="flex gap-2 mt-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {editCustomer ? "Actualizar" : "Crear"}
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
                            <th className="border px-2 py-1">Correo</th>
                            <th className="border px-2 py-1">Teléfono</th>
                            <th className="border px-2 py-1">Creado el</th>
                            <th className="border px-2 py-1">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(c => (
                            <tr key={c.id}>
                                <td className="border px-2 py-1">{c.id}</td>
                                <td className="border px-2 py-1">{c.name}</td>
                                <td className="border px-2 py-1">{c.email}</td>
                                <td className="border px-2 py-1">{c.phone}</td>
                                <td className="border px-2 py-1">{c.created_at}</td>
                                <td className="border px-2 py-1 flex gap-2">
                                    <button
                                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={() => handleEditClick(c)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={() => handleDelete(c.id)}
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

export default CustomerComponent;