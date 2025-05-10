import React from 'react';
import ModelCrudComponent from '../../hooks/ModelCRUD';
import { BaseModel } from '../../hooks/ModelCRUD';
import { Motocicleta }  from './Motorcycle.tsx';
import {
    getAllModel as getAllIssues,
    getModelById as getIssueById,
    createModel as createIssue,
    updateModel as updateIssue,
    deleteModel as deleteIssue,
} from '../../services/modelsService';
