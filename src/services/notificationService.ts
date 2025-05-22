export type NotificationType =
  | 'model_created'
  | 'model_updated'
  | 'model_deleted'
  | 'new_order'
  | 'order_cancelled'
  | 'motorcycle_issue'
  | 'motorcycle_moved';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  notificationType: NotificationType;
  relatedData?: any;
}

let pushFn: ((notif: Notification) => void) | null = null;

export const notificationService = {
  subscribe(push: (notif: Notification) => void) {
    pushFn = push;
  },
  unsubscribe() {
    pushFn = null;
  },
  pushNotification(notif: Notification) {
    pushFn?.(notif);
  }
};
