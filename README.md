# Security-app

## Deploying to Vercel

The dashboard is served as a static site and `/api/advisories` runs as a Vercel Function.

1. Push this repository to GitHub and import it in Vercel via **Add New → Project**.
2. Keep the project root at the repository root and choose **Other** if Vercel asks for a framework. `vercel.json` sets the output directory to `public`; the API function in `api/` is detected automatically.
3. Optionally set `FEED_URL` and `REFRESH_MINUTES` under **Settings → Environment Variables**. Without them the app uses the default NCSC feed and a 15-minute refresh interval.
4. Click **Deploy**.

You can also use the Vercel CLI: run `vercel` in the repository root and follow the prompts.
