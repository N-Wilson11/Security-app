# Security-app

Node.js-dashboard met recente beveiligingsadvisories van het NCSC (RSS-feed), inclusief advies om de kwetsbaarheid tegen te gaan.

```
npm start        # http://localhost:3005
npm test
```

Configuratie via omgevingsvariabelen: `PORT` (3005), `REFRESH_MINUTES` (15, hoe vaak de feed wordt ververst), `FEED_URL`.
JSON-API: `GET /api/advisories`.

Start de app met Docker Compose op http://localhost:3005:

```
docker compose up --build
```

Compose gebruikt `PORT`, `REFRESH_MINUTES` en `FEED_URL` uit `.env` als die zijn ingesteld; anders worden poort 3005, 15 minuten en de standaard NCSC-feed gebruikt. Stop de app met `docker compose down`.
