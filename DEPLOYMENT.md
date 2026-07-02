# Dağıtım

## Docker

```bash
docker compose up --build -d
```

Servisler: postgres, backend (8080), frontend (3000), minio, nginx (80).

```bash
docker compose ps
docker compose logs -f backend
docker compose down
docker compose down -v    # db'yi de siler
```

## Yedek

```bash
docker compose exec db pg_dump -U postgres blog_db > backup.sql
docker compose exec -T db psql -U postgres blog_db < backup.sql
```

## Prod öncesi

- JWT secret ve db şifresini değiştir
- HTTPS ekle
- `SITE_BASE_URL` gerçek domain olsun
- MinIO yerine R2/S3 kullanabilirsin

## Sık takılan yerler

| Sorun | Ne yap |
|-------|--------|
| Backend ayağa kalkmıyor | `docker compose ps`, db healthy mi bak |
| Frontend API'ye gitmiyor | Docker'da `NEXT_PUBLIC_API_BASE` boş kalmalı |
| Görsel açılmıyor | nginx `/media/` ve minio bucket kontrol et |
