# 4D Results portal

This folder is the deployable application. Configure Vercel with **Root Directory** set to `portal`; files in the repository root are then excluded from the build and deployment.

## Local development

```powershell
npm install
npm run dev
```

Open `http://127.0.0.1:3000`. The draw-history artifact is generated from the repository root with:

```powershell
python tools/build_web_data.py
```

## Search analytics database

Create a PostgreSQL database, run `db/schema.sql`, and set `DATABASE_URL`. The API stores only:

- a random browser-tab session UUID;
- one to three manually entered four-digit numbers;
- interface language;
- server timestamp and an idempotency UUID.

It does not store IP addresses or user agents. Slider and Feeling Lucky activity never calls the logging endpoint. Search logging is non-blocking, so results continue to work if the database is unavailable.

Set `CRON_SECRET` for the protected `/api/maintenance/purge-searches` endpoint. Phase 7 will schedule this endpoint on Vercel; it deletes records older than 90 days.
