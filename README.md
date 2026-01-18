# 🛠️ CampusFix

**Peer-to-Peer Reparaturplattform für Studierende**

Eine moderne Web-Applikation, die Studierende mit Reparaturbedarf (Kunden) mit anderen Studierenden verbindet, die Reparaturen durchführen können (Fixer). Alle Reparaturen finden an sicheren "Safe Zones" auf dem Campus statt.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)

---

## 🎯 Features

### Für Kunden
- 📱 **Multi-Step Booking**: Reparatur in 5 einfachen Schritten buchen
- 🔍 **Live-Tracking**: Echtzeit-Status der Reparatur verfolgen
- 💬 **Direkter Chat**: Mit dem Fixer kommunizieren
- ⭐ **Bewertungssystem**: Fixer nach Abschluss bewerten
- 🛡️ **Safe Zones**: Sichere Treffpunkte auf dem Campus

### Für Fixer
- 💼 **Fixer Dashboard**: Übersicht über verfügbare Aufträge
- 📊 **Statistiken**: Verdienst, abgeschlossene Jobs, Bewertungen
- ✅ **Auftrag Management**: Aufträge annehmen und verwalten
- 🔔 **Online/Offline Status**: Verfügbarkeit selbst steuern

### Kategorien
- 📱 **Tech Fix**: Smartphones, Laptops, Tablets
- 🚲 **Mobility**: Fahrräder, E-Scooter
- 🏠 **Dorm Support**: Möbelaufbau, Kleinreparaturen

---

## 🚀 Quick Start

**Test-Login:**
- Username: `test` (oder beliebig)
- Passwort: `test` (oder beliebig)

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 19.2 + TypeScript
- **Build Tool:** Vite 7.2
- **Styling:** Tailwind CSS 3.4
- **State Management:** Zustand 5.0 (mit localStorage Persistenz)
- **Routing:** React Router 7.12
- **Icons:** Lucide React

---

## 📦 Installation

### Voraussetzungen
- Node.js 18+
- npm oder yarn

### Setup

```bash
# Repository klonen
git clone https://github.com/DEIN-USERNAME/campusfix.git
cd campusfix

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die App läuft auf [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Verfügbare Scripts

```bash
# Development Server
npm run dev

# Production Build
npm run build

# Build Preview
npm run preview

# Linting
npm run lint
```

---

## 📁 Projekt-Struktur

```
campusfix/
├── src/
│   ├── components/
│   │   ├── ui/              # Wiederverwendbare UI-Komponenten
│   │   └── layout/          # Layout-Komponenten
│   ├── pages/               # Seiten/Views
│   │   ├── Dashboard.tsx
│   │   ├── NewBooking.tsx
│   │   ├── MyOrders.tsx
│   │   ├── OrderDetail.tsx
│   │   ├── Messages.tsx
│   │   ├── Profile.tsx
│   │   ├── FixerDashboard.tsx
│   │   └── Login.tsx
│   ├── stores/              # Zustand State Management
│   ├── hooks/               # Custom React Hooks
│   ├── data/                # Mock-Daten
│   └── types/               # TypeScript Interfaces
├── public/
├── PROJEKT_STATUS.md        # Ausführliche Projekt-Dokumentation
├── DEPLOYMENT.md            # Deployment-Anleitung
└── package.json
```

---

## 🎨 Design System

### Farbschema
```javascript
primary: {
  50: '#E8F4EC',   // Light backgrounds
  600: '#304E39',  // Primary buttons
  700: '#2D5A3D',  // Hover states
}
```

### UI-Prinzipien
- 🎯 Mobile-First Responsive Design
- 🌈 Konsistente Farbpalette (Grün-Töne)
- 📐 Abgerundete Ecken & Smooth Transitions
- 📱 Touch-optimierte Buttons

---

## 🧪 Features im Detail

### Simulierte Status-Updates
```
pending → accepted (manuell durch Fixer)
accepted → en_route (15s)
en_route → arrived (20s)
arrived → in_progress (10s)
in_progress → completed (30s)
```

### localStorage Persistenz
- Aufträge werden lokal gespeichert
- Session bleibt nach Reload erhalten

### Mock-Daten
- 10 Beispiel-User (Kunden, Fixer, Beide)
- 12 Beispiel-Aufträge (verschiedene Status)
- 5 Safe Zones auf dem Campus

---

## 📊 Performance

- **Bundle Size:** 306 KB (gzip: 91.5 KB)
- **CSS Size:** 25 KB (gzip: 5.2 KB)
- **Build Time:** ~12 Sekunden

---

## 🔒 Safe Zones

Alle Treffpunkte sind:
- Öffentlich und gut besucht
- Überwacht (Kameras)
- Während Öffnungszeiten zugänglich

Beispiele:
- 🏛️ Bibliothek ULB
- 🍽️ Mensa Stadtmitte
- 🏢 Lernzentrum S1|03

---

## 🚧 Roadmap

### MVP (✅ Fertig)
- [x] Multi-Step Booking Flow
- [x] Order Management
- [x] Chat Interface
- [x] Fixer Dashboard
- [x] Rating System

### Zukünftige Features
- [ ] Echtes Backend (Node.js + PostgreSQL)
- [ ] WebSocket Chat
- [ ] Zahlungsintegration
- [ ] Foto-Upload
- [ ] PWA (Progressive Web App)

---

## 📄 Lizenz

Projekt entwickelt für TU Darmstadt - DBM Kurs

---

## 📚 Weitere Dokumentation

- [PROJEKT_STATUS.md](./PROJEKT_STATUS.md) - Detaillierter Projektstatus
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment-Anleitung

---

**Version:** 1.0.0 MVP
**Erstellt:** Januar 2026
**Status:** ✅ Production Ready
