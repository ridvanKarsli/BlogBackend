# Blog Backend - Deployment Guide

## 🐳 Docker Compose Deployment (Recommended)

### Full Stack One-Command Deployment

```bash
# Navigate to project root
cd /path/to/BlogBackend

# Start entire stack (PostgreSQL + Backend + Frontend)
docker-compose up --build

# Services will be available at:
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8080
# Swagger:   http://localhost:8080/swagger-ui.html
# Database:  localhost:5432 (postgres:postgres / 3519)
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Last N lines
docker-compose logs --tail 50 backend
```

### Stop & Clean Up

```bash
# Stop services (keep volumes)
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v

# Rebuild images
docker-compose up --build --force-recreate
```

---

## 🔄 Development Workflow

### Backend Development

```bash
# Terminal 1: PostgreSQL in Docker
docker run --name blog-postgres \
  -e POSTGRES_DB=blog_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=3519 \
  -p 5432:5432 \
  -d postgres:16-alpine

# Terminal 2: Backend dev server
cd /path/to/BlogBackend
./mvnw spring-boot:run

# Backend will reload on file changes (if you have spring-boot-devtools in pom.xml)
# Access: http://localhost:8080
```

### Frontend Development

```bash
# Terminal: Frontend dev server
cd /path/to/BlogBackend/frontend
npm install
npm run dev

# Frontend will reload on file changes
# Access: http://localhost:3000
```

### Database Migrations

Flyway runs automatically on backend startup:

```bash
# Check migration history
psql -h localhost -U postgres -d blog_db -c "SELECT * FROM flyway_schema_history;"

# Manual migration check (if needed)
./mvnw flyway:info
```

---

## 🔐 Environment Variables

### Backend (`application.properties` or Docker environment)

```properties
# Database (override defaults)
DB_HOST=db              # Container name in docker-compose
DB_PORT=5432
DB_NAME=blog_db
DB_USER=postgres
DB_PASSWORD=3519

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRATION=86400000  # 24 hours in milliseconds

# Media Upload
MEDIA_UPLOAD_DIR=/app/uploads

# Storage Type
STORAGE_TYPE=local  # or 's3' for AWS S3

# AWS S3 (if using S3 storage)
AWS_S3_BUCKET_NAME=your-bucket
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_BASE=http://localhost:8080
# or for docker-compose
NEXT_PUBLIC_API_BASE=http://backend:8080
```

---

## 📊 Database Backups

### PostgreSQL Backup & Restore

```bash
# Backup (while postgres is running)
docker-compose exec db pg_dump -U postgres blog_db > blog_db_backup.sql

# Restore
docker-compose exec -T db psql -U postgres blog_db < blog_db_backup.sql

# Backup with compression
docker-compose exec db pg_dump -U postgres -F c blog_db > blog_db_backup.dump

# Restore from compressed backup
docker-compose exec -T db pg_restore -U postgres -d blog_db blog_db_backup.dump
```

---

## 🔧 Troubleshooting Deployment Issues

### Port Conflicts

```bash
# Find process using port
lsof -i :8080      # Backend port
lsof -i :3000      # Frontend port
lsof -i :5432      # Database port

# Kill process
kill -9 <PID>

# Or use different ports in docker-compose.yml
# Change "8080:8080" to "9090:8080" for different host port
```

### Container Won't Start

```bash
# Check container logs
docker-compose logs backend

# Rebuild without cache
docker-compose build --no-cache backend

# Inspect running container
docker inspect blog-backend
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
docker-compose exec db psql -U postgres -d blog_db -c "SELECT NOW();"

# Reset database (careful!)
docker-compose down -v
docker-compose up --build
```

### Frontend Can't Connect to Backend

```bash
# Check CORS is enabled (backend logs should show CORS bean initialization)
docker-compose logs backend | grep -i cors

# Verify backend is running and accessible
curl http://localhost:8080/api/posts

# Test from frontend container
docker-compose exec frontend curl http://backend:8080/api/posts

# Check frontend environment
docker-compose exec frontend env | grep API_BASE
```

---

## 🚀 Production Deployment

### Pre-Production Checklist

- [ ] **Change JWT secret** to a strong, random value
- [ ] **Update database credentials** (remove hardcoded password 3519)
- [ ] **Enable HTTPS** (add reverse proxy like Nginx or Caddy)
- [ ] **Configure S3 storage** for media uploads (instead of local filesystem)
- [ ] **Set up logging** (send logs to CloudWatch, ELK, etc.)
- [ ] **Configure backups** (automated daily PostgreSQL dumps)
- [ ] **Enable rate limiting** on API endpoints (via Spring or Nginx)
- [ ] **Set resource limits** in Docker (memory, CPU)
- [ ] **Use secrets management** (AWS Secrets Manager, HashiCorp Vault, etc.)
- [ ] **Configure monitoring** (Prometheus + Grafana, DataDog, etc.)

### Option 1: AWS ECS Deployment

```bash
# Build and push images to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <aws-account>.dkr.ecr.us-east-1.amazonaws.com

docker tag blog-backend:latest <aws-account>.dkr.ecr.us-east-1.amazonaws.com/blog-backend:latest
docker tag blog-frontend:latest <aws-account>.dkr.ecr.us-east-1.amazonaws.com/blog-frontend:latest

docker push <aws-account>.dkr.ecr.us-east-1.amazonaws.com/blog-backend:latest
docker push <aws-account>.dkr.ecr.us-east-1.amazonaws.com/blog-frontend:latest

# Use AWS ECS task definitions and services (requires CloudFormation or Terraform)
```

### Option 2: Kubernetes Deployment

