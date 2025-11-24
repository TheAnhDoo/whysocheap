# 🖥️ VPS Setup Guide for whysocheap.site

Complete guide to host your website on a VPS (Virtual Private Server) using Cloudflare Tunnel.

---

## 🎯 Why VPS?

- ✅ **24/7 Uptime** - Server runs continuously
- ✅ **No dependency on your PC** - Website stays online even when your computer is off
- ✅ **Better performance** - Dedicated resources
- ✅ **Professional hosting** - Reliable and scalable

---

## 📋 Prerequisites

- Domain: `whysocheap.site` (from Hostinger)
- Cloudflare account (free)
- VPS provider account (see recommendations below)
- Basic Linux command line knowledge

---

## 🏢 Step 1: Choose a VPS Provider

### Recommended Providers:

**Budget Options ($5-10/month):**
- **DigitalOcean** - https://www.digitalocean.com/
  - $6/month for 1GB RAM, 1 vCPU, 25GB SSD
  - Great documentation and community
- **Vultr** - https://www.vultr.com/
  - $6/month for 1GB RAM, 1 vCPU, 25GB SSD
  - Global locations
- **Linode** - https://www.linode.com/
  - $5/month for 1GB RAM, 1 vCPU, 25GB SSD
  - Simple pricing

**Premium Options:**
- **AWS EC2** - Pay as you go
- **Google Cloud Platform** - Free tier available
- **Azure** - Microsoft cloud

### Recommended VPS Specs:
- **RAM:** 1GB minimum (2GB recommended)
- **CPU:** 1 vCPU minimum
- **Storage:** 20GB+ SSD
- **OS:** Ubuntu 22.04 LTS (recommended)
- **Location:** Choose closest to your users

---

## 🚀 Step 2: Create and Access Your VPS

### 2.1 Create VPS Instance

1. **Sign up** for your chosen VPS provider
2. **Create a new droplet/server:**
   - Choose Ubuntu 22.04 LTS
   - Select the $6/month plan (or higher)
   - Choose a datacenter location
   - Add your SSH key (or create password)
   - Create the server

3. **Note your server details:**
   - IP Address: `xxx.xxx.xxx.xxx`
   - Root password (if using password auth)
   - SSH key (if using key auth)

### 2.2 Connect to Your VPS

**Windows (PowerShell or Command Prompt):**
```bash
ssh root@YOUR_SERVER_IP
```

**Or using PuTTY (Windows):**
- Download PuTTY: https://www.putty.org/
- Enter your server IP
- Port: 22
- Click "Open"
- Login with `root` and your password

**First time connection:**
- You'll see a security warning - type `yes` to continue
- Enter your password when prompted

---

## 🔧 Step 3: Initial Server Setup

### 3.1 Update System

```bash
# Update package list
apt update

# Upgrade existing packages
apt upgrade -y

# Install essential tools
apt install -y curl wget git build-essential
```

### 3.2 Create Non-Root User (Recommended)

```bash
# Create a new user
adduser whysocheap

# Add user to sudo group
usermod -aG sudo whysocheap

# Switch to new user
su - whysocheap
```

**Note:** Replace `whysocheap` with your preferred username.

---

## 📦 Step 4: Install Node.js

### Option A: Using NodeSource (Recommended)

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version    # Should show 10.x.x
```

### Option B: Using NVM (Node Version Manager)

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version
npm --version
```

---

## 📥 Step 5: Install Cloudflare Tunnel

```bash
# Download cloudflared for Linux
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Install
sudo dpkg -i cloudflared-linux-amd64.deb

# Verify installation
cloudflared --version
```

