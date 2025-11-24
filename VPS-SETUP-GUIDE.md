# 🖥️ Complete VPS Setup Guide for whysocheap.site

This guide will help you set up your WhySoCheap website on a VPS with your domain `whysocheap.site`.

## 📋 Prerequisites

- A VPS (we'll use DigitalOcean as example, but works with any VPS)
- Your domain: `whysocheap.site`
- Access to your domain's DNS settings
- Basic command line knowledge

---

## Step 1: Get a VPS

### Recommended Providers:

1. **DigitalOcean** ($6/month - 1GB RAM)
   - Sign up: https://www.digitalocean.com
   - Create Droplet → Ubuntu 22.04 LTS
   - Choose $6/month plan
   - Add SSH key or use password

2. **Hetzner** (€4.15/month - Best value)
   - Sign up: https://www.hetzner.com
   - Create Cloud Server → Ubuntu 22.04
   - Choose CX11 (€4.15/month)

3. **Vultr** ($6/month)
   - Sign up: https://www.vultr.com
   - Deploy → Ubuntu 22.04
   - Choose $6/month plan

**Note your VPS IP address** - you'll need it for DNS configuration.

---

## Step 2: Initial Server Setup

### Connect to your VPS:

```bash
# Windows (PowerShell or CMD)
ssh root@YOUR_VPS_IP

# Or if you set up a user:
ssh username@YOUR_VPS_IP
```

### Update the system:

```bash
apt update && apt upgrade -y
```

### Install Node.js 18+:

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify installation
node --version  # Should show v18.x or higher
npm --version
```

### Install PM2 (Process Manager):

```bash
npm install -g pm2
```

### Install Nginx:

```bash
apt install -y nginx
```

### Install Certbot (for SSL):

```bash
apt install -y certbot python3-certbot-nginx
```

### Set up Firewall:

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## Step 3: Deploy Your Application

### Option A: Deploy from GitHub (Recommended)

1. **Push your code to GitHub** (if not already):
   ```bash
   # On your local machine
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **On your VPS, clone the repository**:
   ```bash
   # Install git
   apt install -y git
   
   # Clone your repo
   cd /var/www
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git whysocheap
   cd whysocheap
   ```

3. **Install dependencies and build**:
   ```bash
   npm install
   npm run build
   ```

### Option B: Upload files via SCP

```bash
# On your local machine (Windows PowerShell)
# Install OpenSSH if needed, then:
scp -r C:\Users\hangs\Downloads\idol-tshirt-store root@YOUR_VPS_IP:/var/www/whysocheap
```

Then on VPS:
```bash
cd /var/www/whysocheap
npm install
npm run build
```

---

## Step 4: Set Up PM2 (Keep App Running 24/7)

Create a PM2 ecosystem file:

```bash
cd /var/www/whysocheap
nano ecosystem.config.js
```

Add this content:

```javascript
module.exports = {
  apps: [{
    name: 'whysocheap',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/whysocheap',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

Start the application:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the instructions it gives you
```

Your app is now running on port 3000 and will restart automatically if it crashes!

---

## Step 5: Configure Nginx (Reverse Proxy)

Create Nginx configuration:

```bash
nano /etc/nginx/sites-available/whysocheap.site
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name whysocheap.site www.whysocheap.site;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/whysocheap.site /etc/nginx/sites-enabled/
nginx -t  # Test configuration
systemctl reload nginx
```

---

## Step 6: Configure Your Domain DNS

Go to your domain registrar (where you bought `whysocheap.site`) and add these DNS records:

### A Records:
```
Type: A
Name: @ (or leave blank)
Value: YOUR_VPS_IP_ADDRESS
TTL: 3600 (or default)

Type: A
Name: www
Value: YOUR_VPS_IP_ADDRESS
TTL: 3600 (or default)
```

**Wait 5-30 minutes** for DNS propagation. You can check with:
```bash
nslookup whysocheap.site
```

---

## Step 7: Set Up SSL (HTTPS) - Free with Let's Encrypt

Once DNS is propagated, get SSL certificate:

```bash
certbot --nginx -d whysocheap.site -d www.whysocheap.site
```

Follow the prompts:
- Enter your email
- Agree to terms
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

Certbot will automatically:
- Get SSL certificate
- Configure Nginx
- Set up auto-renewal

Your site is now accessible at `https://whysocheap.site`! 🎉

---

## Step 8: Set Up Environment Variables

Create `.env.local` on your VPS:

```bash
cd /var/www/whysocheap
nano .env.local
```

Add your environment variables:
```env
NODE_ENV=production
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

Restart PM2:
```bash
pm2 restart whysocheap
```

---

## Step 9: Set Up Automatic Backups (Recommended)

### Backup Database:

Create backup script:

```bash
nano /root/backup-whysocheap.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup database
cp /var/www/whysocheap/data/whysocheap.db $BACKUP_DIR/whysocheap_$DATE.db

# Keep only last 7 days
find $BACKUP_DIR -name "whysocheap_*.db" -mtime +7 -delete

echo "Backup completed: whysocheap_$DATE.db"
```

Make it executable:
```bash
chmod +x /root/backup-whysocheap.sh
```

Add to crontab (daily backup at 2 AM):
```bash
crontab -e
# Add this line:
0 2 * * * /root/backup-whysocheap.sh
```

---

## Step 10: Monitoring (Optional but Recommended)

### Check if app is running:

```bash
pm2 status
pm2 logs whysocheap
```

### Set up PM2 monitoring:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Monitor server resources:

```bash
# Install htop
apt install -y htop

# View resources
htop
```

---

## 🔄 Updating Your Application

When you make changes:

```bash
cd /var/www/whysocheap
git pull  # If using GitHub
# OR upload new files via SCP

npm install  # Install new dependencies if any
npm run build  # Rebuild
pm2 restart whysocheap  # Restart app
```

---

## 🛠️ Troubleshooting

### App not starting:
```bash
pm2 logs whysocheap  # Check logs
pm2 restart whysocheap
```

### Nginx errors:
```bash
nginx -t  # Test configuration
systemctl status nginx  # Check status
tail -f /var/log/nginx/error.log  # View error log
```

### Port 3000 not accessible:
```bash
# Check if app is running
pm2 status

# Check if port is listening
netstat -tulpn | grep 3000
```

### SSL certificate issues:
```bash
certbot certificates  # List certificates
certbot renew --dry-run  # Test renewal
```

---

## 📊 Maintenance Commands

```bash
# View app logs
pm2 logs whysocheap

# Restart app
pm2 restart whysocheap

# Stop app
pm2 stop whysocheap

# View server resources
htop

# Check disk space
df -h

# Check Nginx status
systemctl status nginx

# Restart Nginx
systemctl restart nginx
```

---

## ✅ Checklist

- [ ] VPS created and accessible
- [ ] Node.js installed
- [ ] Application deployed
- [ ] PM2 running and auto-start configured
- [ ] Nginx configured
- [ ] DNS records added
- [ ] SSL certificate installed
- [ ] Environment variables set
- [ ] Backups configured
- [ ] Site accessible at https://whysocheap.site

---

## 🎉 You're Done!

Your website is now:
- ✅ Running 24/7
- ✅ Accessible at https://whysocheap.site
- ✅ Secured with SSL
- ✅ Auto-restarting if it crashes
- ✅ Backed up daily

**Total Cost:** ~$5-10/month
**Setup Time:** 2-4 hours (first time)
**Maintenance:** Minimal (just update when needed)

---

## 🆘 Need Help?

If you encounter issues:
1. Check PM2 logs: `pm2 logs whysocheap`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Verify DNS: `nslookup whysocheap.site`
4. Test SSL: `certbot certificates`

