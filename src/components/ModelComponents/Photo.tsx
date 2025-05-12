import React from "react";
import ModelCrudComponent from "../../hooks/ModelCRUD";
import { BaseModel } from "../../hooks/ModelCRUD";

import {
    getAllModel as getAllPhotos,
    getModelById as getPhotoById,
    createModel as createPhoto,
    updateModel as updatePhoto,
    deleteModel as deletePhoto,
} from '../../services/modelsService';

export interface Photo extends BaseModel {
    id: number;
    issue_id: number;
    image_url: string;
    caption: string;
    taken_at: Date;
    created_at: Date;
}

const Api_Url_Photos = "http://127.0.0.1:5000/fotos";
const PhotoComponent: React.FC = () => {
    const photoFields = [
        { label: 'ID', key: 'id' as keyof Photo },
        { label: 'ID del pedido', key: 'issue_id' as keyof Photo },
        { label: 'URL de la imagen', key: 'image_url' as keyof Photo },
        { label: 'Descripción', key: 'caption' as keyof Photo },
        { label: 'Fecha de captura', key: 'taken_at' as keyof Photo },
        { label: 'Creado el', key: 'created_at' as keyof Photo }
    ];

    return (
        <ModelCrudComponent<Photo>
            apiUrl={Api_Url_Photos}
            modelNameSingular="Foto"
            modelNamePlural="Fotos"
            modelFields={photoFields}
            fetchData={getAllPhotos}
            fetchSingleData={getPhotoById}
            createData={createPhoto}
            updateData={updatePhoto}
            deleteData={deletePhoto}
        />
    );
};

export default PhotoComponent;