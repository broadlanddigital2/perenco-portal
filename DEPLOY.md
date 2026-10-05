# Deploying Perenco Portal (v27) to perenco-portal.com

Prerequisite: perenco-portal.com is added as a zone in the same Cloudflare account.

From this folder:

    npx wrangler login
    npx wrangler secret put SENDGRID_API_KEY     # first deploy only
    npx wrangler deploy

This creates the Worker "perenco-portal", uploads dist/client as static assets,
and attaches perenco-portal.com and www.perenco-portal.com as custom domains.
