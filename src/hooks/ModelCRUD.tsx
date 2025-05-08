import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

// Define una interfaz genérica para tus modelos
export interface BaseModel {
    id: number;
    [key: string]: any; // Permite otras propiedades dinámicamente
}

// Define una interfaz para las props del componente genérico
interface ModelCrudProps<T extends BaseModel> {
    apiUrl: string;
    modelNameSingular: string; // 'restaurante', 'motocicleta', 'conductor'
    modelNamePlural: string;   // 'restaurantes', 'motocicletas', 'conductores'
    modelFields: { label: string; key: keyof T; type?: string }[]; // Definición de los campos para el formulario
    fetchData: (apiUrl: string) => Promise<T[]>;
    fetchSingleData: (apiUrl: string, id: number) => Promise<T | undefined>;
    createData: (apiUrl: string, data: Omit<T, 'id'>) => Promise<T>;
    updateData: (apiUrl: string, id: number, data: Omit<T, 'id'>) => Promise<T>;
    deleteData: (apiUrl: string, id: number) => Promise<void>;
}

const ModelCrudComponent = <T extends BaseModel,>({
    apiUrl,
    modelNameSingular,
    modelNamePlural,
    modelFields,
    fetchData,
    fetchSingleData,
    createData,
    updateData,
    deleteData,
}: ModelCrudProps<T>) => {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [crear, setCrear] = useState(false);
    const [actualizarId, setActualizarId] = useState<number | null>(null);
    const [borrarId, setBorrarId] = useState<number | null>(null);
    const [searchId, setSearchId] = useState<number | ''>('');
    const [formData, setFormData] = useState<Omit<T, 'id'>>({} as Omit<T, 'id'>);

    useEffect(() => {
        fetchItems();
    }, [apiUrl]);

    const fetchItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchData(apiUrl);
            setItems(data);
            console.log(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        setLoading(true);
        setError(null);
        try {
            const newItem = await createData(apiUrl, formData);
            setItems(prevItems => [...prevItems, newItem]);
            Swal.fire('¡Creado!', `${modelNameSingular} creado exitosamente.`, 'success');
            setCrear(false);
            setFormData({} as Omit<T, 'id'>);
        } catch (err: any) {
            setError(err.message || `Error al crear ${modelNameSingular}`);
            Swal.fire('¡Error!', error || undefined, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (actualizarId === null) return;
        setLoading(true);
        setError(null);
        try {
            const updatedItem = await updateData(apiUrl, actualizarId, formData);
            setItems(prevItems =>
                prevItems.map(item => (item.id === actualizarId ? updatedItem : item))
            );
            Swal.fire('¡Actualizado!', `${modelNameSingular} actualizado exitosamente.`, 'success');
            setActualizarId(null);
            setFormData({} as Omit<T, 'id'>);
        } catch (err: any) {
            setError(err.message || `Error al actualizar ${modelNameSingular}`);
            Swal.fire('¡Error!', error || undefined, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (idToDelete: number) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar este ${modelNameSingular}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                setError(null);
                try {
                    await deleteData(apiUrl, idToDelete);
                    setItems(prevItems => prevItems.filter(item => item.id !== idToDelete));
                    Swal.fire('¡Eliminado!', `${modelNameSingular} eliminado exitosamente.`, 'success');
                    setBorrarId(null);
                } catch (err: any) {
                    setError(err.message || `Error al eliminar ${modelNameSingular}`);
                    Swal.fire('¡Error!', error || undefined, 'error');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const handleSearchById = async () => {
        if (!searchId) {
            Swal.fire({ icon: 'warning', title: '¡Advertencia!', text: `Por favor, ingresa un ID para buscar ${modelNameSingular}.` });
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const item = await fetchSingleData(apiUrl, Number(searchId));
            setLoading(false);
            if (item) {
                const htmlContent = Object.entries(item)
                    .filter(([key]) => key !== 'id')
                    .map(([key, value]) => `<strong>${key}:</strong> ${value}<br/>`)
                    .join('');
                Swal.fire({ icon: 'success', title: `¡${modelNameSingular} Encontrado!`, html: htmlContent });
            } else {
                Swal.fire({ icon: 'error', title: '¡No Encontrado!', text: `No se encontró ningún ${modelNameSingular} con el ID: ${searchId}.` });
            }
        } catch (err: any) {
            setLoading(false);
            setError(err.message);
            Swal.fire({ icon: 'error', title: '¡Error!', text: `Hubo un error al buscar el ${modelNameSingular}: ${err.message}` });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    };

    return (
        <>
            {loading && <div>Cargando {modelNamePlural}...</div>}
            {error && <div style={{ color: 'red' }}>Error al cargar {modelNamePlural}: {error}</div>}

            <h1>Lista de {modelNamePlural}</h1>

            <div>
                <input
                    type="number"
                    placeholder={`Buscar ${modelNameSingular} por ID`}
                    value={searchId}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^[0-9]+$/.test(value)) {
                            setSearchId(value === '' ? '' : Number(value));
                        }
                    }}
                />
                <button onClick={handleSearchById} disabled={loading}>Buscar</button>
            </div>

            <button onClick={() => setCrear(true)}>Crear {modelNameSingular} +</button>

            {crear && (
                <div>
                    <h2>Crear {modelNameSingular}</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                        {modelFields.map(field => (
                            <div key={String(field.key)}> {/* Cast to string for 'key' */}
                                <label htmlFor={String(field.key)}>{field.label}:</label> {/* Cast to string for 'htmlFor' */}
                                <input
                                    type={field.type || 'text'}
                                    id={String(field.key)}
                                    name={String(field.key)}
                                    onChange={handleInputChange}
                                    required={!field.type || field.type !== 'email'}
                                />
                            </div>
                        ))}
                        <button type="submit" disabled={loading}>Crear</button>
                        <button onClick={() => setCrear(false)}>Cancelar</button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </form>
                </div>
            )}

            {actualizarId !== null && (
                <div>
                    <h2>Actualizar {modelNameSingular}</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        {modelFields.map(field => (
                            <div key={String(field.key)}> {/* Cast to string for 'key' */}
                                <label htmlFor={String(field.key)}>{field.label}:</label> {/* Cast to string for 'htmlFor' */}
                                <input
                                    type={field.type || 'text'}
                                    id={String(field.key)}
                                    name={String(field.key)}
                                    onChange={handleInputChange}
                                    required={!field.type || field.type !== 'email'}
                                />
                            </div>
                        ))}
                        <button type="submit" disabled={loading}>Actualizar</button>
                        <button onClick={() => setActualizarId(null)}>Cancelar</button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </form>
                </div>
            )}

            {borrarId !== null && (
                <div>
                    <h2>Confirmar Borrado</h2>
                    <p>¿Estás seguro de que deseas eliminar este {modelNameSingular} con ID: {borrarId}?</p>
                    <button onClick={() => handleDelete(borrarId)} disabled={loading}>Eliminar</button>
                    <button onClick={() => setBorrarId(null)}>Cancelar</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            )}

            <h2>Lista de {modelNamePlural}</h2>
            {items.map(item => (
                <div key={item.id}>
                    <ul>
                        {modelFields.map(field => (
                            <li key={`${String(item.id)}-${String(field.key)}`}>
                                <strong>{field.label}:</strong> {item[field.key]}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setActualizarId(item.id)}>Actualizar</button>
                    <button onClick={() => setBorrarId(item.id)}>Borrar</button>
                </div>
            ))}
        </>
    );
};

export default ModelCrudComponent;