```bash
# Create namespace
kubectl create namespace blog

# Create ConfigMap for environment
kubectl create configmap blog-config \
  --from-literal=NEXT_PUBLIC_API_BASE=https://api.yourdomain.com \
  -n blog

# Create Secret for sensitive data
kubectl create secret generic blog-secret \
  --from-literal=DB_PASSWORD=<strong-password> \
  --from-literal=JWT_SECRET=<strong-secret> \
  -n blog

# Deploy using helm (requires helm chart - not provided in this repo)
# helm install blog ./helm-chart -n blog
```

### Option 3: Single Server (VPS) Deployment

```bash
# On your VPS:
1. Install Docker & Docker Compose
2. Clone repository
3. Update environment variables
4. Set up Nginx as reverse proxy
5. Enable HTTPS with Let's Encrypt
6. Set up automated backups

# Example nginx.conf:
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📈 Performance Monitoring

### Check Container Resource Usage

```bash
# CPU and memory usage
docker stats

# Specific container
docker stats blog-backend

# Persistent monitoring
docker stats --no-stream
```

### Database Performance

```bash
# Connect to PostgreSQL
docker-compose exec db psql -U postgres -d blog_db

# Show slow queries
SET log_statement = 'all';
SET log_duration = on;
SET log_min_duration_statement = 1000;  -- Log queries > 1 second

# Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables 
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# Index usage
SELECT schemaname, tablename, indexname 
FROM pg_indexes 
WHERE schemaname NOT IN ('pg_catalog', 'information_schema');
```

### Backend Performance

```bash
# Check Spring Boot Actuator (if enabled)
# http://localhost:8080/actuator/metrics

# View JVM memory
# http://localhost:8080/actuator/metrics/jvm.memory.used
```

---

## 🔄 Zero-Downtime Deployment

### Blue-Green Deployment Pattern

```bash
# Terminal 1: Start old version (blue)
docker-compose up

# Terminal 2: Prepare new version (green)
git pull origin main
docker-compose -f docker-compose.green.yml build
docker-compose -f docker-compose.green.yml up

# Switch traffic to green (update nginx upstream)
# Wait for verification
# Scale down blue
docker-compose down

# Alternatively, just re-run docker-compose with new code
docker-compose up --build -d
# Docker will recreate containers with new images
```

---

## 🛡️ Security Hardening

### Docker Security Best Practices

```yaml
# In docker-compose.yml for backend service
security_opt:
  - no-new-privileges:true
  
read_only_root_filesystem: true

volumes:
  - ./uploads:/app/uploads

deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M
    reservations:
      cpus: '0.5'
      memory: 256M
```

### Network Security

```bash
# Use internal network (only docker-compose services communicate)
docker network create blog-network

# Update docker-compose.yml to use named network
networks:
  blog-network:
    internal: true
```

### PostgreSQL Security

```sql
-- Create non-root user
CREATE USER blog_user WITH PASSWORD 'secure-password';
GRANT CONNECT ON DATABASE blog_db TO blog_user;
GRANT USAGE ON SCHEMA public TO blog_user;
GRANT CREATE ON SCHEMA public TO blog_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO blog_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO blog_user;

-- Revoke dangerous permissions
REVOKE SUPERUSER ON postgres FROM blog_user;
```

---

## 📝 Logs & Monitoring

### Centralized Logging (Docker)

```bash
# View combined logs with timestamps
docker-compose logs --timestamps -f

# Export logs to file
docker-compose logs --timestamps > all-logs.txt

# Follow specific container
docker-compose logs -f backend > backend-logs.txt &
docker-compose logs -f frontend > frontend-logs.txt &
docker-compose logs -f db > db-logs.txt &
```

### Setup Log Rotation

```bash
# Create /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}

# Restart Docker
sudo systemctl restart docker
```

---

## 🎯 Performance Optimization Tips

### Backend
1. **Connection Pooling**: HikariCP configured (max-pool-size: 10)
2. **Database Indexes**: GIN index for full-text search
3. **Query Optimization**: Pagination on list endpoints
4. **Caching**: Consider Redis for frequently accessed data

### Frontend
1. **Image Optimization**: Use next/image for automatic optimization
2. **Code Splitting**: Next.js automatically splits code by route
3. **Asset Compression**: Gzip/Brotli compression via nginx
4. **CDN**: Serve static assets from CloudFront or similar

### Database
1. **Backup Strategy**: Daily incremental backups
2. **Replication**: Set up PostgreSQL streaming replication for HA
3. **Monitoring**: Monitor query performance and connection count

---

## 📞 Support & Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `Connection refused` on port 8080 | Wait 30s for backend startup, check `docker-compose logs backend` |
| `CORS errors` | Verify CorsConfig bean in backend, check frontend origin in allowed list |
| `Database locked` | Stop all connections: `docker-compose down`, remove volume, restart |
| `JWT token invalid` | Clear cookies in browser, login again, verify JWT_SECRET matches |
| `Media upload failed` | Check `uploads/` directory permissions, increase volume size if full |
| `Frontend can't reach backend` | In docker: use `http://backend:8080`, locally: `http://localhost:8080` |

### Debug Commands

```bash
# Test backend health
curl -s http://localhost:8080/actuator/health | jq

# Test frontend connectivity
curl -s http://localhost:3000 | head -20

# Database connectivity test
docker-compose exec db psql -U postgres -d blog_db -c "SELECT NOW();"

# Check environment variables
docker-compose exec backend env | sort
docker-compose exec frontend env | sort
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)
- [Next.js Deployment Guide](https://nextjs.org/learn/pages-router/deploying-nextjs-app)

---

**Last Updated**: 2025  
**Status**: Production-Ready
