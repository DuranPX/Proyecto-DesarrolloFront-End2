import { secureAxios } from './securityService'; // <-- usa el segurity service
import axios from 'axios';
import { notificationService } from './notificationService';


const getAllModel = async (API_BASE_URL: string) => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener modelos (axios):', error);
    throw error;
  }
};

const getModelById = async (API_BASE_URL: string, id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener modelo con ID ${id} (axios):`, error);
    throw error;
  }
};

const getModel_OfModelById = async (API_BASE_URL: string, F_Model: string, id: number, S_Model: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${F_Model}/${id}/${S_Model}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener modelo con info ${F_Model}/${id}/${S_Model} (axios):`, error);
    throw error;
  }
};

const createModel = async (API_BASE_URL: string, modelData: any) => {
  try {
    const response = await secureAxios.post(API_BASE_URL, modelData);
    notificationService.pushNotification({
      id: crypto.randomUUID(),
      title: 'Modelo creado',
      message: `Se creó un nuevo registro en ${API_BASE_URL}`,
      type: 'success',
      timestamp: new Date(),
      read: false,
      notificationType: 'model_created',
      relatedData: { modelData }
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear modelo (axios):', error);
    throw error;
  }
};


const updateModel = async (API_BASE_URL: string, id: number, modelData: any) => {
  try {
    const response = await secureAxios.put(`${API_BASE_URL}/${id}`, modelData);
    notificationService.pushNotification({
      id: crypto.randomUUID(),
      title: 'Modelo actualizado',
      message: `Se actualizó el modelo en ${API_BASE_URL}`,
      type: 'info',
      timestamp: new Date(),
      read: false,
      notificationType: 'model_updated',
      relatedData: { id, modelData }
    });

    return response.data;
  } catch (error) {
    console.error(`Error al actualizar modelo con ID ${id} (axios):`, error);
    throw error;
  }
};

const deleteModel = async (API_BASE_URL: string, id: number) => {
  try {
    const response = await secureAxios.delete(`${API_BASE_URL}/${id}`);
    notificationService.pushNotification({
      id: crypto.randomUUID(),
      title: 'Modelo eliminado',
      message: `Se elimino el modelo en ${API_BASE_URL}`,
      type: 'info',
      timestamp: new Date(),
      read: false,
      notificationType: 'model_deleted',
      relatedData: { id }
    });

    return response.data;
  } catch (error) {
    console.error(`Error al eliminar modelo con ID ${id} (axios):`, error);
    throw error;
  }
};

// Exporta las funciones que necesites (puedes elegir fetch o axios)
export {
  getAllModel,
  getModelById,
  getModel_OfModelById,
  createModel,
  updateModel,
  deleteModel,
};