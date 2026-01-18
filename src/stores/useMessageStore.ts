import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '../types';
import { mockMessages } from '../data/mockMessages';

interface MessageState {
  messages: Message[];
  addMessage: (message: Message) => void;
  getMessagesByOrderId: (orderId: string) => Message[];
  markAsRead: (orderId: string, userId: string) => void;
  getUnreadCount: (orderId: string, userId: string) => number;
  getTotalUnreadCount: (userId: string) => number;
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      messages: mockMessages,

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      getMessagesByOrderId: (orderId) =>
        get().messages.filter((msg) => msg.orderId === orderId)
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),

      markAsRead: (orderId, userId) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.orderId === orderId && msg.senderId !== userId
              ? { ...msg, read: true }
              : msg
          ),
        })),

      getUnreadCount: (orderId, userId) =>
        get().messages.filter(
          (msg) => msg.orderId === orderId && msg.senderId !== userId && !msg.read
        ).length,

      getTotalUnreadCount: (userId) =>
        get().messages.filter(
          (msg) => msg.senderId !== userId && !msg.read
        ).length,
    }),
    {
      name: 'campusfix-messages',
    }
  )
);
