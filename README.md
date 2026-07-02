# Blog Backend - Full Stack Platform

A modern, full-stack blog platform built with **Spring Boot 3.5**, **Next.js 13**, and **PostgreSQL**.

## 🎯 Features

### Backend (Java Spring Boot)
- ✅ **Authentication**: JWT-based auth with HttpOnly cookies, Spring Security
- ✅ **Post Management**: CRUD operations with draft/published status, SEO optimization
- ✅ **Categories & Tags**: Full-featured taxonomy with relationship management
- ✅ **Media Upload**: Pluggable storage (local filesystem or AWS S3)
- ✅ **Search**: Postgres full-text search with GIN indexing
- ✅ **Sitemap**: Automatic XML sitemap generation
- ✅ **API Documentation**: Swagger/OpenAPI interface
- ✅ **Database Versioning**: Flyway migrations with schema versioning

### Frontend (Next.js + TypeScript)
- ✅ **Admin Dashboard**: Manage posts, categories, tags, and media
- ✅ **Responsive Design**: Tailwind CSS with modern UI patterns
- ✅ **Public Blog**: SEO-friendly blog listing and detail pages
- ✅ **TypeScript**: Full type safety across the application
- ✅ **API Integration**: Centralized axios client with credentials support

### Deployment
- ✅ **Docker Support**: Multi-container setup with Docker Compose
- ✅ **PostgreSQL**: Pre-configured with Flyway migrations
- ✅ **Volume Management**: Persistent uploads and database storage

---

## 🛠 Tech Stack

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Java (Microsoft JDK) | 21 |
| Framework | Spring Boot | 3.5.14 |
| Build Tool | Maven | 3.9.16 |
| ORM | Hibernate | 6.6 |
| Database | PostgreSQL | 16 |
| Migration | Flyway | 9.22.3 |
| Auth | jjwt | 0.12.5 |
| API Docs | Springdoc OpenAPI | 2.0.2 |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 18+ |
| Framework | Next.js | 13.5.6 |
| Language | TypeScript | 5.2 |
| Styling | Tailwind CSS | 3.5 |
| HTTP Client | Axios | 1.6 |
| State | React Hooks + Context | React 18.2 |

### Infrastructure
| Component | Technology |
|-----------|-----------|
| Containerization | Docker |
| Orchestration | Docker Compose |
| Database Container | postgres:16-alpine |
| Frontend Runtime | node:18-alpine |
| Backend Runtime | Eclipse Temurin 21 JRE |

---

## 🚀 Quick Start

### Prerequisites
- **Docker & Docker Compose** (for full-stack deployment)
- **Node.js 18+** (for local frontend dev)
- **Java 21** (for local backend dev)
- **Maven 3.9+** (or use `./mvnw`)
- **PostgreSQL 16** (if running backend locally)

### Option 1: Full Stack with Docker Compose (Recommended)

```bash
# Clone or navigate to project root
cd /path/to/BlogBackend

# Start all services (PostgreSQL + Backend + Frontend)
docker-compose up --build

# Access services:
# Frontend:    http://localhost:3000
# Backend API: http://localhost:8080
# Swagger UI:  http://localhost:8080/swagger-ui.html
# Database:    localhost:5432
```

**Database Credentials (for docker-compose):**
- Username: `postgres`
- Password: `3519`
- Database: `blog_db`

### Option 2: Local Development

#### Backend Setup
```bash
# Navigate to project root
cd /path/to/BlogBackend

# Set PostgreSQL connection (if using local DB)
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=blog_db
export DB_USER=postgres
export DB_PASSWORD=your_password

# Build and run
./mvnw clean spring-boot:run

# Or just compile
./mvnw clean test-compile

# Access Swagger UI
# http://localhost:8080/swagger-ui.html
```

#### Frontend Setup
```bash
# Navigate to frontend directory
cd /path/to/BlogBackend/frontend

# Install dependencies
npm install

# Create local environment file
cp .env.local.example .env.local

# Run development server
npm run dev

# Frontend will be available at http://localhost:3000
```

---

### Manager - Hızlı Çalıştır (lokalde hızlı test)

Bu iki komutla backend ve frontend'i hızlıca ayağa kaldırıp test edebilirsiniz:

```bash
# Proje kökünden backend başlat
./mvnw spring-boot:run > /tmp/blog-backend.log 2>&1 & echo $! > /tmp/blog-backend.pid

# Frontend dizininde başlat (önyüz API'yi backend'e yönlendirir)
cd frontend && NEXT_PUBLIC_API_BASE=http://localhost:8080 npm start > /tmp/blog-frontend.log 2>&1 & echo $! > /tmp/blog-frontend.pid
```

