import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RepairOrder } from '../types';
import { mockOrders } from '../data/mockOrders';

interface OrderState {
  orders: RepairOrder[];
  addOrder: (order: RepairOrder) => void;
  updateOrder: (id: string, updates: Partial<RepairOrder>) => void;
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

      updateOrder: (id, updates) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, ...updates, updatedAt: new Date().toISOString() } : order
          ),
        })),

      acceptOrder: (orderId, fixerId) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, fixerId, status: 'accepted', updatedAt: new Date().toISOString() }
              : order
          ),
        })),

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
