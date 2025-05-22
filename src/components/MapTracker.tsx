import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, Polyline, useLoadScript } from '@react-google-maps/api';
import { 
  getMotorcycles, 
  getOrders, 
  createSocketConnection,
  type MapMotorcycle,
  type MapOrder
} from '../services/mapService';
import axios from 'axios';
import { notificationService } from '../services/notificationService';

const PLATE = "ABC124"; // Placa de la moto a trackear
const BASE_URL = "http://localhost:5000";

const MapTracker: React.FC = () => {
  const [motorcycles, setMotorcycles] = useState<MapMotorcycle[]>([]);
  const [orders, setOrders] = useState<MapOrder[]>([]);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number}[]>([]);
  const [currentPosition, setCurrentPosition] = useState<{lat: number, lng: number} | null>(null);
  const [socketService] = useState(() => createSocketConnection('http://127.0.0.1:5000'));
  const [simulatedMoto, setSimulatedMoto] = useState<MapMotorcycle | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null);

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
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [socketService]);

  const generateRoute = (): {lat: number, lng: number}[] => {
    // Ruta circular alrededor de Manizales
    const center = { lat: 5.06889, lng: -75.51738 };
    const radius = 0.02; // en grados
    const points = 20;
    
    return Array.from({ length: points }).map((_, i) => {
      const angle = (i / points) * 2 * Math.PI;
      return {
        lat: center.lat + radius * Math.cos(angle),
        lng: center.lng + radius * Math.sin(angle)
      };
    });
  };

  const startSimulation = () => {
    if (isSimulating) return;
    
    const route = generateRoute();
    let currentIndex = 0;
    
    // Crear la moto simulada si no existe
    if (!simulatedMoto) {
      setSimulatedMoto({
        id: 1,
        license_plate: PLATE,
        position: route[0],
        status: 'active',
      });
    }
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % route.length;
      const newPosition = route[currentIndex];
      
      setSimulatedMoto(prev => prev ? {
        ...prev,
        position: newPosition,
        lastUpdated: new Date().toISOString()
      } : null);
      
      // Actualizar coordenadas
      setCoordinates(prev => [...prev, newPosition]);
      
      // Notificación de movimiento
      notificationService.pushNotification({
        id: crypto.randomUUID(),
        title: 'Moto en movimiento',
        message: `Moto ${PLATE} se movió a nueva posición`,
        type: 'info',
        timestamp: new Date(),
        read: false,
        notificationType: 'motorcycle_moved',
        relatedData: {
          plate: PLATE,
          position: newPosition,
          details: {
            latitude: newPosition.lat.toFixed(6),
            longitude: newPosition.lng.toFixed(6),
            timestamp: new Date().toISOString()
          }
        }
      });
      
    }, 2000); // Actualiza cada 2 segundos
    
    setSimulationInterval(interval);
    setIsSimulating(true);
  };

  const stopSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    setIsSimulating(false);
  };

  // Funciones para el tracking
  const startTracking = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/motorcycles/track/${PLATE}`);
      console.log('Tracking iniciado:', response.data);
      
      notificationService.pushNotification({
        id: crypto.randomUUID(),
        title: 'Tracking iniciado',
        message: `Se inició el seguimiento para la moto ${PLATE}`,
        type: 'info',
        timestamp: new Date(),
        read: false,
        notificationType: 'motorcycle_moved',
        relatedData: {
          plate: PLATE,
          action: 'tracking_started',
          timestamp: new Date().toISOString()
        }
      });
      
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
      
      notificationService.pushNotification({
        id: crypto.randomUUID(),
        title: 'Tracking detenido',
        message: `Se detuvo el seguimiento para la moto ${PLATE}`,
        type: 'info',
        timestamp: new Date(),
        read: false,
        notificationType: 'motorcycle_moved',
        relatedData: {
          plate: PLATE,
          action: 'tracking_stopped',
          timestamp: new Date().toISOString()
        }
      });
      
      alert('Tracking detenido correctamente');
    } catch (error) {
      console.error('Error al detener tracking:', error);
      alert('Error al detener tracking');
    }
  };

  const sendCoordinateNotification = (position: {lat: number, lng: number}, index: number) => {
    notificationService.pushNotification({
      id: crypto.randomUUID(),
      title: 'Nueva coordenada',
      message: `Moto ${PLATE} se movió a nueva posición (${index + 1})`,
      type: 'info',
      timestamp: new Date(),
      read: false,
      notificationType: 'motorcycle_moved',
      relatedData: {
        plate: PLATE,
        position: position,
        message: `Nueva coordenada guardada (${index + 1})`,
        details: {
          latitude: position.lat.toFixed(6),
          longitude: position.lng.toFixed(6),
          timestamp: new Date().toISOString()
        }
      }
    });
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const newPosition = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    
    setCurrentPosition(newPosition);
    const updatedCoordinates = [...coordinates, newPosition];
    setCoordinates(updatedCoordinates);

    sendCoordinateNotification(newPosition, updatedCoordinates.length - 1);
  };

  const exportToJson = () => {
    const dataStr = JSON.stringify(coordinates, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'coordenadas.json');
    linkElement.click();
    
    notificationService.pushNotification({
      id: crypto.randomUUID(),
      title: 'Coordenadas exportadas',
      message: `Se exportaron ${coordinates.length} coordenadas`,
      type: 'info',
      timestamp: new Date(),
      read: false,
      notificationType: 'motorcycle_moved',
      relatedData: {
        count: coordinates.length,
        timestamp: new Date().toISOString()
      }
    });
  };

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Seguimiento en Tiempo Real</h2>
      
      <div className="flex gap-4 mb-4 flex-wrap">
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
          onClick={startSimulation}
          disabled={isSimulating}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
        >
          Iniciar Simulación
        </button>
        
        <button 
          onClick={stopSimulation}
          disabled={!isSimulating}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400"
        >
          Detener Simulación
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
            {/* Marcador de la moto simulada */}
            {simulatedMoto && (
              <Marker
                key="simulated-moto"
                position={simulatedMoto.position}
                icon={{
                  url: '/moto-simulada.png',
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
            )}

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

            {/* Marcadores de clics */}
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

            {/* Ruta de la simulación */}
            {simulatedMoto && coordinates.length > 1 && (
              <Polyline
                path={coordinates}
                options={{
                  strokeColor: '#FF0000',
                  strokeOpacity: 1.0,
                  strokeWeight: 2
                }}
              />
            )}
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