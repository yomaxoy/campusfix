import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'tech',
    name: 'Tech Fix',
    icon: 'Smartphone',
    description: 'Reparaturen für Smartphones, Tablets & Laptops',
    subcategories: [
      {
        id: 'smartphone',
        name: 'Smartphone',
        issues: [
          { id: 'screen', label: 'Display-Reparatur', priceRange: { min: 40, max: 120 }, estimatedTime: '30-60 Min' },
          { id: 'battery', label: 'Akku-Austausch', priceRange: { min: 25, max: 60 }, estimatedTime: '20-40 Min' },
          { id: 'charging', label: 'Ladebuchse defekt', priceRange: { min: 30, max: 70 }, estimatedTime: '30-45 Min' },
          { id: 'camera', label: 'Kamera-Problem', priceRange: { min: 35, max: 90 }, estimatedTime: '25-50 Min' },
          { id: 'other', label: 'Sonstiges', priceRange: { min: 20, max: 100 }, estimatedTime: '20-90 Min' },
        ],
      },
      {
        id: 'laptop',
        name: 'Laptop',
        issues: [
          { id: 'keyboard', label: 'Tastatur-Reparatur', priceRange: { min: 40, max: 80 }, estimatedTime: '45-60 Min' },
          { id: 'battery', label: 'Akku-Austausch', priceRange: { min: 50, max: 100 }, estimatedTime: '30-45 Min' },
          { id: 'screen', label: 'Display-Problem', priceRange: { min: 80, max: 200 }, estimatedTime: '60-90 Min' },
          { id: 'software', label: 'Software-Installation', priceRange: { min: 15, max: 40 }, estimatedTime: '30-60 Min' },
          { id: 'other', label: 'Sonstiges', priceRange: { min: 25, max: 150 }, estimatedTime: '30-120 Min' },
        ],
      },
      {
        id: 'tablet',
        name: 'Tablet',
        issues: [
          { id: 'screen', label: 'Display-Reparatur', priceRange: { min: 50, max: 140 }, estimatedTime: '40-70 Min' },
          { id: 'battery', label: 'Akku-Austausch', priceRange: { min: 35, max: 75 }, estimatedTime: '30-50 Min' },
          { id: 'charging', label: 'Ladebuchse defekt', priceRange: { min: 30, max: 65 }, estimatedTime: '25-40 Min' },
          { id: 'other', label: 'Sonstiges', priceRange: { min: 25, max: 120 }, estimatedTime: '30-90 Min' },
        ],
      },
    ],
  },
  {
    id: 'mobility',
    name: 'Mobility Fix',
    icon: 'Bike',
    description: 'Reparaturen für Fahrräder & E-Scooter',
    subcategories: [
      {
        id: 'bicycle',
        name: 'Fahrrad',
        issues: [
          { id: 'tire', label: 'Reifen/Schlauch wechseln', priceRange: { min: 10, max: 25 }, estimatedTime: '20-30 Min' },
          { id: 'brakes', label: 'Bremsen einstellen', priceRange: { min: 15, max: 30 }, estimatedTime: '15-25 Min' },
          { id: 'gears', label: 'Gangschaltung reparieren', priceRange: { min: 20, max: 40 }, estimatedTime: '20-35 Min' },
          { id: 'chain', label: 'Kette wechseln/ölen', priceRange: { min: 10, max: 35 }, estimatedTime: '15-30 Min' },
          { id: 'lights', label: 'Beleuchtung reparieren', priceRange: { min: 10, max: 25 }, estimatedTime: '10-20 Min' },
          { id: 'other', label: 'Sonstiges', priceRange: { min: 10, max: 50 }, estimatedTime: '15-60 Min' },
        ],
      },
      {
        id: 'escooter',
        name: 'E-Scooter',
        issues: [
          { id: 'tire', label: 'Reifen wechseln', priceRange: { min: 15, max: 35 }, estimatedTime: '25-40 Min' },
          { id: 'brakes', label: 'Bremsen einstellen', priceRange: { min: 15, max: 30 }, estimatedTime: '15-25 Min' },
          { id: 'battery', label: 'Akku-Problem', priceRange: { min: 30, max: 80 }, estimatedTime: '30-60 Min' },
          { id: 'electronics', label: 'Elektronik-Problem', priceRange: { min: 25, max: 70 }, estimatedTime: '30-50 Min' },
          { id: 'other', label: 'Sonstiges', priceRange: { min: 15, max: 60 }, estimatedTime: '20-60 Min' },
        ],
      },
    ],
  },
  {
    id: 'dorm',
    name: 'Dorm Support',
    icon: 'Home',
    description: 'Hilfe bei Möbeln & kleinen Reparaturen',
    subcategories: [
      {
        id: 'furniture',
        name: 'Möbel',
        issues: [
          { id: 'assembly', label: 'Möbel aufbauen', priceRange: { min: 15, max: 40 }, estimatedTime: '30-90 Min' },
          { id: 'repair', label: 'Möbel reparieren', priceRange: { min: 10, max: 35 }, estimatedTime: '20-60 Min' },
          { id: 'hanging', label: 'Regale/Bilder aufhängen', priceRange: { min: 10, max: 25 }, estimatedTime: '15-30 Min' },
        ],
      },
      {
        id: 'appliances',
        name: 'Geräte',
        issues: [
          { id: 'coffee', label: 'Kaffeemaschine entkalken', priceRange: { min: 10, max: 20 }, estimatedTime: '15-25 Min' },
          { id: 'lamp', label: 'Lampe reparieren', priceRange: { min: 10, max: 25 }, estimatedTime: '15-30 Min' },
          { id: 'other', label: 'Sonstiges', priceRange: { min: 10, max: 40 }, estimatedTime: '15-60 Min' },
        ],
      },
    ],
  },
];
