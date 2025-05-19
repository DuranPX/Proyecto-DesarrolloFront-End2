import React from 'react';
import ModelCrudComponent from '../../hooks/ModelCRUD';
import { BaseModel } from '../../hooks/ModelCRUD';

import {
    getAllModel as getAllDrivers,
    getModelById as getDriverById,
    createModel as createDriver,
    updateModel as updateDriver,
    deleteModel as deleteDriver
} from '../../services/modelsService';

 export interface Driver extends BaseModel {
    id: number; 
    name: string;
    license_number: string;
    phone: string;
    email: string;
    status: string;
    created_at: string;

}

const Api_Url_Drives = "http://127.0.0.1:5000/drivers"

const DriverComponent: React.FC = () => {
    const driverFields = [
        {label: 'Nombre', key: 'name' as keyof Driver},
        {label: 'Numero de licencia', key: 'license_number' as keyof Driver},
        {label: 'Telefono', key: 'phone' as keyof Driver},
        {label: 'Email', key: 'email' as keyof Driver},
        {label: 'Estado', key: 'status' as keyof Driver},
        {label: 'Creado el', key: 'created_at' as keyof Driver}
    ];

    return (
        <ModelCrudComponent<Driver>
            apiUrl={Api_Url_Drives}
            modelNameSingular="driver"
            modelNamePlural="drivers"
            modelFields={driverFields}
            fetchData={getAllDrivers}
            fetchSingleData={getDriverById}
            createData={createDriver}
            updateData={updateDriver}
            deleteData={deleteDriver}
            auxData=''
        />
    );
};

export default DriverComponent;
