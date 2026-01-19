import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RepairOrder } from '../types';
import { mockOrders } from '../data/mockOrders';

interface OrderState {
  orders: RepairOrder[];
  addOrder: (order: RepairOrder) => void;
  updateOrder: (id: string, updates: Partial<RepairOrder>, skipNotification?: boolean) => void;
  getOrderById: (id: string) => RepairOrder | undefined;
  getOrdersByCustomerId: (customerId: string) => RepairOrder[];
  getOrdersByFixerId: (fixerId: string) => RepairOrder[];
  acceptOrder: (orderId: string, fixerId: string) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: mockOrders,

      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order],
        })),

      updateOrder: (id, updates, skipNotification = false) => {
        const order = get().orders.find(o => o.id === id);

        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, ...updates, updatedAt: new Date().toISOString() } : order
          ),
        }));

        // Send notification if status changed
        if (!skipNotification && updates.status && order && updates.status !== order.status) {
          // Import notification store dynamically to avoid circular dependency
          import('./useNotificationStore').then(({ useNotificationStore }) => {
            const { addNotification } = useNotificationStore.getState();

            const statusMessages: Record<string, { title: string; message: string; type: any }> = {
              accepted: {
                title: 'Auftrag angenommen!',
                message: 'Ein Fixer hat deinen Auftrag angenommen und wird sich bald melden.',
                type: 'order_accepted'
              },
              en_route: {
                title: 'Fixer ist unterwegs',
                message: 'Der Fixer ist auf dem Weg zur Safe Zone.',
                type: 'fixer_en_route'
              },
              arrived: {
                title: 'Fixer ist angekommen',
                message: 'Der Fixer ist am Treffpunkt eingetroffen.',
                type: 'fixer_arrived'
              },
              in_progress: {
                title: 'Reparatur läuft',
                message: 'Die Reparatur deines Geräts hat begonnen.',
                type: 'order_status_changed'
              },
              completed: {
                title: 'Auftrag abgeschlossen!',
                message: 'Die Reparatur wurde erfolgreich abgeschlossen. Bitte bewerte den Fixer.',
                type: 'order_completed'
              },
              cancelled: {
                title: 'Auftrag storniert',
                message: 'Der Auftrag wurde storniert.',
                type: 'order_cancelled'
              }
            };

            if (updates.status && statusMessages[updates.status]) {
              const notification = statusMessages[updates.status];
              if (notification && order) {
                addNotification({
                  userId: order.customerId,
                  type: notification.type,
                  title: notification.title,
                  message: notification.message,
                  orderId: order.id,
                  read: false,
                });
              }
            }
          });
        }
      },

      acceptOrder: (orderId, fixerId) => {
        const order = get().orders.find(o => o.id === orderId);

        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, fixerId, status: 'accepted', updatedAt: new Date().toISOString() }
              : order
          ),
        }));

        // Send notification to customer
        if (order) {
          import('./useNotificationStore').then(({ useNotificationStore }) => {
            const { addNotification } = useNotificationStore.getState();
            addNotification({
              userId: order.customerId,
              type: 'order_accepted',
              title: 'Auftrag angenommen!',
              message: 'Ein Fixer hat deinen Auftrag angenommen und wird sich bald melden.',
              orderId: order.id,
              read: false,
            });
          });
        }
      },

      getOrderById: (id) => get().orders.find((order) => order.id === id),

      getOrdersByCustomerId: (customerId) =>
        get().orders.filter((order) => order.customerId === customerId),

      getOrdersByFixerId: (fixerId) =>
        get().orders.filter((order) => order.fixerId === fixerId),
    }),
    {
      name: 'campusfix-orders',
    }
  )
);
