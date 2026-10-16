# Bug Loop Deployment Guide

This guide covers various deployment options for the Bug Loop system.

## Table of Contents

1. [Docker Deployment](#docker-deployment)
2. [Manual Server Deployment](#manual-server-deployment)
3. [Cloud Platforms](#cloud-platforms)
4. [Environment Configuration](#environment-configuration)
5. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Docker Deployment

### Quick Start with Docker Compose

The easiest way to deploy Bug Loop is using Docker Compose:

```bash
# 1. Create .env file with your credentials
cp .env.example .env
# Edit .env and add your API keys

# 2. Start services
docker-compose up -d

# 3. Check logs
docker-compose logs -f bug-loop

# 4. Check health
curl http://localhost:3000/health
```

### Docker Commands

```bash
# Build image
docker build -t bugloop:latest .

# Run container
docker run -d \
  --name bugloop \
  -p 3000:3000 \
  --env-file .env \
  bugloop:latest

# View logs
docker logs -f bugloop

# Stop container
docker stop bugloop

# Remove container
docker rm bugloop
```

### Production Docker Setup

For production, use separate services:

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: bugloop
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: bugloop
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    restart: always
    networks:
      - bugloop-network

  bug-loop:
    image: bugloop:latest
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://bugloop:${POSTGRES_PASSWORD}@postgres:5432/bugloop
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    volumes:
      - ./logs:/app/logs
    restart: always
    networks:
      - bugloop-network
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - bug-loop
    restart: always
    networks:
      - bugloop-network

volumes:
  postgres_data:

networks:
  bugloop-network:
    driver: bridge
```

---

## Manual Server Deployment

### Prerequisites

- Ubuntu 22.04 LTS (or similar)
- Node.js 20+
- PostgreSQL 15+
- Nginx (optional, for reverse proxy)
- PM2 (for process management)

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 globally
sudo npm install -g pm2
```

### Step 2: Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE bugloop;
CREATE USER bugloop WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE bugloop TO bugloop;
\q
```

### Step 3: Application Deployment

```bash
# Create app directory
sudo mkdir -p /var/www/bugloop
sudo chown $USER:$USER /var/www/bugloop

# Clone or copy your code
cd /var/www/bugloop
# (upload your code here)

# Install dependencies
npm ci --omit=dev

# Build application
npm run build

# Create .env file
nano .env
# (add your configuration)

# Create logs directory
mkdir -p logs

# Test the application
npm start
# (Ctrl+C to stop)
```

### Step 4: Process Management with PM2

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'bug-loop',
    script: './dist/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G',
    watch: false
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# (follow the instructions)

# Monitor
pm2 monit
```

### Step 5: Nginx Reverse Proxy

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/bugloop

# Add this configuration:
```

```nginx
server {
    listen 80;
    server_name bugloop.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Increase timeout for long-running AI operations
    proxy_read_timeout 300s;
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/bugloop /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 6: SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d bugloop.yourdomain.com

# Auto-renewal is set up automatically
# Test renewal
sudo certbot renew --dry-run
```

---

## Cloud Platforms

### AWS Deployment

#### Option 1: EC2

1. Launch EC2 instance (t3.medium or larger)
2. Follow manual server deployment steps above
3. Configure security group:
   - Port 22 (SSH)
   - Port 80 (HTTP)
   - Port 443 (HTTPS)
4. Use RDS for PostgreSQL
5. Use SES for email

#### Option 2: ECS with Fargate

```yaml
# task-definition.json
{
  "family": "bugloop",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions": [
    {
      "name": "bugloop",
      "image": "your-ecr-repo/bugloop:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "ANTHROPIC_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:..."
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/bugloop",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Google Cloud Platform

#### Cloud Run Deployment

```bash
# Build and push image
gcloud builds submit --tag gcr.io/PROJECT_ID/bugloop

# Deploy to Cloud Run
gcloud run deploy bugloop \
  --image gcr.io/PROJECT_ID/bugloop \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production \
  --set-secrets ANTHROPIC_API_KEY=anthropic-key:latest \
  --min-instances 1 \
  --max-instances 10 \
  --memory 2Gi \
  --timeout 300s
```

### Azure

#### App Service Deployment

```bash
# Create resource group
az group create --name bugloop-rg --location eastus

# Create App Service plan
az appservice plan create \
  --name bugloop-plan \
  --resource-group bugloop-rg \
  --sku B2 \
  --is-linux

# Create web app
az webapp create \
  --name bugloop \
  --resource-group bugloop-rg \
  --plan bugloop-plan \
  --runtime "NODE:20-lts"

# Configure environment variables
az webapp config appsettings set \
  --name bugloop \
  --resource-group bugloop-rg \
  --settings NODE_ENV=production

# Deploy code
az webapp deployment source config-zip \
  --name bugloop \
  --resource-group bugloop-rg \
  --src bugloop.zip
```

### Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create bugloop

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:standard-0

# Set environment variables
heroku config:set ANTHROPIC_API_KEY=your-key
heroku config:set GITHUB_TOKEN=your-token
# ... (set all required env vars)

# Deploy
git push heroku main

# Scale
heroku ps:scale web=2
```

### DigitalOcean

#### App Platform Deployment

1. Create new app in DigitalOcean App Platform
2. Connect your GitHub repository
3. Configure:
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Port: 3000
4. Add managed PostgreSQL database
5. Set environment variables
6. Deploy

---

## Environment Configuration

### Production Environment Variables

```bash
# Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DATABASE_SSL=true
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# APIs
ANTHROPIC_API_KEY=sk-ant-...
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=your-org
GITHUB_REPO=your-repo
GITHUB_WEBHOOK_SECRET=strong-secret-here

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxx
EMAIL_FROM=bugs@yourdomain.com

# Features
AUTO_MERGE_ENABLED=false
MAX_FIX_ATTEMPTS=3
TEST_COMMAND=npm test
BUILD_COMMAND=npm run build
REPO_PATH=/var/www/repo

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Secret Management

#### Using AWS Secrets Manager

```typescript
// Add to src/config/secrets.ts
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

export async function getSecret(secretName: string): Promise<string> {
  const client = new SecretsManagerClient({ region: process.env.AWS_REGION });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: secretName })
  );
  return response.SecretString || '';
}
```

---

## Monitoring & Maintenance

### Health Checks

```bash
# Basic health check
curl https://bugloop.yourdomain.com/health

# Detailed health check (implement this endpoint)
curl https://bugloop.yourdomain.com/health/detailed
```

### Logging

```bash
# PM2 logs
pm2 logs bug-loop

# Application logs
tail -f /var/www/bugloop/logs/combined.log

# Error logs
tail -f /var/www/bugloop/logs/error.log

# Docker logs
docker-compose logs -f bug-loop
```

### Database Backups

```bash
# Create backup script
cat > /usr/local/bin/backup-bugloop.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/bugloop"
mkdir -p $BACKUP_DIR

pg_dump -U bugloop -h localhost bugloop | gzip > $BACKUP_DIR/bugloop_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "bugloop_*.sql.gz" -mtime +30 -delete
EOF

chmod +x /usr/local/bin/backup-bugloop.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-bugloop.sh") | crontab -
```

### Performance Monitoring

Consider integrating:

- **New Relic**: Application performance monitoring
- **Datadog**: Infrastructure and application monitoring
- **Sentry**: Error tracking and performance monitoring
- **Prometheus + Grafana**: Metrics and dashboards

### Updates & Maintenance

```bash
# Update application (with PM2)
cd /var/www/bugloop
git pull
npm ci --omit=dev
npm run build
pm2 reload ecosystem.config.js

# Database migrations (if needed)
npm run migrate

# Check status
pm2 status
```

### Security Best Practices

1. **Regular Updates**: Keep Node.js, PostgreSQL, and all dependencies updated
2. **Firewall**: Use UFW or security groups to restrict access
3. **SSL/TLS**: Always use HTTPS in production
4. **Environment Variables**: Never commit secrets to version control
5. **Rate Limiting**: Implement rate limiting on API endpoints
6. **Authentication**: Add authentication to the bug submission endpoint
7. **Input Validation**: Validate all user inputs
8. **Database Security**: Use strong passwords, enable SSL connections
9. **Monitoring**: Set up alerts for suspicious activity
10. **Backups**: Regular automated backups with tested restore procedures

---

## Troubleshooting

### Application won't start

```bash
# Check logs
pm2 logs bug-loop --lines 100

# Check environment variables
pm2 env 0

# Restart
pm2 restart bug-loop
```

### Database connection issues

```bash
# Test database connection
psql -U bugloop -h localhost -d bugloop

# Check PostgreSQL status
sudo systemctl status postgresql
```

### High memory usage

```bash
# Check memory
pm2 monit

# Restart if needed
pm2 restart bug-loop --update-env
```

### Webhook not receiving events

1. Check GitHub webhook delivery history
2. Verify webhook URL is accessible
3. Check webhook secret matches
4. Review application logs

---

## Support

For deployment issues:
- Check logs first
- Review QUICKSTART.md for basic setup
- Consult ARCHITECTURE.md for system design
- Open GitHub issue for bugs

---

Built with Claude AI by the Civet Team
