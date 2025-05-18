import axios from 'axios';
import io, { Socket } from 'socket.io-client';

// Tipos básicos para el mapa
interface Position {
  lat: number;
  lng: number;
}

interface MapMotorcycle {
  id: number;
  license_plate: string;
  position: Position;
  status: string;
  driverName?: string;
  lastUpdate?: string;
}

interface MapOrder {
  id: number;
  position: Position;
  status: string;
  address: string;
  clientName?: string;
  quantity?: number;
  total_price?: number;
}

// Funciones para obtener datos del mapa
const getMotorcycles = async (API_BASE_URL: string) => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.map((moto: any) => ({
      ...moto,
      position: { lat: moto.latitude, lng: moto.longitude },
      driverName: moto.driver_name || `Conductor ${moto.license_plate}`,
      lastUpdate: new Date().toISOString()
    })) as MapMotorcycle[];
  } catch (error) {
    console.error('Error al obtener motocicletas:', error);
    throw error;
  }
};

const getOrders = async (API_BASE_URL: string) => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.map((order: any) => ({
      id: order.id,
      position: { 
        lat: order.address?.latitude || 4.710989, 
        lng: order.address?.longitude || -74.072092 
      },
      address: order.address?.address_line || 'Dirección no disponible',
      clientName: order.customer?.name || 'Cliente no disponible',
      status: order.status,
      quantity: order.quantity,
      total_price: order.total_price
    })) as MapOrder[];
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    throw error;
  }
};

// Servicio de WebSocket
const createSocketConnection = (socketUrl: string) => {
  let socket: Socket | null = null;

  const connect = (onMotorcycleUpdate: (data: MapMotorcycle) => void, 
                  onOrderUpdate: (data: MapOrder) => void) => {
    try {
      socket = io(socketUrl);

      socket.on('motorcycleUpdate', (data: MapMotorcycle) => {
        onMotorcycleUpdate(data);
      });

      socket.on('orderUpdate', (data: MapOrder) => {
        onOrderUpdate(data);
      });

      socket.on('connect_error', (err) => {
        console.error('Error de conexión Socket.IO:', err);
      });

      return socket;
    } catch (error) {
      console.error('Error al conectar con WebSocket:', error);
      throw error;
    }
  };

  const disconnect = () => {
    try {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    } catch (error) {
      console.error('Error al desconectar WebSocket:', error);
      throw error;
    }
  };

  return {
    connect,
    disconnect
  };
};

// Funciones para rutas y geolocalización
const calculateRoute = async (origin: Position, destination: Position, apiKey: string) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${apiKey}`
    );
    return response.data;
  } catch (error) {
    console.error('Error al calcular ruta:', error);
    throw error;
  }
};

const geocodeAddress = async (address: string, apiKey: string) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    return response.data;
  } catch (error) {
    console.error('Error en geocodificación:', error);
    throw error;
  }
};

// Exportación de funciones
export {
  getMotorcycles,
  getOrders,
  createSocketConnection,
  calculateRoute,
  geocodeAddress,
};

export type {
  MapMotorcycle,
  MapOrder,
  Position
};