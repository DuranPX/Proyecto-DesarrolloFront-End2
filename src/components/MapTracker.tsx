import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { 
  getMotorcycles, 
  getOrders, 
  createSocketConnection,
  type MapMotorcycle,
  type MapOrder
} from '../services/mapService';
import axios from 'axios';

const PLATE = "ABC124"; // Placa de la moto a trackear
const BASE_URL = "http://localhost:5000";

const MapTracker: React.FC = () => {
  const [motorcycles, setMotorcycles] = useState<MapMotorcycle[]>([]);
  const [orders, setOrders] = useState<MapOrder[]>([]);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number}[]>([]);
  const [currentPosition, setCurrentPosition] = useState<{lat: number, lng: number} | null>(null);
  const [socketService] = useState(() => createSocketConnection('http://127.0.0.1:5000'));

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCMSVq50i4aR5gAalGYutE53CYojPBCd4U',
    libraries: ['places', 'geometry'],
  });

  // Carga datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [motos, ordenes] = await Promise.all([
          getMotorcycles('http://127.0.0.1:5000/motorcycles'),
          getOrders('http://127.0.0.1:5000/orders')
        ]);
        setMotorcycles(motos);
        setOrders(ordenes);
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
      }
    };

    loadInitialData();
  }, []);

  // Configura WebSocket
  useEffect(() => {
    socketService.connect(
      (moto) => {
        setMotorcycles(prev => prev.map(m => m.id === moto.id ? moto : m));
      },
      (order) => {
        setOrders(prev => prev.map(o => o.id === order.id ? order : o));
      }
    );

    return () => {
      socketService.disconnect();
    };
  }, [socketService]);

  // Funciones para el tracking (del profesor)
  const startTracking = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/motorcycles/track/${PLATE}`);
      console.log('Tracking iniciado:', response.data);
      alert('Tracking iniciado correctamente');
    } catch (error) {
      console.error('Error al iniciar tracking:', error);
      alert('Error al iniciar tracking');
    }
  };

  const stopTracking = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/motorcycles/stop/${PLATE}`);
      console.log('Tracking detenido:', response.data);
      alert('Tracking detenido correctamente');
    } catch (error) {
      console.error('Error al detener tracking:', error);
      alert('Error al detener tracking');
    }
  };

  // Manejador de clics en el mapa (del profesor)
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const newPosition = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    
    setCurrentPosition(newPosition);
    setCoordinates([...coordinates, newPosition]);
  };

  const exportToJson = () => {
    const dataStr = JSON.stringify(coordinates, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'coordenadas.json');
    linkElement.click();
  };

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Seguimiento en Tiempo Real</h2>
      
      <div className="flex gap-4 mb-4">
        <button 
          onClick={startTracking}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Iniciar Tracking (run.py)
        </button>
        
        <button 
          onClick={stopTracking}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Detener Tracking (stop.py)
        </button>
        
        <button 
          onClick={exportToJson}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Exportar a JSON
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <GoogleMap
            zoom={13}
            center={{ lat: 5.06889, lng: -75.51738 }}
            mapContainerStyle={{ width: '100%', height: '70vh' }}
            onClick={handleMapClick}
          >
            {/* Marcadores de motos */}
            {motorcycles.map(moto => (
              <Marker
                key={`moto-${moto.id}`}
                position={moto.position}
                icon={{
                  url: moto.status === 'active' ? 'moto-activa.png' : 'moto-inactiva.png',
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
            ))}

            {/* Marcadores de pedidos */}
            {orders.map(order => (
              <Marker
                key={`order-${order.id}`}
                position={order.position}
                icon={{
                  url: order.status === 'pending' ? 'pedido-pendiente.png' : 'pedido-entregado.png',
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ))}

            {/* Marcadores de clics (del profesor) */}
            {coordinates.map((coord, index) => (
              <Marker
                key={`click-${index}`}
                position={coord}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ))}
          </GoogleMap>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Coordenadas guardadas</h3>
          <div className="h-64 overflow-y-auto bg-white p-2 rounded">
            <pre>{JSON.stringify(coordinates, null, 2)}</pre>
          </div>
          
          {currentPosition && (
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <h4 className="font-semibold">Última posición:</h4>
              <p>Lat: {currentPosition.lat.toFixed(6)}</p>
              <p>Lng: {currentPosition.lng.toFixed(6)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapTracker;