# Test MCP registry

Static mirror of the default GitHub MCP Registry for testing an organization registry URL.

The list response under [`docs/v0.1/servers`](docs/v0.1/servers) is synchronized daily from:

```text
https://api.mcp.github.com/v0.1/servers
```

Run a manual sync with:

```bash
node scripts/sync-registry.mjs
```

## GitHub Pages

Pages publishes `main` and `/docs`. Use the published site URL as the Copilot MCP Registry URL. The list endpoint is:

```text
<PAGES_URL>/v0.1/servers
```

Only files under [`docs/`](docs/) are published. This prototype mirrors the list endpoint only; it does not implement version-detail routes.
