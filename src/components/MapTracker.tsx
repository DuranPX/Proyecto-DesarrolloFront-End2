import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { 
  getMotorcycles, 
  getOrders, 
  createSocketConnection,
  type MapMotorcycle,
  type MapOrder
} from '../services/mapService';

const MapTracker: React.FC = () => {
  const [motorcycles, setMotorcycles] = useState<MapMotorcycle[]>([]);
  const [orders, setOrders] = useState<MapOrder[]>([]);
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

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <GoogleMap
      zoom={13}
      center={{ lat: 5.06889, lng: -75.51738 }}
      mapContainerStyle={{ width: '100%', height: '80vh' }}
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
    </GoogleMap>
  );
};

export default MapTracker;