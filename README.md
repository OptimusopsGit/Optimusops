# Optimus website

Static React + Vite site. Deploys to Netlify, Vercel, Cloudflare Pages, or any static host with no extra setup.

## Local development

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve dist/ locally
```

## Environment variable

| Name | Purpose |
|---|---|
| `VITE_WEB3FORMS_KEY` | Web3Forms access key for the contact form. Without it the form shows a setup error. |

Locally: copy `.env.example` to `.env.local` and fill it in (it is git-ignored).
On the host: add it in the project's environment settings, then redeploy (Vite bakes it in at build time).

## Deploy

Push this folder as the root of a Git repo, then import it:

- **Netlify** – settings come from `netlify.toml` (build `npm run build`, publish `dist`, SPA fallback).
- **Vercel** – settings come from `vercel.json` (framework Vite, output `dist`, SPA rewrite).
- **Cloudflare Pages / others** – build command `npm run build`, output directory `dist`. `public/_redirects` handles SPA routing on hosts that support it.

## Launch checklist

- Replace `CONTACT_EMAIL`, `CONTACT_PHONE`, `LINKEDIN_URL`, `X_URL` placeholders in `src/App.tsx`.
- Replace `YOUR_DOMAIN` in `public/robots.txt` and `public/sitemap.xml`.
