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

export interface Motocicleta extends BaseModel {
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
        { label: 'Licencia', key: 'license_plate' as keyof Motocicleta },
        { label: 'Marca', key: 'brand' as keyof Motocicleta },
        { label: 'Año', key: 'year' as keyof Motocicleta, type: 'number' },
        { label: 'Estado', key: 'status' as keyof Motocicleta },
        { label: 'Creado el', key: 'created_at' as keyof Motocicleta}
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