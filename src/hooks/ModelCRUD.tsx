import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import '../assets/styles/ModelCRUD.css';

export interface BaseModel {
    id: number;
    [key: string]: any;
}

interface ModelCrudProps<T extends BaseModel> {
    apiUrl: string;
    modelNameSingular: string;
    modelNamePlural: string;
    modelFields: { label: string; key: keyof T; type?: string }[];
    fetchData: (apiUrl: string) => Promise<T[]>;
    fetchSingleData: (apiUrl: string, id: number) => Promise<T | undefined>;
    createData: (apiUrl: string, data: Omit<T, 'id'>) => Promise<T>;
    updateData: (apiUrl: string, id: number, data: Omit<T, 'id'>) => Promise<T>;
    deleteData: (apiUrl: string, id: number) => Promise<void>;
    redirectUrlBuilder?: (item: T) => string;
    auxData: string | null;
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
    redirectUrlBuilder,
    auxData
}: ModelCrudProps<T>) => {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [crear, setCrear] = useState(false);
    const [actualizarId, setActualizarId] = useState<number | null>(null);
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
            console.log(items);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getValueByPath = (obj: any, path: string): any => {
        return path.split('.').reduce((o, k) => (o && typeof o === 'object' && k in o) ? o[k] : undefined, obj);
    };

    const handleCreate = async () => {
        setLoading(true);
        setError(null);
        try {
            const dataToSend = { ...formData, restaurant_id: auxData };
            console.log("Form Data a Enviar:", dataToSend);
            const result = await createData(apiUrl, dataToSend);

            // separamos la respuesta del backend (201)
            const newItem = Array.isArray(result) ? result[0] : result;

            setItems(prevItems => [...prevItems, newItem]);

            Swal.fire('¡Creado!', `${modelNameSingular} creado exitosamente.`, 'success');
            setCrear(false);
            setFormData({} as Omit<T, 'id'>);
        } catch (err: any) {
            setError(err.message);
            Swal.fire('¡Error!', err.message || `Error al crear ${modelNameSingular}`, 'error');
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
            setItems(prevItems => prevItems.map(item => item.id === actualizarId ? updatedItem : item));
            Swal.fire('¡Actualizado!', `${modelNameSingular} actualizado exitosamente.`, 'success');
            setActualizarId(null);
            setFormData({} as Omit<T, 'id'>);
        } catch (err: any) {
            setError(err.message);
            Swal.fire('¡Error!', err.message || `Error al actualizar ${modelNameSingular}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (idToDelete: number) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar este ${modelNameSingular}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, eliminar!',
            cancelButtonText: 'Cancelar'
        });
        if (result.isConfirmed) {
            setLoading(true);
            setError(null);
            try {
                await deleteData(apiUrl, idToDelete);
                setItems(prevItems => prevItems.filter(item => item.id !== idToDelete));
                Swal.fire('¡Eliminado!', `${modelNameSingular} eliminado exitosamente.`, 'success');
            } catch (err: any) {
                setError(err.message);
                Swal.fire('¡Error!', err.message || `Error al eliminar ${modelNameSingular}`, 'error');
            } finally {
                setLoading(false);
            }
        }
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
                Swal.fire({ icon: 'success', title: `${modelNameSingular} Encontrado`, html: htmlContent });
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
        const { name, value, type } = e.target;
        const target = e.target as HTMLInputElement;

        const newValue = type === 'checkbox' ? target.checked : value;
        setFormData(prev => {
            const updatedFormData = { ...prev, [name]: newValue };
            console.log("Valor del Checkbox:", target.checked);
            console.log("Nuevo Form Data:", updatedFormData);
            return updatedFormData;
        });
    };

    return (
        <>
            {loading && <div>Cargando Restaurantes...</div>}
            {error && <div style={{ color: 'red' }}>Error al cargar Restaurantes: {error}</div>}
            <div className="model-crud-container">
                <h1>{modelNamePlural}</h1>

                <div className="actions">
                    <input
                        type="number"
                        placeholder={`Buscar ${modelNameSingular} por ID`}
                        value={searchId}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearchId(value === '' ? '' : Number(value));
                        }}
                    />
                    <button onClick={handleSearchById} disabled={loading}>Buscar</button>
                    <button onClick={() => setCrear(true)}>Crear {modelNameSingular}</button>
                </div>

                {crear && (
                    <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                        <h2>Crear {modelNameSingular}</h2>
                        {modelFields.map(field => (
                            field.label && (
                                <div key={String(field.key)}>
                                    <label htmlFor={String(field.key)}>{field.label}:</label>
                                    {field.type === 'boolean' ? (
                                        <input
                                            type="checkbox"
                                            id={String(field.key)}
                                            name={String(field.key)}
                                            onChange={handleInputChange}
                                            checked={formData[String(field.key)] || false}
                                        />
                                    ) : String(field.key) === 'restaurant_id' ? (
                                        <input
                                            type="hidden"
                                            name="restaurant_id"
                                            value={auxData || ''} // Asegúrate de que auxData tenga el valor correcto
                                        />
                                    ) : (
                                        <input
                                            type={field.type || 'text'}
                                            id={String(field.key)}
                                            name={String(field.key)}
                                            onChange={handleInputChange}
                                            required={!field.type || field.type !== 'email'}
                                            // ¡Elimina o condiciona la propiedad disabled para otros campos si es necesario!
                                            disabled={String(field.key).includes('.')}
                                            defaultValue={formData[String(field.key)] || ''} // Usa formData para otros valores iniciales
                                        />
                                    )}
                                </div>
                            )
                        ))}

                        <button type="submit" disabled={loading}>Crear</button>
                        <button type="button" onClick={() => setCrear(false)}>Cancelar</button>
                    </form>
                )}

                {actualizarId !== null && (
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                        <h2>Actualizar {modelNameSingular}</h2>
                        {items.filter(item => item.id === actualizarId).map(item => (
                            <div key={item.id}>
                                {modelFields.map(field => (
                                    field.label && (
                                        <div key={String(field.key)}>
                                            <label htmlFor={String(field.key)}>{field.label}:</label>
                                            {field.type === 'boolean' ? (
                                                <input
                                                    type="checkbox"
                                                    id={String(field.key)}
                                                    name={String(field.key)}
                                                    onChange={handleInputChange}
                                                    checked={formData[String(field.key)] !== undefined ? formData[String(field.key)] : getValueByPath(item, String(field.key))}
                                                />
                                            ) : (
                                                <input
                                                    type={field.type || 'text'}
                                                    id={String(field.key)}
                                                    name={String(field.key)}
                                                    onChange={handleInputChange}
                                                    defaultValue={getValueByPath(item, String(field.key))}
                                                />
                                            )}
                                        </div>
                                    )
                                ))}
                            </div>
                        ))}
                        <button type="submit" disabled={loading}>Actualizar</button>
                        <button type="button" onClick={() => setActualizarId(null)}>Cancelar</button>
                    </form>
                )}

                <div className="card-grid">
                    {items.map(item => {
                        const nameField = modelFields[0]; // Se asume que el primer campo es el nombre
                        const ContextField = modelFields[1];
                        console.log(ContextField) // se asume que el segundo es la indicacion por si hace click en el modelo
                        const redirectUrl = redirectUrlBuilder
                            ? redirectUrlBuilder(item)
                            : '/';
                        return (
                            <Link
                                to={redirectUrl}
                                key={item.id}
                                className="model-card"
                            >
                                <div className="card-front">
                                    {String(getValueByPath(item, String(nameField.key)))}
                                    <div className="card-contextClick">
                                        {String(ContextField.key)}
                                    </div>
                                </div>
                                <div className="card-hover">
                                    {modelFields.map((field, index) => (
                                        field.label && (
                                            <div key={`${item.id}-${String(field.key)}-${index}`}>
                                                <strong>{field.label}:</strong> {String(getValueByPath(item, String(field.key)))}
                                            </div>
                                        )
                                    ))}
                                    <button
                                        key={`update-${item.id}`} // Agregar clave única a los botones
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setActualizarId(item.id);
                                        }}
                                    >
                                        Actualizar
                                    </button>
                                    <button
                                        key={`delete-${item.id}`} // Agregar clave única a los botones
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            handleDelete(item.id);
                                        }}
                                    >
                                        Borrar
                                    </button>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default ModelCrudComponent;