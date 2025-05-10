import React from 'react';
import ModelCrudComponent from '../../hooks/ModelCRUD';
import { BaseModel } from '../../hooks/ModelCRUD';
import { Motocicleta } from './Motorcycle.tsx';   
import {
    getAllModel as getAllShifts,
    getModelById as getShiftById,
    createModel as createShift,
    updateModel as updateShift,
    deleteModel as deleteShift,
} from '../../services/modelsService';

  