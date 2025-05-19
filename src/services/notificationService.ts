import { io, Socket } from 'socket.io-client';

export type NotificationType = 
  | 'new_order' 
  | 'order_cancelled' 
  | 'motorcycle_issue' 
  | 'motorcycle_moved';

export interface IssueWithOrderData {
  issueId: number;
  description: string;
  motorcycle: {
    plate: string;
    driverName: string;
  };
  orderDetails: {
    id: number;
    restaurant: string;
    customer: string;
    items: string[];
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  notificationType: NotificationType;
  relatedData?: any;
}

class NotificationSocketService {
  private socket: Socket | null = null;
  private notificationCallbacks: ((notification: Notification) => void)[] = [];

  // Método para conectar
  connect(url: string) {
    this.socket = io(url);

    this.socket.on('connect', () => {
      console.log('Conectado al servidor de notificaciones');
    });

    this.socket.on('new_notification', (notification: Notification) => {
      this.notificationCallbacks.forEach(callback => callback(notification));
    });

    this.socket.on('error', (error: Error) => {
      console.error('Error en la conexión:', error);
    });
  }

  // Método para enviar notificaciones (faltante)
  sendNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    if (!this.socket) {
      console.error('Socket no conectado');
      return;
    }

    const completeNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date(),
      read: false
    };

    this.socket.emit('new_notification', completeNotification);
  }

  // Métodos específicos para cada tipo (faltantes)
  notifyNewOrder(orderData: any) {
    this.sendNotification({
      title: 'Nuevo pedido',
      message: `Pedido recibido de ${orderData.customer?.name || 'cliente'}`,
      type: 'info',
      notificationType: 'new_order',
      relatedData: orderData
    });
  }

  notifyOrderCancelled(orderData: any) {
    this.sendNotification({
      title: 'Pedido cancelado',
      message: `Pedido #${orderData.id || ''} cancelado`,
      type: 'warning',
      notificationType: 'order_cancelled',
      relatedData: orderData
    });
  }

  notifyMotorcycleIssue(issueData: any) {
    this.sendNotification({
      title: 'Problema con motocicleta',
      message: issueData.description || 'Problema reportado',
      type: 'error',
      notificationType: 'motorcycle_issue',
      relatedData: issueData
    });
  }

  notifyMotorcycleMoved(motorcycleData: any) {
    this.sendNotification({
      title: 'Movimiento de motocicleta',
      message: `Moto ${motorcycleData.plate || ''} en movimiento`,
      type: 'info',
      notificationType: 'motorcycle_moved',
      relatedData: motorcycleData
    });
  }

  notifyIssueWithOrder(data: IssueWithOrderData) {
    this.sendNotification({
      title: 'Inconveniente con pedido',
      message: `Problema reportado durante la entrega`,
      type: 'error',
      notificationType: 'motorcycle_issue', // Mantenemos el mismo tipo pero con más datos
      relatedData: data
    });
  }

  // Métodos existentes (suscribe, mark as read, etc.)
  subscribeToNotifications(callback: (notification: Notification) => void) {
    this.notificationCallbacks.push(callback);
    return () => {
      this.notificationCallbacks = this.notificationCallbacks.filter(cb => cb !== callback);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const notificationService = new NotificationSocketService();