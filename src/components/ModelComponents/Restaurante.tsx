import React from 'react';
import ModelCrudComponent from '../../hooks/ModelCRUD';
import { BaseModel } from '../../hooks/ModelCRUD';
import {
    getAllModel as getAllRestaurantes,
    getModelById as getRestauranteById,
    createModel as createRestaurante,
    updateModel as updateRestaurante,
    deleteModel as deleteRestaurante,
} from '../../services/modelsService';

export interface Restaurante extends BaseModel {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    created_at: string;
}

const Api_Url_Restaurantes = "http://127.0.0.1:5000/restaurants";

const RestauranteComponent: React.FC = () => {
    const RestauranteFields = [
        { label: 'Nombre', key: 'name' as keyof Restaurante },
        { label: 'Direccion', key: 'address' as keyof Restaurante },
        { label: 'Telefono', key: 'phone' as keyof Restaurante, type: 'number' },
        { label: 'email', key: 'email' as keyof Restaurante },
        { label: 'Creado el', key: 'created_at' as keyof Restaurante}
    ];

    return (
        <ModelCrudComponent<Restaurante>
            apiUrl={Api_Url_Restaurantes}
            modelNameSingular="Restaurante"
            modelNamePlural="Restaurantes"
            modelFields={RestauranteFields}
            fetchData={getAllRestaurantes}
            fetchSingleData={getRestauranteById}
            createData={createRestaurante}
            updateData={updateRestaurante}
            deleteData={deleteRestaurante}
            redirectUrlBuilder={(item) => `/restaurants/${item.id}/menus`}
            auxData={null}
        />
    );
};

export default RestauranteComponent;