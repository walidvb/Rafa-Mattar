# Strapi CMS

Content types:
- **Page** — gallery pages (Stills, Films, etc.)
- **shared.og** — Open Graph fields per page
- **shared.media-item** — ordered images or video URLs

## Local development

```bash
cd cms
npm run develop
```

Admin panel: http://localhost:1337/admin

## Strapi Cloud deployment

1. Connect this repo at [cloud.strapi.io](https://cloud.strapi.io)
2. Set **Base directory** to `cms`
3. After deploy, create admin user and API tokens

## MCP (Cursor)

MCP is enabled in `config/server.ts`. Create an Admin API token in Strapi admin, then update `/.cursor/mcp.json` with your Cloud URL and token.

## API

- `GET /api/pages` — list pages
- `GET /api/pages?filters[slug][$eq]=films&populate[og][populate]=image&populate[items][populate]=image` — single page with media

Public `find` / `findOne` permissions for Page are enabled on bootstrap. For production, prefer a read-only API token via `STRAPI_API_TOKEN`.