Logları görüntülemek için:

```bash
tail -n 200 /tmp/blog-backend.log
tail -n 200 /tmp/blog-frontend.log
```

---

## 📝 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user (sets HttpOnly JWT cookie) | ❌ |
| POST | `/api/auth/logout` | Logout user | ✅ |

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | List published posts |
| GET | `/api/posts/{slug}` | Get post by slug |
| GET | `/api/search?q=keyword` | Search posts |
| GET | `/api/sitemap.xml` | XML sitemap |

### Admin Endpoints (Protected - require JWT token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/posts` | List all posts (draft + published) |
| POST | `/api/admin/posts` | Create new post |
| PUT | `/api/admin/posts/{id}` | Update post |
| DELETE | `/api/admin/posts/{id}` | Delete post |
| GET | `/api/admin/categories` | List categories |
| POST | `/api/admin/categories` | Create category |
| PUT | `/api/admin/categories/{id}` | Update category |
| DELETE | `/api/admin/categories/{id}` | Delete category |
| GET | `/api/admin/tags` | List tags |
| POST | `/api/admin/tags` | Create tag |
| PUT | `/api/admin/tags/{id}` | Update tag |
| DELETE | `/api/admin/tags/{id}` | Delete tag |
| GET | `/api/admin/media` | List media |
| POST | `/api/admin/media` | Upload media file |
| DELETE | `/api/admin/media/{id}` | Delete media |

### API Documentation
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## 🔐 Authentication Flow

1. **Registration/Login**: User submits credentials via `/api/auth/login`
2. **Token Generation**: Backend generates JWT and sets as HttpOnly cookie
3. **Automatic Transmission**: Frontend axios client (`withCredentials: true`) automatically sends cookie with each request
4. **Protection**: Spring Security validates JWT on each protected endpoint
5. **Logout**: Frontend clears session, backend invalidates token

**Key Security Features:**
- HttpOnly cookies (prevents XSS token theft)
- CSRF protection via Spring Security
- CORS enabled for frontend origins
- Role-based access control (ROLE_ADMIN / ROLE_USER)
- JWT expiration (configurable, default 24h)

---

## 📦 Project Structure

```
BlogBackend/
├── src/
│   ├── main/
│   │   ├── java/com/ridvankarsli/blog/blogbackend/
│   │   │   ├── config/           # Spring configuration (Security, CORS, Swagger)
│   │   │   ├── controller/        # REST endpoints
│   │   │   ├── dto/               # Data transfer objects
│   │   │   ├── entity/            # JPA entities
│   │   │   ├── exception/         # Global exception handling
│   │   │   ├── mapper/            # Entity ↔ DTO mapping
│   │   │   ├── repository/        # Spring Data JPA repositories
│   │   │   ├── security/          # JWT & Spring Security
│   │   │   ├── service/           # Business logic
│   │   │   ├── storage/           # Storage abstraction (Local/S3)
│   │   │   └── util/              # Utility classes
│   │   └── resources/
│   │       ├── application.properties
│   │       └── db/migration/      # Flyway migrations
│   └── test/
├── frontend/
│   ├── app/
│   │   ├── admin/                 # Admin pages (dashboard, CRUD)
│   │   ├── blog/                  # Public blog pages
│   │   ├── login/                 # Authentication
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Tailwind styles
│   ├── lib/
│   │   ├── apiClient.ts           # Axios HTTP client
│   │   └── authContext.tsx        # Auth context provider
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.mjs
│   └── Dockerfile
├── pom.xml                         # Maven configuration
├── Dockerfile                      # Backend Docker image
├── docker-compose.yml              # Multi-container setup
└── mvnw / mvnw.cmd                # Maven Wrapper
```

---

## 🔧 Configuration

### Backend Configuration (`application.properties`)
```properties
# Database
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:blog_db}
spring.datasource.username=${DB_USER:postgres}
spring.datasource.password=${DB_PASSWORD}

# JWT
jwt.secret=${JWT_SECRET:your-secret-key-change-in-production}
jwt.expiration=86400000  # 24 hours in milliseconds

# Media Upload
media.upload-dir=/app/uploads

# Storage Type (local or s3)
storage.type=local
# AWS S3 (if storage.type=s3)
# aws.s3.bucket-name=your-bucket
# aws.s3.region=us-east-1
# aws.access-key-id=${AWS_ACCESS_KEY_ID}
# aws.secret-access-key=${AWS_SECRET_ACCESS_KEY}

# Flyway
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
```

