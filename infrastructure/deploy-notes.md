# Infrastructure Deploy Notes

## Cloudflare Worker API

1. Create a Worker at dash.cloudflare.com → Workers & Pages → Create Worker
2. Paste `worker-api.mjs` into the editor
3. Add D1 binding: variable name `DB`, select your database
4. Add secrets:
   - `API_TOKEN` — your bearer token (make up a long random string)
   - `ANTHROPIC_API_KEY` — your Claude API key (for transcript extraction endpoint)
5. Deploy and note the URL

### After redeployment
Worker secrets must be re-set after PUT-based redeployments. If auth stops working after a deploy, re-set `API_TOKEN`.

## Netlify Dashboard

1. Create a site at app.netlify.com
2. Manual deploy — drag and drop your `index.html`
3. Netlify serves `index.html` by default

### Gotcha
If using CLI deploys, always verify the file content before deploying. Prior deploys can silently upload the wrong file.

## D1 Database

Create via dash.cloudflare.com → Workers & Pages → D1 → Create Database. Run the SQL in `schema.sql` in the D1 console to create tables.
