import React from 'react';
import ModelCrudComponent from '../../hooks/ModelCRUD';
import { BaseModel } from '../../hooks/ModelCRUD';
import {
    getAllModel as getAllAdresses,
    getModelById as getAdressById,
    createModel as createAdress,
    updateModel as updateAdress,
    deleteModel as deleteAdress,
} from '../../services/modelsService';

export interface Adress extends BaseModel{
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
    const adressFields = [
        { label: 'Calle', key: 'street' as keyof Adress },
        { label: 'Ciudad', key: 'city' as keyof Adress },
        { label: 'Estado', key: 'state' as keyof Adress },
        { label: 'Código Postal', key: 'postal_code' as keyof Adress },
        { label: 'Información Adicional', key: 'additional_info' as keyof Adress },
        { label: 'Creado el', key: 'created_at' as keyof Adress}
    ];

    return (
        <ModelCrudComponent<Adress>
            apiUrl={Api_Url_Adresses}
            modelNameSingular="dirección"
            modelNamePlural="direcciones"
            modelFields={adressFields}
            fetchData={getAllAdresses}
            fetchSingleData={getAdressById}
            createData={createAdress}
            updateData={updateAdress}
            deleteData={deleteAdress}
            auxData=""
            
        />
    );
};

export default AdressComponent;