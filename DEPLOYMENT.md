# Deployment Guide - Astro SSR on GCP VM with Nginx

## Prerequisites
- GCP VM instance with Ubuntu
- Node.js 18+ installed
- Nginx installed
- Domain configured (wudmc.com)

## Step 1: Install Node.js on VM

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

## Step 2: Deploy Application

```bash
# Clone repository
cd /var/www
sudo git clone git@github.com:WuDMC/wudmc.com.git
cd wudmc.com

# Install dependencies
npm install

# Build the application
npm run build

# The build output will be in dist/
```

## Step 3: Set up PM2 for Process Management

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the Astro SSR server
pm2 start dist/server/entry.mjs --name wudmc-astro

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the instructions from the output
```

## Step 4: Configure Nginx

Create nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/wudmc
```

Configuration content:
```nginx
server {
    server_name wudmc.com www.wudmc.com;

    # Serve static files directly
    location /_astro/ {
        alias /var/www/wudmc.com/dist/client/_astro/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/wudmc.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wudmc.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = www.wudmc.com) {
        return 301 https://$host$request_uri;
    }

    if ($host = wudmc.com) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name wudmc.com www.wudmc.com;
    return 404;
}
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/wudmc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 5: Set up SSL with Certbot

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d wudmc.com -d www.wudmc.com
```

## Environment Variables (Future - for BigQuery)

Create `.env` file in project root:
```bash
GCP_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

## Updating the Application

```bash
cd /var/www/wudmc.com
git pull
npm install
npm run build
pm2 restart wudmc-astro
```

## Useful Commands

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs wudmc-astro

# Restart application
pm2 restart wudmc-astro

# Check nginx status
sudo systemctl status nginx

# Reload nginx
sudo systemctl reload nginx
```

## Development Mode

For local development:
```bash
npm run dev
# Server runs on http://localhost:4321
```

For production preview:
```bash
npm run build
npm run preview
```
