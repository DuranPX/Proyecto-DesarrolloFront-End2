import React from 'react';
import ModelCrudComponent from '../../hooks/ModelCRUD';
import { BaseModel } from '../../hooks/ModelCRUD';
import { Motocicleta }  from './Motorcycle.tsx';
import { Photo } from './Photo.tsx';  

import {
    getAllModel as getAllIssues,
    getModelById as getIssueById,
    createModel as createIssue,
    updateModel as updateIssue,
    deleteModel as deleteIssue,
} from '../../services/modelsService';

export interface Issue extends BaseModel {
    id: number;
    motorcycle_id: number;
    description: string;
    issue_type: string;
    date_reported: Date;
    status: string;
    created_at: Date;
    motorcycle: Motocicleta;
    photos: Photo[];
}

const Api_Url_Issues = "http://127.0.0.1:5000/issues";

const IssueComponent: React.FC = () => {
    const issueFields = [
        { label: 'ID', key: 'id' as keyof Issue },
        { label: 'ID de la motocicleta', key: 'motorcycle_id' as keyof Issue },
        { label: 'Descripción', key: 'description' as keyof Issue },
        { label: 'Tipo de problema', key: 'issue_type' as keyof Issue },
        { label: 'Fecha reportada', key: 'date_reported' as keyof Issue },
        { label: 'Estado', key: 'status' as keyof Issue },
        { label: 'Creado el', key: 'created_at' as keyof Issue }
    ];

    return (
        <ModelCrudComponent<Issue>
            apiUrl={Api_Url_Issues}
            modelNameSingular="Problema"
            modelNamePlural="Problemas"
            modelFields={issueFields}
            fetchData={getAllIssues}
            fetchSingleData={getIssueById}
            createData={createIssue}
            updateData={updateIssue}
            deleteData={deleteIssue}
            auxData=""
            
        />
    );
}
export default IssueComponent;  