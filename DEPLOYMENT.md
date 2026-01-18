# 🚀 CampusFix - Deployment Guide

## Schnellstart: Deployment auf Vercel (EMPFOHLEN)

### Schritt 1: Git Repository erstellen

```bash
cd campusfix
git init
git add .
git commit -m "Initial commit: CampusFix MVP Prototype"
```

### Schritt 2: GitHub Repository erstellen

1. Gehe zu [github.com](https://github.com)
2. Klicke auf "New repository"
3. Name: `campusfix`
4. Beschreibung: `Peer-to-Peer Repair Platform for Students`
5. **NICHT** "Initialize with README" ankreuzen
6. "Create repository" klicken

### Schritt 3: Zu GitHub pushen

```bash
git remote add origin https://github.com/DEIN-USERNAME/campusfix.git
git branch -M main
git push -u origin main
```

Ersetze `DEIN-USERNAME` mit deinem GitHub Username!

### Schritt 4: Auf Vercel deployen

1. Gehe zu [vercel.com](https://vercel.com)
2. Klicke "Sign up" und wähle "Continue with GitHub"
3. Klicke "Import Project"
4. Wähle dein `campusfix` Repository
5. **Build Settings (sollten automatisch erkannt werden):**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Klicke "Deploy"

### ✅ Fertig!

Nach ~1 Minute bekommst du eine URL wie:
```
https://campusfix.vercel.app
```

**Diese URL kannst du mit jedem teilen!**

---

## 🔄 Updates deployen

Jedes Mal wenn du Änderungen machst:

```bash
git add .
git commit -m "Beschreibung der Änderungen"
git push
```

→ Vercel deployt automatisch die neue Version! 🎉

---

## 📱 Alternative: Netlify

### Via Drag & Drop (ohne Git)

1. Build erstellen:
```bash
npm run build
```

2. Gehe zu [netlify.com](https://netlify.com)
3. "Sites" → "Add new site" → "Deploy manually"
4. Ziehe den `dist/` Ordner in den Upload-Bereich
5. Fertig! Du bekommst eine URL wie: `random-name.netlify.app`

### Via Git (automatisch)

1. Gehe zu [netlify.com](https://netlify.com)
2. "Add new site" → "Import an existing project"
3. Wähle GitHub und dein Repository
4. Build Settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. "Deploy site" klicken

---

## 🌐 Temporär teilen: ngrok

Perfekt für spontane Demos oder Tests!

### Installation

**Windows:**
1. Download von [ngrok.com/download](https://ngrok.com/download)
2. Entpacke `ngrok.exe` in einen Ordner
3. Optional: Füge den Ordner zu PATH hinzu

**Oder via npm:**
```bash
npm install -g ngrok
```

### Verwendung

1. **Dev-Server starten** (falls nicht läuft):
```bash
npm run dev
```

2. **In neuem Terminal:**
```bash
ngrok http 5173
```

3. **Du siehst:**
```
Session Status   online
Forwarding       https://abc123.ngrok.app -> http://localhost:5173
```

4. **Teile die URL:** `https://abc123.ngrok.app`

**WICHTIG:**
- URL läuft nur solange dein PC läuft
- Bei Neustart: neue URL (kostenlose Version)
- Für dauerhafte URL: ngrok Account erstellen

---

## 🔒 Custom Domain (Optional)

### Auf Vercel

1. Gehe zu deinem Projekt → "Settings" → "Domains"
2. Füge deine Domain hinzu (z.B. `campusfix.de`)
3. Folge den DNS-Anweisungen

### Auf Netlify

1. "Site settings" → "Domain management"
2. "Add custom domain"
3. DNS konfigurieren

**Kostenlose Domain-Anbieter:**
- [freenom.com](https://freenom.com) (.tk, .ml, .ga domains)
- GitHub Student Pack: 1 Jahr .me Domain gratis

---

## 📊 Deployment-Vergleich

| Feature | Vercel | Netlify | ngrok |
|---------|--------|---------|-------|
| **Kosten** | Kostenlos | Kostenlos | Kostenlos (Basic) |
| **Setup** | 2 Min | 2 Min | 30 Sek |
| **Auto-Deploy** | ✅ | ✅ | ❌ |
| **Custom Domain** | ✅ | ✅ | 💰 (Paid) |
| **HTTPS** | ✅ | ✅ | ✅ |
| **Dauerhaft** | ✅ | ✅ | ❌ |
| **Analytics** | ✅ | ✅ | ❌ |

---

## 🐛 Troubleshooting

### Build Fehler auf Vercel/Netlify

**Problem:** "Build failed"

**Lösung:**
1. Teste lokal: `npm run build`
2. Stelle sicher `package.json` ist committed
3. Check Build Logs auf der Plattform

### 404 bei React Router Pfaden

**Problem:** Nur `/` funktioniert, `/dashboard` gibt 404

**Lösung für Vercel:**
Erstelle `vercel.json` im Root:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Lösung für Netlify:**
Erstelle `_redirects` im `public/` Ordner:
```
/*    /index.html   200
```

### localStorage funktioniert nicht

**Problem:** Daten werden nicht gespeichert

**Lösung:**
- Check Browser Privacy Settings
- Vercel/Netlify sollten keine Probleme haben
- Teste in Incognito Mode

---

## 📝 Checkliste vor Deployment

- [ ] `npm run build` läuft ohne Fehler
- [ ] `.env` Dateien NICHT committed (falls vorhanden)
- [ ] `README.md` aktualisiert
- [ ] Screenshots für GitHub hinzugefügt
- [ ] Demo-Credentials dokumentiert

---

## 🎯 Empfohlener Workflow

**Für Präsentation/Demo:**
→ **Vercel** (professionell, dauerhaft)

**Für schnelle Tests:**
→ **ngrok** (temporär, sofort)

**Für Team ohne Tech-Know-how:**
→ **Netlify Drag & Drop** (einfachste Option)

---

## 💡 Tipps

1. **Environment Variables:**
   - In Vercel/Netlify: Settings → Environment Variables
   - Lokale `.env` Dateien NICHT committen!

2. **Performance:**
   - Vercel/Netlify haben automatisches CDN
   - Bilder sollten optimiert sein
   - Lazy Loading für große Komponenten

3. **Analytics:**
   - Vercel: Eingebaute Analytics
   - Netlify: Eingebaute Analytics
   - Google Analytics: Optional hinzufügen

---

## 🆘 Support

**Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
**Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
**ngrok Docs:** [ngrok.com/docs](https://ngrok.com/docs)

---

**Erstellt:** Januar 2026
**Version:** 1.0.0
