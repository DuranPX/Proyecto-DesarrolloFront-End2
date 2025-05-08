import React from 'react';
import ModelCrudComponent from '../../hooks/ModelCRUD';
import { BaseModel } from '../../hooks/ModelCRUD';
import {
    getAllModel as getAllMotocicletas,
    getModelById as getMotocicletaById,
    createModel as createMotocicleta,
    updateModel as updateMotocicleta,
    deleteModel as deleteMotocicleta,
} from '../../services/modelsService';

interface Motocicleta extends BaseModel {
    id: number;
    license_plate: string;
    brand: string;
    year: number;
    status: string;
    created_at: string;
}

const Api_Url_Motocicletas = "http://127.0.0.1:5000/motorcycles";

const MotocicletaComponent: React.FC = () => {
    const motocicletaFields = [
        { label: 'license plate', key: 'license_plate' as keyof Motocicleta },
        { label: 'brand', key: 'brand' as keyof Motocicleta },
        { label: 'year', key: 'year' as keyof Motocicleta, type: 'number' },
        { label: 'status', key: 'status' as keyof Motocicleta },
        { label: 'created at:', key: 'created_at' as keyof Motocicleta}
    ];

    return (
        <ModelCrudComponent<Motocicleta>
            apiUrl={Api_Url_Motocicletas}
            modelNameSingular="motocicleta"
            modelNamePlural="motocicletas"
            modelFields={motocicletaFields}
            fetchData={getAllMotocicletas}
            fetchSingleData={getMotocicletaById}
            createData={createMotocicleta}
            updateData={updateMotocicleta}
            deleteData={deleteMotocicleta}
        />
    );
};

export default MotocicletaComponent;