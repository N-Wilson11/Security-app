# Security-app

Node.js-dashboard met recente beveiligingsadvisories van het NCSC (RSS-feed), inclusief advies om de kwetsbaarheid tegen te gaan.

```
npm start        # http://localhost:3000
npm test
```

Configuratie via omgevingsvariabelen: `PORT` (3000), `REFRESH_MINUTES` (15, hoe vaak de feed wordt ververst), `FEED_URL`.
JSON-API: `GET /api/advisories`.
