import { Message } from '../types';

export const mockMessages: Message[] = [
  // Messages for order-1 (if it exists with a fixer)
  {
    id: 'msg-1',
    orderId: 'order-1',
    senderId: 'user-2', // Sarah Schmidt (Fixer)
    content: 'Hallo! Ich habe deinen Auftrag angenommen. Ich kann morgen um 14 Uhr zur Safe Zone kommen. Passt das?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: true,
  },
  {
    id: 'msg-2',
    orderId: 'order-1',
    senderId: 'user-1', // Max Müller (Customer)
    content: 'Perfekt! 14 Uhr passt mir super. Bis morgen! 👍',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    read: true,
  },
  {
    id: 'msg-3',
    orderId: 'order-1',
    senderId: 'user-2', // Sarah Schmidt (Fixer)
    content: 'Super! Ich bringe alle notwendigen Werkzeuge mit. Bis morgen! 🔧',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min ago
    read: true,
  },

  // Messages for order-2
  {
    id: 'msg-4',
    orderId: 'order-2',
    senderId: 'user-3', // Tom Fischer (Fixer)
    content: 'Hi! Ich habe deinen Fahrrad-Auftrag gesehen. Welche Reifengröße braucht dein Bike?',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    read: true,
  },
  {
    id: 'msg-5',
    orderId: 'order-2',
    senderId: 'user-1', // Customer
    content: 'Es ist ein 28 Zoll Reifen. Kannst du den austauschen?',
    timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 'msg-6',
    orderId: 'order-2',
    senderId: 'user-3', // Tom Fischer
    content: 'Kein Problem! Ich habe einen passenden Reifen vorrätig. Sehen wir uns heute um 16 Uhr?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
    read: false,
  },

  // Messages for order-3
  {
    id: 'msg-7',
    orderId: 'order-3',
    senderId: 'user-6', // Anna Klein (Fixer)
    content: 'Hallo! Ich bin auf dem Weg zur Bibliothek. Bin in ca. 10 Minuten da!',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
    read: false,
  },
  {
    id: 'msg-8',
    orderId: 'order-3',
    senderId: 'user-6', // Anna Klein
    content: 'Ich bin angekommen! Wo genau bist du? Ich stehe beim Haupteingang.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min ago
    read: false,
  },

  // Messages for order-4
  {
    id: 'msg-9',
    orderId: 'order-4',
    senderId: 'user-5', // Jonas Becker (Fixer)
    content: 'Hey! Für den Möbelaufbau brauche ich ca. 1 Stunde. Hast du alle Teile und die Anleitung?',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
  },
  {
    id: 'msg-10',
    orderId: 'order-4',
    senderId: 'user-7', // David Wagner (Customer)
    content: 'Ja, alles da! Der IKEA Karton ist noch original verpackt.',
    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 'msg-11',
    orderId: 'order-4',
    senderId: 'user-5', // Jonas Becker
    content: 'Perfekt! Dann sehen wir uns morgen um 15 Uhr an der Mensa.',
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];
