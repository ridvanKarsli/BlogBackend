# Blog Frontend

Next.js + TypeScript + Tailwind scaffold for BlogBackend.

Quick start:

```bash
cd frontend
npm install
npm run dev
```

Environment:
- `NEXT_PUBLIC_API_BASE` set backend base URL (e.g. `http://localhost:8080`)

Next steps:
- Run `npx shadcn-ui@latest init` inside `frontend` to add shadcn/ui components (optional).
- Implement login/logout using backend `/api/auth` endpoints (HttpOnly cookie used by backend).
- Build admin pages and connect to API using `axios` or `swr`.
