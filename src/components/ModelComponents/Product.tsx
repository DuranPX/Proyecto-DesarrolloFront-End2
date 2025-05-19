import React from 'react';
import ModelCrudComponent from '../../hooks/ModelCRUD';
import { BaseModel } from '../../hooks/ModelCRUD';

import {
    getAllModel as getAllProducts,
    getModelById as getPruductsById,
    createModel as createProducts,
    updateModel as updateProducts,
    deleteModel as deleteProducts,
} from '../../services/modelsService';

export interface Product extends BaseModel {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    created_at: Date;
}

const Api_Url_Products = "http://127.0.0.1:5000/products";

const ProductComponent: React.FC = () => {
    const productFields = [
        { label: 'Nombre', key: 'name' as keyof Product },
        { label: "", key:''},
        { label: 'ID', key: 'id' as keyof Product },
        { label: 'Descripción', key: 'description' as keyof Product },
        { label: 'Precio', key: 'price' as keyof Product },
        { label: 'Categoría', key: 'category' as keyof Product },
        { label: 'Creado el', key: 'created_at' as keyof Product }
    ];

    return (
        <ModelCrudComponent<Product>
            apiUrl={Api_Url_Products}
            modelNameSingular="Producto"
            modelNamePlural="Productos"
            modelFields={productFields}
            fetchData={getAllProducts}
            fetchSingleData={getPruductsById}
            createData={createProducts}
            updateData={updateProducts}
            deleteData={deleteProducts}
            auxData=""
            redirectUrlBuilder={() => `/productos`}
        />
    );
}
export default ProductComponent;
