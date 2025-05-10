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

interface Driver extends BaseModel {
    id: number; 
    name: string;
    lince_number: string;
    phone: string;
    email: string;
    status: string;
    created_at: string;

}

const Api_Url_Drives = "http://127.0.0.1:5000/drivers"