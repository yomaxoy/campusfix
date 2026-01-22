import { useEffect } from 'react';
import { useOrderStore } from '../stores/useOrderStore';
import type { OrderStatus } from '../types';

/**
 * Hook to simulate status updates for accepted orders
 * This creates a realistic demo experience by automatically
 * progressing order statuses
 */
export const useOrderStatusSimulation = () => {
  const { orders, updateOrder } = useOrderStore();

  useEffect(() => {
    // Status progression mapping with time delays (in ms)
    const statusProgression: Record<OrderStatus, { next: OrderStatus; delay: number } | null> = {
      pending: null, // Stays until manually accepted
      accepted: { next: 'en_route', delay: 15000 }, // 15 seconds
      negotiating: null, // Stays until all confirmed
      ready: { next: 'en_route', delay: 5000 }, // 5 seconds
      en_route: { next: 'arrived', delay: 20000 }, // 20 seconds
      arrived: { next: 'in_progress', delay: 10000 }, // 10 seconds
      in_progress: { next: 'completed', delay: 30000 }, // 30 seconds
      completed: null,
      cancelled: null,
      escalated: null,
    };

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Check each order and schedule status updates
    orders.forEach((order) => {
      const progression = statusProgression[order.status];

      if (progression) {
        const timer = setTimeout(() => {
          updateOrder(order.id, {
            status: progression.next,
            ...(progression.next === 'completed' && {
              completedAt: new Date().toISOString(),
              finalPrice: Math.round((order.priceEstimate.min + order.priceEstimate.max) / 2)
            })
          });
        }, progression.delay);

        timers.push(timer);
      }
    });

    // Cleanup timers on unmount
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [orders, updateOrder]);
};