**Alternative (if .deb doesn't work):**
```bash
# Download binary directly
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -O cloudflared

# Make executable
chmod +x cloudflared

# Move to system path
sudo mv cloudflared /usr/local/bin/

# Verify
cloudflared --version
```

---

## 📂 Step 6: Set Up Your Project

### 6.1 Clone or Upload Your Project

**Option A: Clone from GitHub (Recommended)**

```bash
# Navigate to home directory
cd ~

# Clone your repository
git clone https://github.com/TheAnhDoo/whysocheap.git

# Or if using SSH:
# git clone git@github.com:TheAnhDoo/whysocheap.git

# Navigate to project
cd whysocheap
```

**Option B: Upload Files via SCP**

From your local computer:
```bash
# Upload entire project folder
scp -r C:\Users\hangs\Downloads\idol-tshirt-store root@YOUR_SERVER_IP:/home/whysocheap/

# Or using WinSCP (Windows GUI tool)
# Download: https://winscp.net/
```

### 6.2 Install Dependencies

```bash
# Navigate to project directory
cd ~/whysocheap  # or wherever you cloned/uploaded

# Install npm packages
npm install

# Build the project
npm run build
```

### 6.3 Set Up Environment Variables

```bash
# Create .env.local file
nano .env.local
```

**Add your environment variables:**
```env
# Telegram Bot (if you have one)
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Add any other environment variables you need
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

### 6.4 Copy Database (if you have one)

```bash
# If you have an existing database, upload it:
# From your local computer:
scp data/whysocheap.db root@YOUR_SERVER_IP:/home/whysocheap/whysocheap/data/

# Or create the database structure (it will be created automatically on first run)
```

---

## ☁️ Step 7: Set Up Cloudflare Tunnel

### 7.1 Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

This will:
- Open a URL in your browser (or show you a URL to visit)
- Ask you to log in to Cloudflare
- Select your domain (`whysocheap.site`)
- Save credentials to `~/.cloudflared/cert.pem`

**Note:** If you're using SSH without a display, you'll need to:
1. Copy the URL shown in terminal
2. Open it in a browser on your local computer
3. Complete authentication
4. Credentials will be saved on the VPS

### 7.2 Create or Use Existing Tunnel

**Option A: Use Existing Tunnel (Recommended if you already created one locally)**

If you already created the tunnel on your local computer, you can reuse it:

1. **Copy tunnel credentials from your local computer to VPS:**

   **On your local computer (Windows):**
   ```powershell
   # Find your tunnel ID (from CLOUDFLARE-TUNNEL-SETUP.md or config.yml)
   # The tunnel ID is something like: 2eeec165-c28b-4546-8ffa-0793593e4be3
   
   # Copy the tunnel credentials file to VPS
   scp C:\Users\hangs\.cloudflared\TUNNEL_ID.json whysocheap@YOUR_SERVER_IP:/home/whysocheap/.cloudflared/
   ```

   **Or manually:**
   - Find the tunnel ID from your local `config.yml` or from the CLOUDFLARE-TUNNEL-SETUP.md file
   - The file is at: `C:\Users\hangs\.cloudflared\TUNNEL_ID.json`
   - Upload it to VPS: `/home/whysocheap/.cloudflared/TUNNEL_ID.json`

2. **On VPS, verify the file exists:**
   ```bash
   ls -la ~/.cloudflared/
   # Should show your tunnel ID file
   ```

3. **Use the existing tunnel ID** (skip to Step 7.4)

**Option B: Create New Tunnel**

If you want to create a new tunnel (or if the above doesn't work):

```bash
cloudflared tunnel create whysocheap
```

**If you get "tunnel already exists" error:**
```bash
# List existing tunnels
cloudflared tunnel list

# Option 1: Delete the old tunnel (if you don't need it)
cloudflared tunnel delete whysocheap

# Then create new one
cloudflared tunnel create whysocheap

# Option 2: Use a different name
cloudflared tunnel create whysocheap-vps
# Then use "whysocheap-vps" instead of "whysocheap" in all commands
```

**Output:**
```
Created tunnel whysocheap with id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Save the tunnel ID!** You'll need it for the config file.

### 7.3 Configure DNS Routing

**⚠️ IMPORTANT: If you're using an existing tunnel, DNS routes may already be configured!**

**Check if routes already exist:**
```bash
cloudflared tunnel route dns list
```

**If routes don't exist, configure them:**

1. **Remove existing DNS records first (if any):**
   - Go to Cloudflare Dashboard → DNS
   - Delete ALL A, AAAA, and CNAME records for:
     - `whysocheap.site` (or `@`)
     - `www.whysocheap.site` (or `www`)
   - Wait 1-2 minutes

2. **Create DNS routes:**
   ```bash
   cloudflared tunnel route dns whysocheap whysocheap.site
   cloudflared tunnel route dns whysocheap www.whysocheap.site
   ```

**If you get "route already exists" error:**
- The DNS routes are already configured
- You can skip this step and proceed to Step 7.4

### 7.4 Create Configuration File

```bash
# Create config directory
mkdir -p ~/.cloudflared

# Create config file
nano ~/.cloudflared/config.yml
```

**Add this content (replace YOUR_TUNNEL_ID with actual ID):**
```yaml
tunnel: YOUR_TUNNEL_ID_HERE
credentials-file: /home/whysocheap/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  # Main domain
  - hostname: whysocheap.site
    service: http://localhost:3000
  
  # WWW subdomain
  - hostname: www.whysocheap.site
    service: http://localhost:3000
  
  # Catch-all (404 for everything else)
  - service: http_status:404
```

**Example (replace with your actual tunnel ID):**
```yaml
tunnel: 2eeec165-c28b-4546-8ffa-0793593e4be3
credentials-file: /home/whysocheap/.cloudflared/2eeec165-c28b-4546-8ffa-0793593e4be3.json

ingress:
  - hostname: whysocheap.site
    service: http://localhost:3000
  - hostname: www.whysocheap.site
    service: http://localhost:3000
  - service: http_status:404
```

**Save and exit:**
- `Ctrl + X`, then `Y`, then `Enter`

---

## 🔄 Step 8: Set Up System Services (Auto-Start)

We'll use systemd to run both Next.js and Cloudflare Tunnel as services that start automatically.

### 8.1 Create Next.js Service

```bash
sudo nano /etc/systemd/system/whysocheap-app.service
```

**Add this content (adjust paths as needed):**
```ini
[Unit]
Description=WhySoCheap Next.js App
After=network.target

[Service]
Type=simple
User=whysocheap
WorkingDirectory=/home/whysocheap/whysocheap
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

**If using NVM, use this instead:**
```ini
[Unit]
Description=WhySoCheap Next.js App
After=network.target

[Service]
Type=simple
User=whysocheap
WorkingDirectory=/home/whysocheap/whysocheap
Environment=NODE_ENV=production
Environment="PATH=/home/whysocheap/.nvm/versions/node/v20.x.x/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ExecStart=/home/whysocheap/.nvm/versions/node/v20.x.x/bin/npm start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

**Save and exit.**

### 8.2 Create Cloudflare Tunnel Service

```bash
sudo nano /etc/systemd/system/whysocheap-tunnel.service
```

**Add this content:**
```ini
[Unit]
Description=Cloudflare Tunnel for WhySoCheap
After=network.target whysocheap-app.service
Requires=whysocheap-app.service

[Service]
Type=simple
User=whysocheap
ExecStart=/usr/local/bin/cloudflared tunnel run whysocheap
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

**Save and exit.**

### 8.3 Enable and Start Services

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable services (start on boot)
sudo systemctl enable whysocheap-app.service
sudo systemctl enable whysocheap-tunnel.service

# Start services
sudo systemctl start whysocheap-app.service
sudo systemctl start whysocheap-tunnel.service

# Check status
sudo systemctl status whysocheap-app.service
sudo systemctl status whysocheap-tunnel.service
```

**To view logs:**
```bash
# Next.js app logs
sudo journalctl -u whysocheap-app.service -f

# Cloudflare Tunnel logs
sudo journalctl -u whysocheap-tunnel.service -f

# View last 100 lines
sudo journalctl -u whysocheap-app.service -n 100
```

---

## 🔒 Step 9: Security Setup

### 9.1 Configure Firewall

```bash
# Install UFW (Uncomplicated Firewall)
sudo apt install -y ufw

# Allow SSH (important - do this first!)
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS (optional, Cloudflare Tunnel handles this)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 9.2 Disable Root Login (Optional but Recommended)

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Find and change:
# PermitRootLogin yes
# To:
# PermitRootLogin no

# Restart SSH
sudo systemctl restart sshd
```

### 9.3 Set Up Automatic Security Updates

```bash
# Install unattended-upgrades
sudo apt install -y unattended-upgrades

# Configure
sudo dpkg-reconfigure -plow unattended-upgrades

# Select "Yes" when prompted
```

---

## ✅ Step 10: Verify Everything Works

### 10.1 Check Services

```bash
# Check if services are running
sudo systemctl status whysocheap-app.service
sudo systemctl status whysocheap-tunnel.service

# Both should show "active (running)"
```

### 10.2 Test Locally on Server

```bash
# Test Next.js app (should work)
curl http://localhost:3000

# Should return HTML content
```

### 10.3 Test Public URL

1. Wait 1-2 minutes for DNS propagation
2. Visit: `https://whysocheap.site`
3. Visit: `https://www.whysocheap.site`

**Both should work!** 🎉

---

## 🔄 Step 11: Updating Your Website

### When you push changes to GitHub:

```bash
# SSH into your VPS
ssh whysocheap@YOUR_SERVER_IP

# Navigate to project
cd ~/whysocheap

# Pull latest changes
git pull

# Install new dependencies (if any)
npm install

# Rebuild
npm run build

# Restart the service
sudo systemctl restart whysocheap-app.service

# Check status
sudo systemctl status whysocheap-app.service
```

**Note:** Cloudflare Tunnel service doesn't need restarting.

---

## 🛠️ Troubleshooting

### Issue: Service won't start

```bash
# Check logs
sudo journalctl -u whysocheap-app.service -n 50

# Check if port 3000 is in use
sudo netstat -tlnp | grep 3000

# Check file permissions
ls -la /home/whysocheap/whysocheap
```

### Issue: "Permission denied"

```bash
# Fix ownership
sudo chown -R whysocheap:whysocheap /home/whysocheap/whysocheap

# Fix permissions
chmod +x /home/whysocheap/whysocheap
```

### Issue: Tunnel not connecting

```bash
# Check tunnel logs
sudo journalctl -u whysocheap-tunnel.service -f

# Verify config file
cat ~/.cloudflared/config.yml

# Test tunnel manually
cloudflared tunnel run whysocheap
```

### Issue: Can't find Node.js in service

```bash
# Find Node.js path
which node
which npm

# Update service file with correct paths
sudo nano /etc/systemd/system/whysocheap-app.service
```

### Issue: Website shows 502 Bad Gateway

```bash
# Check if Next.js is running
curl http://localhost:3000

# Check Next.js logs
sudo journalctl -u whysocheap-app.service -f

# Restart Next.js service
sudo systemctl restart whysocheap-app.service
```

---

## 📊 Monitoring

### Check Service Status

```bash
# All services
sudo systemctl status whysocheap-app.service whysocheap-tunnel.service

# Just status
sudo systemctl is-active whysocheap-app.service
sudo systemctl is-active whysocheap-tunnel.service
```

### View Logs

```bash
# Real-time logs
sudo journalctl -u whysocheap-app.service -f
sudo journalctl -u whysocheap-tunnel.service -f

# Last 100 lines
sudo journalctl -u whysocheap-app.service -n 100
```

### Server Resources

```bash
# CPU and Memory usage
htop
# Or
top

# Disk usage
df -h

# Check if services are running
ps aux | grep node
ps aux | grep cloudflared
```

---

## 🔄 Useful Commands

```bash
# Start services
sudo systemctl start whysocheap-app.service
sudo systemctl start whysocheap-tunnel.service

# Stop services
sudo systemctl stop whysocheap-app.service
sudo systemctl stop whysocheap-tunnel.service

# Restart services
sudo systemctl restart whysocheap-app.service
sudo systemctl restart whysocheap-tunnel.service

# Disable auto-start
sudo systemctl disable whysocheap-app.service
sudo systemctl disable whysocheap-tunnel.service

# Enable auto-start
sudo systemctl enable whysocheap-app.service
sudo systemctl enable whysocheap-tunnel.service

# View service status
sudo systemctl status whysocheap-app.service
sudo systemctl status whysocheap-tunnel.service
```

---

## 💾 Backup Strategy

### Backup Database

```bash
# Create backup script
nano ~/backup-db.sh
```

**Add:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/whysocheap/backups"
mkdir -p $BACKUP_DIR
cp /home/whysocheap/whysocheap/data/whysocheap.db $BACKUP_DIR/whysocheap_$DATE.db
# Keep only last 7 days
find $BACKUP_DIR -name "whysocheap_*.db" -mtime +7 -delete
```

**Make executable:**
```bash
chmod +x ~/backup-db.sh
```

**Add to crontab (daily backup at 2 AM):**
```bash
crontab -e

# Add this line:
0 2 * * * /home/whysocheap/backup-db.sh
```

---

## 🎯 Quick Setup Checklist

- [ ] VPS created and accessible
- [ ] Server updated and essential tools installed
- [ ] Node.js installed (v20.x)
- [ ] Cloudflare Tunnel installed
- [ ] Project cloned/uploaded to VPS
- [ ] Dependencies installed (`npm install`)
- [ ] Project built (`npm run build`)
- [ ] Environment variables set (`.env.local`)
- [ ] Database uploaded (if exists)
- [ ] Cloudflare Tunnel authenticated
- [ ] Tunnel created
- [ ] DNS routes configured
- [ ] Config file created (`~/.cloudflared/config.yml`)
- [ ] Systemd services created
- [ ] Services enabled and started
- [ ] Firewall configured
- [ ] Website accessible at https://whysocheap.site

---

## 🆘 Need Help?

- **VPS Issues:** Contact your VPS provider support
- **Cloudflare Tunnel:** https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- **Systemd:** https://www.freedesktop.org/software/systemd/man/systemd.service.html
- **Ubuntu Docs:** https://help.ubuntu.com/

---

## 💡 Tips

1. **Keep your VPS updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Monitor disk space:**
   ```bash
   df -h
   ```

3. **Set up monitoring:**
   - Use UptimeRobot (free) to monitor your site
   - Get email alerts if site goes down

4. **Regular backups:**
   - Backup database regularly
   - Backup `.env.local` file
   - Consider automated backups

5. **SSH Key Authentication:**
   - More secure than passwords
   - Set up SSH keys for easier access

---

**Your website is now running 24/7 on a VPS!** 🎉

The website will stay online even when your computer is off, and services will automatically restart if the server reboots.
