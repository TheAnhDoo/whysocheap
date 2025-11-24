# 🏠 Local Hosting with Custom Domain Guide

This guide shows you how to host your WhySoCheap website locally using your own domain.

## 📋 Prerequisites

- Your domain name
- Access to your domain's DNS settings
- Your local machine's public IP address (or use tunneling)
- Node.js 18+ installed

## 🎯 Option 1: Using ngrok (Easiest - Recommended for Testing)

**Best for:** Quick testing and development with your domain

### Steps:

1. **Install ngrok:**
   ```bash
   # Download from https://ngrok.com/download
   # Or using npm:
   npm install -g ngrok
   ```

2. **Start your Next.js app:**
   ```bash
   npm run build
   npm start
   # Or for development:
   npm run dev
   ```

3. **Create ngrok tunnel:**
   ```bash
   # For production build (port 3000)
   ngrok http 3000
   
   # Or for development (port 3000)
   ngrok http 3000
   ```

4. **Configure your domain:**
   - Sign up for ngrok account (free tier available)
   - Get your authtoken from ngrok dashboard
   - Configure custom domain in ngrok:
     ```bash
     ngrok config add-authtoken YOUR_AUTH_TOKEN
     ngrok http 3000 --domain=yourdomain.com
     ```

5. **Update DNS:**
   - Add CNAME record in your domain DNS:
     - Type: CNAME
     - Name: @ (or www)
     - Value: (provided by ngrok)

**Pros:** Easy setup, HTTPS included, works immediately  
**Cons:** Free tier has limitations, requires ngrok service

---

## 🎯 Option 2: Using Cloudflare Tunnel (Free & Reliable)

**Best for:** Production-like local hosting with free HTTPS

### Steps:

1. **Install Cloudflare Tunnel (cloudflared):**
   ```bash
   # Windows (using Chocolatey)
   choco install cloudflared
   
   # Or download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
   ```

2. **Authenticate:**
   ```bash
   cloudflared tunnel login
   ```

3. **Create a tunnel:**
   ```bash
   cloudflared tunnel create whysocheap
   ```

4. **Configure tunnel:**
   Create `config.yml` in your project:
   ```yaml
   tunnel: YOUR_TUNNEL_ID
   credentials-file: C:\Users\YOUR_USERNAME\.cloudflared\YOUR_TUNNEL_ID.json
   
   ingress:
     - hostname: yourdomain.com
       service: http://localhost:3000
     - hostname: www.yourdomain.com
       service: http://localhost:3000
     - service: http_status:404
   ```

5. **Route your domain:**
   ```bash
   cloudflared tunnel route dns whysocheap yourdomain.com
   cloudflared tunnel route dns whysocheap www.yourdomain.com
   ```

6. **Start the tunnel:**
   ```bash
   cloudflared tunnel run whysocheap
   ```

7. **Start your Next.js app:**
   ```bash
   npm run build
   npm start
   ```

**Pros:** Free, reliable, HTTPS included, no port forwarding needed  
**Cons:** Requires Cloudflare account

---

## 🎯 Option 3: Direct IP with Port Forwarding (Advanced)

**Best for:** Full control, no third-party services

### Steps:

1. **Get your public IP:**
   ```bash
   # Visit: https://whatismyipaddress.com/
   # Or use:
   curl ifconfig.me
   ```

2. **Configure your router:**
   - Access router admin panel (usually 192.168.1.1)
   - Set up port forwarding:
     - External Port: 80 (HTTP) and 443 (HTTPS)
     - Internal IP: Your local machine IP (e.g., 192.168.1.100)
     - Internal Port: 3000
     - Protocol: TCP

3. **Update DNS records:**
   - Add A record in your domain DNS:
     - Type: A
     - Name: @ (or leave blank for root domain)
     - Value: Your public IP address
   - Add A record for www:
     - Type: A
     - Name: www
     - Value: Your public IP address

4. **Set up reverse proxy (nginx recommended):**

   Install nginx:
   ```bash
   # Windows: Download from nginx.org
   # Or use WSL2 with Ubuntu
   ```

   Configure nginx (`C:\nginx\conf\nginx.conf` or `/etc/nginx/sites-available/whysocheap`):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       
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
   }
   ```

5. **Set up SSL with Let's Encrypt (optional but recommended):**
   ```bash
   # Install certbot
   # Windows: Use WSL2 or certbot-win-simple
   
   certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

6. **Start your Next.js app:**
   ```bash
   npm run build
   npm start
   ```

**Pros:** Full control, no third-party dependencies  
**Cons:** Requires static IP, port forwarding, more complex setup

---

## 🎯 Option 4: Using localtunnel (Quick & Simple)

**Best for:** Quick testing without account setup

### Steps:

1. **Install localtunnel:**
   ```bash
   npm install -g localtunnel
   ```

2. **Start your Next.js app:**
   ```bash
   npm run build
   npm start
   ```

3. **Create tunnel:**
   ```bash
   lt --port 3000 --subdomain whysocheap
   ```

4. **Access via:** `https://whysocheap.loca.lt`

**Note:** For custom domain, you'll need to use ngrok or Cloudflare Tunnel.

---

## 🚀 Quick Start Script

Create a file `start-local-domain.sh` (or `.bat` for Windows):

```bash
#!/bin/bash
# Build and start the app
npm run build
npm start &

# Wait a moment for server to start
sleep 3

# Start ngrok tunnel
ngrok http 3000 --domain=yourdomain.com
```

For Windows (`start-local-domain.bat`):
```batch
@echo off
call npm run build
start /B npm start
timeout /t 5
ngrok http 3000 --domain=yourdomain.com
```

---

## 🔧 Configuration for Next.js

Update `next.config.js` if needed:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        pathname: '/**',
      },
    ],
  },
  // If using custom domain, you might need:
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         {
  //           key: 'X-Forwarded-Host',
  //           value: 'yourdomain.com',
  //         },
  //       ],
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
```

---

## 📝 Environment Variables

Create `.env.local` if you need to configure domain-specific settings:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

---

## ✅ Recommended Approach

**For Development/Testing:**
- Use **ngrok** or **Cloudflare Tunnel** - easiest setup with HTTPS

**For Production-like Local Hosting:**
- Use **Cloudflare Tunnel** - free, reliable, includes HTTPS
- Or **nginx + Let's Encrypt** - full control, professional setup

**For Quick Testing:**
- Use **localtunnel** - no account needed, instant setup

---

## 🐛 Troubleshooting

1. **Port already in use:**
   ```bash
   # Change port in package.json or use:
   PORT=3001 npm start
   ```

2. **DNS not resolving:**
   - Wait 24-48 hours for DNS propagation
   - Check DNS with: `nslookup yourdomain.com`
   - Clear DNS cache: `ipconfig /flushdns` (Windows)

3. **HTTPS issues:**
   - Use Cloudflare Tunnel or ngrok (includes HTTPS)
   - Or set up Let's Encrypt with nginx

4. **Connection refused:**
   - Check firewall settings
   - Ensure Next.js is running on correct port
   - Verify port forwarding (if using direct IP)

---

## 📚 Additional Resources

- [ngrok Documentation](https://ngrok.com/docs)
- [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [nginx Configuration Guide](https://nginx.org/en/docs/)

---

## 🎯 Next Steps

1. Choose your preferred method
2. Set up the tunnel/proxy
3. Configure DNS
4. Test your domain
5. Start your Next.js app

Your site should now be accessible via your custom domain! 🎉

