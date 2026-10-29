# Security-app

## Deployen op Vercel

De dashboardpagina wordt als statische site aangeboden en `/api/advisories` draait als Vercel Function.

1. Push deze repository naar GitHub en importeer hem via **Add New → Project** in Vercel.
2. Laat de projectroot op de repository-root staan en kies **Other** als Vercel om een framework vraagt. `vercel.json` stelt de uitvoermap in op `public`; de API-functie in `api/` wordt automatisch herkend.
3. Stel eventueel `FEED_URL` en `REFRESH_MINUTES` in bij **Settings → Environment Variables**. Zonder instellingen gebruikt de app de standaard NCSC-feed en een verversinterval van 15 minuten.
4. Klik op **Deploy**.

Je kunt ook de Vercel CLI gebruiken: voer `vercel` uit in de repository-root en volg de aanwijzingen.
