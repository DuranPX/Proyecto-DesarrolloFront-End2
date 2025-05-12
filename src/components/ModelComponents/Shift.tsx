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

export interface Shift extends BaseModel {
    created_at: string;
    id: number;
    driver_id: number;
    motorcycle_id: number;
    start_time: string;
    end_time: string;
    status: string;
    driver: Driver;
    motorcycle: Motocicleta;
}

const Api_Url_Shifts = "http://127.0.0.1:5000/shifts";

const ShiftComponent: React.FC = () => {
    const shiftFields = [
        { label: 'Conductor', key: 'driver.name' as keyof Shift },
        { label: 'Motocicleta', key: 'motorcycle.brand' as keyof Shift },
        { label: 'Hora de inicio', key: 'start_time' as keyof Shift },
        { label: 'Hora de fin', key: 'end_time' as keyof Shift },
        { label: 'Estado', key: 'status' as keyof Shift },
        { label: 'Creado el', key: 'created_at' as keyof Shift}
    ];

    return (
        <ModelCrudComponent<Shift>
            apiUrl={Api_Url_Shifts}
            modelNameSingular="turno"
            modelNamePlural="turnos"
            modelFields={shiftFields}
            fetchData={getAllShifts}
            fetchSingleData={getShiftById}
            createData={createShift}
            updateData={updateShift}
            deleteData={deleteShift}
        />
    );
};

export default ShiftComponent;  