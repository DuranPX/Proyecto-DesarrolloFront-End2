import React, { useEffect, useState } from 'react';
import ModelCrudComponent from '../../hooks/ModelCRUD';
import { BaseModel } from '../../hooks/ModelCRUD';
import { Driver } from './Driver.tsx';
import { Motocicleta } from './Motorcycle.tsx';
import {
    getAllModel as getAllShifts,
    getModelById as getShiftById,
    createModel as createShift,
    updateModel as updateShift,
    deleteModel as deleteShift,
    getAllModel
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
const Api_Url_Drivers = "http://127.0.0.1:5000/drivers";
const Api_Url_Motorcycles = "http://127.0.0.1:5000/motorcycles";

const ShiftComponent: React.FC = () => {
    const [conductores, setConductores] = useState<{ id: number; name: string }[]>([]);
    const [motocicletas, setMotocicletas] = useState<{ id: number; license_plate: string }[]>([]);

    useEffect(() => {
        // Obtener conductores
        getAllModel(Api_Url_Drivers).then(data => {
            setConductores(data.map((d: Driver) => ({ id: d.id, name: d.name })));
        });
        
        // Obtener motocicletas
        getAllModel(Api_Url_Motorcycles).then(data => {
            setMotocicletas(data.map((m: Motocicleta) => ({ id: m.id, license_plate: m.license_plate })));
        });
    }, []);

    const shiftFields = [
        { label: 'Conductor', key: 'driver.name' as keyof Shift },
        { label: 'Motocicleta', key: 'motorcycle.license_plate' as keyof Shift },
        { label: 'Hora de inicio', key: 'start_time' as keyof Shift, type: 'datetime-local' },
        { label: 'Hora de fin', key: 'end_time' as keyof Shift, type: 'datetime-local' },
        { label: 'Estado', key: 'status' as keyof Shift },
        { label: 'Creado el', key: 'created_at' as keyof Shift }
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
            auxData={''}
            conductores={conductores}
            motocicletas={motocicletas}
        />
    );
};

export default ShiftComponent;