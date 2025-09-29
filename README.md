This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:


You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Backend integration / Auth

This frontend ships with simple API proxy routes under `src/app/api/auth/*` which forward requests to a backend API.

- Set the backend base URL in `.env` (already present in repo):

	BACKEND_API_URL=https://sports-pass-app-backend.onrender.com/api

- The app persists an authentication token in `localStorage` under `authToken` and the current user under `clubOwner`.

- Auth flows are centralized in `src/context/AuthContext.tsx`. It exposes `login`, `signup`, `logout`, and `user` for use across the UI.

- To run locally:

```powershell
# install deps
npm install

# run dev
npm run dev
```

If you change the backend URL update `.env` or set `BACKEND_API_URL` in your deployment environment.
