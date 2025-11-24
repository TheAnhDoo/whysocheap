# 🚀 Quick Start: Host Locally with Your Domain

## Fastest Method: Cloudflare Tunnel (Recommended)

### Step 1: Install Cloudflare Tunnel
```bash
# Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
# Or using Chocolatey (Windows):
choco install cloudflared
```

### Step 2: Login to Cloudflare
```bash
cloudflared tunnel login
```
This will open your browser to authenticate.

### Step 3: Create Tunnel
```bash
cloudflared tunnel create whysocheap
```
Note the tunnel ID that's displayed.

### Step 4: Configure DNS
```bash
# Replace YOUR_TUNNEL_ID with the ID from step 3
cloudflared tunnel route dns whysocheap yourdomain.com
cloudflared tunnel route dns whysocheap www.yourdomain.com
```

### Step 5: Create Config File
Create `C:\Users\YOUR_USERNAME\.cloudflared\config.yml`:

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

### Step 6: Build and Start Your App
```bash
npm run build
npm start
```

### Step 7: Start Tunnel
```bash
cloudflared tunnel run whysocheap
```

**Done!** Your site is now accessible at `https://yourdomain.com` 🎉

---

## Alternative: ngrok (Even Faster Setup)

### Step 1: Install ngrok
Download from https://ngrok.com/download or:
```bash
npm install -g ngrok
```

### Step 2: Sign Up & Get Token
1. Sign up at https://dashboard.ngrok.com
2. Get your authtoken from dashboard
3. Run: `ngrok config add-authtoken YOUR_TOKEN`

### Step 3: Add Custom Domain
1. In ngrok dashboard, go to "Domains"
2. Add your domain
3. Follow DNS instructions (add CNAME record)

### Step 4: Start Your App
```bash
npm run build
npm start
```

### Step 5: Start Tunnel
```bash
ngrok http 3000 --domain=yourdomain.com
```

**Done!** Your site is accessible at `https://yourdomain.com` 🎉

---

## Using the Batch Script (Windows)

1. Double-click `start-with-domain.bat`
2. Follow the prompts
3. Choose your tunneling method

---

## Troubleshooting

**DNS not working?**
- Wait 5-10 minutes for DNS propagation
- Check with: `nslookup yourdomain.com`
- Clear DNS cache: `ipconfig /flushdns`

**Port 3000 in use?**
- Change port: `set PORT=3001 && npm start`
- Update tunnel config to use port 3001

**Connection refused?**
- Make sure Next.js is running first
- Check firewall settings
- Verify tunnel is pointing to correct port

---

## Need Help?

See `LOCAL-HOSTING-GUIDE.md` for detailed instructions and all available options.