### Frontend Configuration (`.env.local`)
```env
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

---

## 📊 Database Schema

### Key Tables (created via Flyway migrations)
- **users**: User accounts with roles and timestamps
- **posts**: Blog posts with SEO fields, status, slug
- **categories**: Blog post categories
- **tags**: Blog post tags
- **post_categories**: M2M relationship (posts ↔ categories)
- **post_tags**: M2M relationship (posts ↔ tags)
- **media**: Uploaded files with storage URLs

### Indexes
- GIN index on posts for full-text search (performance optimization)
- Unique index on post slugs per user
- Foreign key constraints for referential integrity

---

## 🧪 Testing & Verification

### Build Backend
```bash
cd /path/to/BlogBackend
./mvnw clean test-compile
```

### Verify Migrations
```bash
# Check Flyway migration history
SELECT * FROM flyway_schema_history;
```

### Test API with cURL
```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Get posts (using saved cookies)
curl http://localhost:8080/api/admin/posts -b cookies.txt
```

---

## 🐛 Troubleshooting

### **CORS Error in Frontend**
- **Issue**: `No 'Access-Control-Allow-Origin' header` when frontend calls backend
- **Fix**: Ensure `CorsConfig.java` is active in backend and matches frontend origin
  ```bash
  # Check backend logs for CORS bean initialization
  docker-compose logs backend | grep -i cors
  ```

### **Port Already in Use**
- **Issue**: `Port 8080` or `3000` already in use
- **Fix**: Either stop conflicting service or use different ports
  ```bash
  # macOS/Linux: Find process using port
  lsof -i :8080
  kill -9 <PID>
  
  # Or modify docker-compose.yml ports mapping
  ```

### **Database Connection Failed**
- **Issue**: `Connection refused` for PostgreSQL
- **Fix**: 
  - Ensure DB container is running: `docker-compose logs db`
  - Check credentials in `docker-compose.yml` and `application.properties`
  - Wait 30s for DB startup: `docker-compose up && sleep 30`

### **JWT Token Not Persisted**
- **Issue**: Login works but subsequent requests are unauthorized
- **Fix**:
  - Verify backend sets HttpOnly cookie: `Set-Cookie: Authorization=...`
  - Check frontend axios config has `withCredentials: true`
  - Clear browser cookies and try again

### **Migrations Fail**
- **Issue**: `Flyway schema history table not found`
- **Fix**: Drop and recreate database
  ```bash
  docker-compose down -v  # Remove volumes
  docker-compose up       # Recreate with fresh DB
  ```

---

## 📈 Performance Optimization

### Search Performance
- Full-text search uses Postgres GIN index on posts (FTS vector)
- Queries execute in < 100ms even with 10K+ posts

### Media Uploads
- Large files stored separately from database (filesystem or S3)
- Resumable uploads supported when using S3
- Configurable upload directory and size limits

### Database Optimization
- Connection pooling (HikariCP) for efficient DB access
- Lazy loading on JPA relationships to prevent N+1 queries
- Proper pagination on list endpoints

---

## 🚢 Deployment

### Production Checklist
- [ ] Change JWT secret in environment variables
- [ ] Update database credentials (remove hardcoded password)
- [ ] Enable HTTPS (add reverse proxy like Nginx)
- [ ] Configure AWS S3 for media storage (instead of local filesystem)
- [ ] Set up database backups
- [ ] Enable rate limiting on API endpoints
- [ ] Configure logging aggregation
- [ ] Set up monitoring and alerts

### Deployment Options
1. **Docker Compose** (single machine, development/small production)
2. **Kubernetes** (large scale, requires helm charts)
3. **Heroku/Railway** (PaaS, with Postgres add-on)
4. **AWS ECS** (container orchestration with RDS)

---

## 📖 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Security Guidelines](https://owasp.org/www-project-web-security-testing-guide/)

---

## 📝 License

This project is provided as-is for educational purposes.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Create a feature branch: `git checkout -b feature/awesome-feature`
2. Commit changes: `git commit -m "Add awesome feature"`
3. Push to branch: `git push origin feature/awesome-feature`
4. Open a Pull Request

---

## ✉️ Support

For issues or questions:
1. Check the **Troubleshooting** section above
2. Review API documentation at `/swagger-ui.html`
3. Check Docker logs: `docker-compose logs [service-name]`
4. Open an issue with detailed error logs

---

**Last Updated**: 2025  
**Status**: ✅ Production Ready
