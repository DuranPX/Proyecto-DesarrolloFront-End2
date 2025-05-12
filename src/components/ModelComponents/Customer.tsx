import React from 'react';
import ModelCrudComponent from '../../hooks/ModelCRUD';
import { BaseModel } from '../../hooks/ModelCRUD';
import {
    getAllModel as getAllCustomers,
    getModelById as getCustomerById,
    createModel as createCustomer,
    updateModel as updateCustomer,
    deleteModel as deleteCustomer,
} from '../../services/modelsService';

export interface Customer extends BaseModel {
    created_at: string;
    id: number;
    name: string;
    email: string;
    phone: string;
}

const Api_Url_Customers = "http://127.0.0.1:5000/customers";

const CustomerComponent: React.FC = () => {
    const customerFields = [
        { label: 'Nombre', key: 'name' as keyof Customer },
        { label: 'Correo', key: 'email' as keyof Customer },
        { label: 'Teléfono', key: 'phone' as keyof Customer },
        { label: 'Creado el', key: 'created_at' as keyof Customer}
    ];

    return (
        <ModelCrudComponent<Customer>
            apiUrl={Api_Url_Customers}
            modelNameSingular="cliente"
            modelNamePlural="clientes"
            modelFields={customerFields}
            fetchData={getAllCustomers}
            fetchSingleData={getCustomerById}
            createData={createCustomer}
            updateData={updateCustomer}
            deleteData={deleteCustomer}
        />
    );
};

export default CustomerComponent;