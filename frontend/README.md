# Frontend

Next.js + TypeScript + Tailwind CSS blog arayüzü.

## Geliştirme

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

`NEXT_PUBLIC_API_BASE=http://localhost:8080` (yerel backend için).

## Docker

Ana dizindeki `docker compose up --build` komutu frontend'i de başlatır. Docker ortamında `NEXT_PUBLIC_API_BASE` boş bırakılır; istekler Nginx üzerinden backend'e gider.

Detaylı bilgi için kök dizindeki [README.md](../README.md) dosyasına bakın.
