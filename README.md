# BlogBackend

Kişisel blog projesi. Backend Spring Boot, arayüz Next.js.

## Ne var?

- Giriş / kayıt (JWT, HttpOnly cookie)
- Admin panel: yazı, kategori, etiket, medya
- Public blog sayfaları
- PostgreSQL FTS arama
- MinIO ile görsel depolama
- Docker Compose + Nginx

## Çalıştırma

```bash
docker compose up --build
```

Site: http://localhost  
Swagger: http://localhost/swagger-ui/index.html

İlk admin: `admin@blog.local` / `Admin123!`

## Yerelde geliştirme

Backend:
```bash
export DB_HOST=localhost DB_PORT=5432 DB_NAME=blog_db DB_USER=postgres DB_PASS=3519
./mvnw spring-boot:run
```

Frontend:
```bash
cd frontend
npm install
cp .env.local.example .env.local   # NEXT_PUBLIC_API_BASE=http://localhost:8080
npm run dev
```

## API

Public:
- `GET /api/posts` — yayınlanan yazılar
- `GET /api/posts/{slug}`
- `GET /api/search?q=`
- `GET /sitemap.xml`

Auth:
- `POST /api/auth/login`, `/logout`, `/register`
- `GET /api/auth/me`

Admin (`/api/admin/**`, cookie gerekli):
- yazı, kategori, etiket, medya CRUD

Detay için Swagger'a bak.

## Klasörler

```
src/           Spring Boot
frontend/      Next.js
nginx/         reverse proxy
docker-compose.yml
```

## Ayarlar

`application.properties` veya docker-compose env:

- `JWT_SECRET` — üretimde mutlaka değiştir
- `STORAGE_TYPE` — `local` veya `s3`
- `STORAGE_ENDPOINT`, `STORAGE_BUCKET` — MinIO/S3
- `SITE_BASE_URL` — sitemap için

Dağıtım notları: [DEPLOYMENT.md](DEPLOYMENT.md)
