# Deployment Guide - Frankenstein Story Generator

Complete guide for deploying the Frankenstein Story Generator to production.

## Prerequisites

- API Keys:
  - Anthropic Claude API key
  - Stability AI API key
  - ElevenLabs API key
- Cloud accounts (choose one):
  - AWS
  - Google Cloud Platform
  - Azure
  - Heroku
  - DigitalOcean

## Backend Deployment

### Option 1: Docker (Recommended)

1. **Create Dockerfile** (backend/Dockerfile):
```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/story-generator-1.0.0-SNAPSHOT.jar app.jar

ENV ANTHROPIC_API_KEY=""
ENV STABILITY_API_KEY=""
ENV ELEVENLABS_API_KEY=""
ENV STORAGE_ROOT="/app/storage"

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

2. **Build and run**:
```bash
docker build -t frankenstein-backend .
docker run -p 8080:8080 \
  -e ANTHROPIC_API_KEY=your-key \
  -e STABILITY_API_KEY=your-key \
  -e ELEVENLABS_API_KEY=your-key \
  -v $(pwd)/storage:/app/storage \
  frankenstein-backend
```

3. **Deploy to cloud**:
   - AWS ECS
   - Google Cloud Run
   - Azure Container Instances
   - DigitalOcean App Platform

### Option 2: JAR Deployment

1. **Build**:
```bash
cd backend
mvn clean package -DskipTests
```

2. **Deploy JAR**:
```bash
java -jar target/story-generator-1.0.0-SNAPSHOT.jar \
  --spring.ai.anthropic.api-key=your-key \
  --api.stability.key=your-key \
  --api.elevenlabs.key=your-key \
  --storage.root=/path/to/storage
```

### Option 3: Heroku

1. **Create heroku.yml**:
```yaml
build:
  docker:
    web: Dockerfile
```

2. **Deploy**:
```bash
heroku create frankenstein-backend
heroku config:set ANTHROPIC_API_KEY=your-key
heroku config:set STABILITY_API_KEY=your-key
heroku config:set ELEVENLABS_API_KEY=your-key
git push heroku main
```

### Environment Variables

Required:
- `ANTHROPIC_API_KEY` - Claude API key
- `STABILITY_API_KEY` - Stability AI key
- `ELEVENLABS_API_KEY` - ElevenLabs key

Optional:
- `STORAGE_ROOT` - File storage location (default: ./storage)
- `SERVER_PORT` - Server port (default: 8080)
- `ELEVENLABS_VOICE_ID` - Voice ID (default: 21m00Tcm4TlvDq8ikWAM)

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
cd frontend
vercel --prod
```

3. **Configure environment**:
   - In Vercel dashboard, add environment variables:
   - `VITE_API_BASE_URL` = your backend URL + /api
   - `VITE_WS_URL` = your backend URL + /ws/story-progress

### Option 2: Netlify

1. **Build**:
```bash
cd frontend
npm run build
```

2. **Deploy**:
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

3. **Configure**:
   - Add environment variables in Netlify dashboard
   - Add `_redirects` file for SPA routing:
   ```
   /*    /index.html   200
   ```

### Option 3: AWS S3 + CloudFront

1. **Build**:
```bash
npm run build
```

2. **Upload to S3**:
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

3. **Configure CloudFront**:
   - Create distribution
   - Point to S3 bucket
   - Add custom error responses for SPA routing

### Option 4: Static Hosting

Deploy `dist/` folder to:
- GitHub Pages
- Firebase Hosting
- Surge
- Render

## Database Migration (Optional Future)

For scaling beyond file storage:

### PostgreSQL Setup

1. **Update pom.xml**:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>
```

2. **Configure**:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/frankenstein
    username: user
    password: pass
  jpa:
    hibernate:
      ddl-auto: update
```

## Object Storage (Optional Future)

For scaling file storage:

### AWS S3

1. **Add dependency**:
```xml
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
</dependency>
```

2. **Configure**:
```yaml
aws:
  s3:
    bucket: frankenstein-stories
    region: us-east-1
```

## CDN Configuration

### CloudFront for Assets

1. **Create distribution**
2. **Point to backend** for `/api/stories/*/assets/*`
3. **Set cache policies**:
   - Images: 1 year
   - Audio: 1 year
   - Metadata: No cache

## Monitoring & Logging

### Spring Boot Actuator

Endpoints enabled:
- `/actuator/health` - Health check
- `/actuator/info` - App info
- `/actuator/metrics` - Metrics

### Application Monitoring

Consider:
- **New Relic** - APM
- **Datadog** - Metrics & logs
- **Sentry** - Error tracking
- **LogDNA** - Log management

### Setup Example (Sentry)

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-spring-boot-starter</artifactId>
</dependency>
```

```yaml
sentry:
  dsn: your-sentry-dsn
  traces-sample-rate: 1.0
```

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**: AWS ALB, GCP Load Balancer
2. **Session Management**: Redis for WebSocket sessions
3. **File Storage**: Move to S3/GCS
4. **Database**: PostgreSQL or MongoDB

### Vertical Scaling

Recommended specs:
- **Development**: 2 vCPU, 4GB RAM
- **Production**: 4 vCPU, 8GB RAM
- **High Traffic**: 8 vCPU, 16GB RAM

### Caching

Add Redis:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

Cache:
- Generated stories (1 hour)
- API responses (5 minutes)

## Security Checklist

- [ ] API keys in environment variables
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] Error messages don't expose internals
- [ ] File upload limits enforced
- [ ] Authentication (if adding user accounts)

## Cost Optimization

### AI API Costs

- **Claude**: ~$0.015 per story (4K tokens)
- **Stability AI**: ~$0.08 per story (8 images)
- **ElevenLabs**: ~$0.30 per story (narration)
- **Total per story**: ~$0.40

### Cloud Costs

- **Backend**: $20-50/month (small instance)
- **Storage**: $1-10/month (first 1000 stories)
- **Frontend**: $0 (static hosting)
- **Total**: ~$25-70/month

### Optimization Tips

1. **Cache AI responses** (save 50%)
2. **Use cheaper AI tiers** when available
3. **Compress images** (save storage)
4. **Use CDN** (reduce bandwidth)

## Continuous Deployment

### GitHub Actions Example

`.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '21'
      - run: mvn package
      - run: docker build -t frankenstein-backend .
      - run: docker push your-registry/frankenstein-backend

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: vercel --prod
```

## Health Checks

### Backend
```bash
curl http://your-backend/actuator/health
```

### Frontend
```bash
curl http://your-frontend
```

## Backup Strategy

### File Storage
- Daily backups of storage directory
- Retention: 30 days
- Automated via cron or cloud backup

### Database (if using)
- Automated daily backups
- Point-in-time recovery enabled
- Cross-region replication for HA

## Rollback Plan

1. **Backend**: Revert to previous Docker image
2. **Frontend**: Revert deployment in Vercel/Netlify
3. **Database**: Restore from backup
4. **Verification**: Run smoke tests

## Support Contacts

- Backend issues: Check logs, Actuator endpoints
- Frontend issues: Check browser console
- API issues: Monitor API provider status pages

## Post-Deployment Checklist

- [ ] Health endpoints responding
- [ ] WebSocket connection working
- [ ] Story generation completing
- [ ] Images loading
- [ ] Audio playing
- [ ] Monitoring active
- [ ] Backups configured
- [ ] DNS configured
- [ ] SSL certificate valid
- [ ] Error tracking active

---

**Deployment Complete!** 🚀

Your Frankenstein Story Generator is now live and ready to create magical stories!
