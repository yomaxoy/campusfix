import { SafeZone } from '../types';

export const safeZones: SafeZone[] = [
  {
    id: 'sz-1',
    name: 'Universitätsbibliothek - Haupteingang',
    address: 'S1|20 Stadtmitte, Dolivostraße 15, 64293 Darmstadt',
    coordinates: { lat: 49.8728, lng: 8.6512 },
    isAvailable: true,
  },
  {
    id: 'sz-2',
    name: 'Mensa Stadtmitte - Außenbereich',
    address: 'Alexanderstraße 4, 64283 Darmstadt',
    coordinates: { lat: 49.8745, lng: 8.6542 },
    isAvailable: true,
  },
  {
    id: 'sz-3',
    name: 'Lichtwiese - Mensa Lounge',
    address: 'Petersenstraße 32, 64287 Darmstadt',
    coordinates: { lat: 49.8634, lng: 8.6789 },
    isAvailable: true,
  },
  {
    id: 'sz-4',
    name: 'Audimax - Foyer',
    address: 'S1|01 Karolinenplatz 5, 64289 Darmstadt',
    coordinates: { lat: 49.8767, lng: 8.6523 },
    isAvailable: true,
  },
  {
    id: 'sz-5',
    name: 'Schlossgarten - Pavillon',
    address: 'Schlossgarten, 64283 Darmstadt',
    coordinates: { lat: 49.8789, lng: 8.6501 },
    isAvailable: false,
  },
];
