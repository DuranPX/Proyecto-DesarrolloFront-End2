// restaurante.tsx
import React, { useState, useEffect } from 'react';
import {
    getAllModel,
    getModelById,
    createModel,
    updateModel,
    deleteModel
} from '../../services/modelsService';

interface Restaurante {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    created_at: string;
}
const Api_Url = "http://127.0.0.1:5000/restaurants";

const RestauranteComponent: React.FC = () => {
    const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    let crear, actualizar, borrar, id = false;


    useEffect(() => {

        const GETRestaurantes = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAllModel(Api_Url);
                setRestaurantes(data);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }

        };
        
        const GETrestauranteById = async (id: number) => {
            setLoading(true);
            setError(null);
            try {
                const data = await getModelById(Api_Url, id);
                return data;

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        const POSTRestaurante = async (formData: Restaurante) => {
            setLoading(true);
            setError(null);
            try {
                const newRestaurantData = await createModel(Api_Url, formData); // Llama a tu función de servicio genérica
                // Aquí podrías actualizar el estado 'restaurantes' para mostrar el nuevo restaurante en la lista
                setRestaurantes(prevRestaurantes => [...prevRestaurantes, newRestaurantData]);
                // Mostrar un mensaje de éxito al usuario
                console.log('Restaurante creado exitosamente:', newRestaurantData);
            } catch (err: any) {
                setError(err.message || 'Error al crear restaurante');
                // Mostrar un mensaje de error al usuario
            } finally {
                setLoading(false);
            }
        };

        GETRestaurantes();
    }, []);
    
    const BotonCrearRestaurante = (e: React.FormEvent) => {
        e.preventDefault();
        // Recoge los valores del formulario (esto es solo un ejemplo, adaptalo a tu formulario real)
        const id = restaurantes[restaurantes.length - 1].id;
        const name = (e.target.elements.namedItem('name') as HTMLInputElement).value;
        const address = (e.target.elements.namedItem('address') as HTMLInputElement).value;
        const phone = (e.target.elements.namedItem('phone') as HTMLInputElement).value;
        const email = (e.target.elements.namedItem('email') as HTMLInputElement).value;


        const newRestaurantData: Restaurante = {
            id,
            name,
            address,
            phone,
            email
        };
        POSTRestaurante(newRestaurantData)
    }

    if (loading) {
        return <div>Cargando restaurantes...</div>;
    }

    if (error) {
        return <div>Error al cargar los restaurantes: {error}</div>;
    }

    return (
        <>
            {crear ? (
                <div>
                    <h1>Formulario de Creación de Restaurante</h1>
                    {/* Aquí irían los campos del formulario para crear un restaurante */}
                    {/* Formulario para crear un nuevo restaurante (esto es solo un ejemplo) */}
                    <form onSubmit={BotonCrearRestaurante()}>
                        <div>
                            <label htmlFor="name">Nombre:</label>
                            <input type="text" id="name" name="name" required />
                        </div>
                        <div>
                            <label htmlFor="address">Dirección:</label>
                            <input type="text" id="address" name="address" required />
                        </div>
                        <div>
                            <label htmlFor="phone">Teléfono:</label>
                            <input type="text" id="phone" name="phone" required />
                        </div>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Creando...' : 'Crear Restaurante'}
                        </button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </form>
                </div>
            ) : actualizar ? (
                <div>
                    <h1>Formulario de Actualización de Restaurante</h1>
                    {/* Aquí irían los campos del formulario para actualizar un restaurante */}
                </div>
            ) : borrar ? (
                <div>
                    <h1>Confirmación de Borrado de Restaurante</h1>
                    {/* Aquí irían los botones de confirmación de borrado */}
                </div>
            ): id ?(
                <div> </div>
            ) : (
                // Este es el caso por defecto si ninguna de las variables (crear, actualizar, borrar) es true
                <div>
                    <h1>Lista de Restaurantes</h1>
                    <ul>
                        {restaurantes.map(restaurante => (
                            <li key={restaurante.id}>
                                {restaurante.name} - {restaurante.address} - {restaurante.phone} - {restaurante.email} - {restaurante.created_at}
                            </li>
                        ))}
                    </ul>
                    {/* Aquí podrían ir los botones para activar los modos crear, actualizar o borrar */}
                </div>
            )}
        </>
    );
}

export default RestauranteComponent;