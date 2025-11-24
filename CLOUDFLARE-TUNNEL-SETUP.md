# ☁️ Cloudflare Tunnel Setup for whysocheap.site

Complete guide to host your website locally using Cloudflare Tunnel with your domain from Hostinger.

---

## ⚠️ IMPORTANT NOTES

### 1. **Does the website go down when you close your computer?**

**YES!** ❌ 

- If you close your computer, the website **WILL BE DOWN**
- If your computer goes to sleep, the website **WILL BE DOWN**
- If your computer restarts, the website **WILL BE DOWN** until you start it again
- If your internet disconnects, the website **WILL BE DOWN**

**For 24/7 uptime, you need:**
- A computer/server that stays on 24/7
- Or use a VPS (cloud server) instead

### 2. **Can you re-host on a different PC?**

**YES!** ✅

You can easily move your hosting to a different computer:

1. **On the NEW computer:**
   - Install Node.js
   - Install Cloudflare Tunnel (cloudflared)
   - Copy your project files
   - Run the same setup steps

2. **The tunnel configuration stays the same:**
   - Your domain `whysocheap.site` will automatically work
   - Just run `cloudflared tunnel run whysocheap` on the new PC
   - No need to change DNS or domain settings

3. **What you need to transfer:**
   - Your project folder (the entire `idol-tshirt-store` folder)
   - Your `.env.local` file (with Telegram bot tokens)
   - Your database file (`data/whysocheap.db`)
   - Cloudflare tunnel credentials (or recreate the tunnel)

**Note:** You can run the tunnel on multiple computers, but only one should be active at a time.

---

## 📋 Prerequisites

- Domain: `whysocheap.site` (from Hostinger)
- Cloudflare account (free)
- Node.js 18+ installed
- Your computer must stay on for the website to work

---

## 🚀 Step-by-Step Setup

### Step 1: Add Domain to Cloudflare

1. **Sign up for Cloudflare** (if you don't have an account):
   - Go to https://dash.cloudflare.com/sign-up
   - Create a free account

2. **Add your domain to Cloudflare:**
   - In Cloudflare dashboard, click "Add a Site"
   - Enter: `whysocheap.site`
   - Choose the Free plan
   - Cloudflare will scan your DNS records

3. **Get your nameservers:**
   - Cloudflare will show you 2 nameservers (e.g., `alice.ns.cloudflare.com` and `bob.ns.cloudflare.com`)
   - **Copy these nameservers** - you'll need them in Step 2

---

### Step 2: Update Nameservers at Hostinger

1. **Log in to Hostinger:**
   - Go to https://hpanel.hostinger.com
   - Navigate to your domain `whysocheap.site`

2. **Change nameservers:**
   - Find "Nameservers" or "DNS" section
   - Change from Hostinger nameservers to Cloudflare nameservers
   - Enter the 2 nameservers Cloudflare gave you
   - Save changes

3. **Wait for propagation:**
   - This can take 5 minutes to 24 hours
   - Usually takes 10-30 minutes
   - You can check status in Cloudflare dashboard

**Why?** Cloudflare Tunnel needs Cloudflare to manage your DNS.

---

### Step 3: Install Cloudflare Tunnel (cloudflared)

#### Windows:

**Option A: Using Chocolatey (Recommended)**
```powershell
# Install Chocolatey first if you don't have it:
# Run PowerShell as Administrator, then:
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Then install cloudflared:
choco install cloudflared
```

**Option B: Manual Download**
1. Go to: https://github.com/cloudflare/cloudflared/releases
2. Download `cloudflared-windows-amd64.exe`
3. Rename to `cloudflared.exe`
4. Move to a folder in your PATH (e.g., `C:\Windows\System32`) or create a folder and add it to PATH

**Option C: Using Scoop**
```powershell
scoop install cloudflared
```

#### Verify Installation:
```bash
cloudflared --version
```

---

### Step 4: Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

This will:
- Open your browser
- Ask you to log in to Cloudflare
- Ask you to select your domain (`whysocheap.site`)
- Save authentication credentials

**Location of credentials:** `C:\Users\YOUR_USERNAME\.cloudflared\cert.pem`

---

### Step 5: Create a Tunnel

```bash
cloudflared tunnel create whysocheap
```

**Output will show:**
```
Created tunnel whysocheap with id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Save the tunnel ID!** You'll need it in the config file.

**Location of tunnel credentials:** `C:\Users\YOUR_USERNAME\.cloudflared\xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.json`


ID: 2eeec165-c28b-4546-8ffa-0793593e4be3
---

### Step 6: Configure DNS Routing

**⚠️ IMPORTANT: Before running these commands, you need to remove any existing DNS records for your domain in Cloudflare!**

#### First: Remove Existing DNS Records

1. **Go to Cloudflare Dashboard:**
   - Visit: https://dash.cloudflare.com
   - Select your domain: `whysocheap.site`
   - Click on "DNS" in the left sidebar

2. **Find and Delete Existing Records:**
   - Look for any A, AAAA, or CNAME records for:
     - `whysocheap.site` (or `@`)
     - `www.whysocheap.site` (or `www`)
   - Click the "Delete" (trash icon) for each record
   - Confirm deletion

3. **Why?** Cloudflare Tunnel needs to create its own CNAME records. Existing records will conflict.

#### Then: Configure DNS Routing

This connects your domain to the tunnel:

```bash
cloudflared tunnel route dns whysocheap whysocheap.site
cloudflared tunnel route dns whysocheap www.whysocheap.site
```

This automatically creates DNS records in Cloudflare.

**If you get an error about existing records:**
- Go back to Cloudflare DNS dashboard
- Make sure ALL A, AAAA, and CNAME records for your domain are deleted
- Wait 1-2 minutes
- Try the command again

---

### Step 7: Create Configuration File

HERE
Create the config file at: `C:\Users\YOUR_USERNAME\.cloudflared\config.yml`

**Replace `YOUR_USERNAME` with your actual Windows username!**

```yaml
tunnel: YOUR_TUNNEL_ID_HERE
credentials-file: C:\Users\YOUR_USERNAME\.cloudflared\YOUR_TUNNEL_ID.json

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

**Important:**
- Replace `YOUR_TUNNEL_ID_HERE` with the tunnel ID from Step 5
- Replace `YOUR_USERNAME` with your Windows username
- Replace `YOUR_TUNNEL_ID.json` with the actual filename (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890.json`)

**Example config.yml:**
```yaml
tunnel: a1b2c3d4-e5f6-7890-abcd-ef1234567890
credentials-file: C:\Users\hangs\.cloudflared\a1b2c3d4-e5f6-7890-abcd-ef1234567890.json

ingress:
  - hostname: whysocheap.site
    service: http://localhost:3000
  - hostname: www.whysocheap.site
    service: http://localhost:3000
  - service: http_status:404
```

---

### Step 8: Build and Start Your Next.js App

In your project directory:

```bash
cd C:\Users\hangs\Downloads\idol-tshirt-store
npm run build
npm start
```

Your app should now be running on `http://localhost:3000`

**Keep this terminal window open!**

---

### Step 9: Start the Cloudflare Tunnel

Open a **NEW terminal window** and run:

```bash
cloudflared tunnel run whysocheap
```

**Keep this terminal window open too!**

You should see:
```
2024-01-01T12:00:00Z INF Starting metrics server
2024-01-01T12:00:00Z INF +--------------------------------------------------------------------------------------------+
2024-01-01T12:00:00Z INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable): |
2024-01-01T12:00:00Z INF |  https://whysocheap.site                                                                    |
2024-01-01T12:00:00Z INF +--------------------------------------------------------------------------------------------+
```

---

### Step 10: Test Your Website

1. Wait 1-2 minutes for DNS to propagate
2. Visit: `https://whysocheap.site`
3. Visit: `https://www.whysocheap.site`

**Both should work!** 🎉

---

## 🔄 Running on Startup (Optional)

### Option A: Windows Task Scheduler

1. **Create a startup script** (`start-whysocheap.bat`):

```batch
@echo off
cd /d C:\Users\hangs\Downloads\idol-tshirt-store
start "Next.js App" cmd /k "npm start"
timeout /t 10
start "Cloudflare Tunnel" cmd /k "cloudflared tunnel run whysocheap"
```

2. **Add to Task Scheduler:**
   - Open Task Scheduler
   - Create Basic Task
   - Trigger: "When I log on"
   - Action: Start a program
   - Program: `C:\Users\hangs\Downloads\idol-tshirt-store\start-whysocheap.bat`

### Option B: Windows Service (Advanced)

Use NSSM (Non-Sucking Service Manager) to run as Windows services:
- Install NSSM
- Create service for Next.js app
- Create service for Cloudflare Tunnel

---

## 🖥️ Moving to a Different Computer

### Steps to Transfer:

1. **On OLD computer:**
   - Copy your project folder
   - Copy `.env.local` file
   - Copy `data/whysocheap.db` (your database)
   - Note your tunnel ID (from config.yml)

2. **On NEW computer:**
   - Install Node.js
   - Install cloudflared
   - Copy project folder
   - Copy `.env.local` to project folder
   - Copy database file to `data/` folder

3. **Set up Cloudflare Tunnel on NEW computer:**
   - Run: `cloudflared tunnel login`
   - **Option A:** Use existing tunnel (recommended)
     - Copy the tunnel credentials file: `C:\Users\OLD_USERNAME\.cloudflared\TUNNEL_ID.json`
     - Copy to: `C:\Users\NEW_USERNAME\.cloudflared\TUNNEL_ID.json`
     - Create config.yml with same tunnel ID
   - **Option B:** Create new tunnel
     - Run: `cloudflared tunnel create whysocheap`
     - Update DNS: `cloudflared tunnel route dns whysocheap whysocheap.site`
     - Create new config.yml

4. **Start everything:**
   ```bash
   npm run build
   npm start
   # In another terminal:
   cloudflared tunnel run whysocheap
   ```

**Your domain will work immediately!** No DNS changes needed.

---

## 🛠️ Troubleshooting

### Issue: "Failed to add route: An A, AAAA, or CNAME record with that host already exists"
**Solution:** 
1. Go to Cloudflare Dashboard → DNS
2. Find and delete ALL existing DNS records for:
   - `whysocheap.site` (or `@`)
   - `www.whysocheap.site` (or `www`)
3. Wait 1-2 minutes for changes to propagate
4. Run the command again:
   ```bash
   cloudflared tunnel route dns whysocheap whysocheap.site
   cloudflared tunnel route dns whysocheap www.whysocheap.site
   ```
5. Cloudflare Tunnel will create the correct CNAME records automatically

### Issue: "Tunnel not found"
**Solution:** Make sure you're using the correct tunnel name or ID in config.yml

### Issue: "Connection refused"
**Solution:** 
- Make sure Next.js app is running on port 3000
- Check: `http://localhost:3000` works in browser

### Issue: "DNS not resolving"
**Solution:**
- Wait longer (can take up to 24 hours)
- Check DNS in Cloudflare dashboard
- Verify nameservers are correct at Hostinger

### Issue: "Certificate error"
**Solution:**
- Cloudflare Tunnel automatically provides SSL
- Make sure you're using `https://` not `http://`
- Clear browser cache

### Issue: Website goes down when computer sleeps
**Solution:**
- Disable sleep mode: Control Panel → Power Options → Never sleep
- Or use a VPS instead

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Find what's using port 3000:
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID):
taskkill /PID <PID> /F

# Or change port in package.json
```

---

## 📊 Monitoring

### Check if tunnel is running:
```bash
cloudflared tunnel list
```

### View tunnel logs:
```bash
cloudflared tunnel run whysocheap --loglevel debug
```

### Check Next.js app:
- Visit: `http://localhost:3000` (should work)
- Check terminal for errors

---

## 🔒 Security Notes

1. **Keep your computer secure:**
   - Use Windows Firewall
   - Keep Windows updated
   - Use strong passwords

2. **Environment variables:**
   - Never commit `.env.local` to Git
   - Keep Telegram bot tokens secret

3. **Database:**
   - Regularly backup `data/whysocheap.db`
   - Store backups in a safe place

---

## ✅ Checklist

- [ ] Cloudflare account created
- [ ] Domain added to Cloudflare
- [ ] Nameservers updated at Hostinger
- [ ] cloudflared installed
- [ ] Authenticated with Cloudflare
- [ ] Tunnel created
- [ ] DNS routes configured
- [ ] config.yml created
- [ ] Next.js app built and running
- [ ] Tunnel running
- [ ] Website accessible at https://whysocheap.site

---

## 🎯 Quick Commands Reference

```bash
# Start Next.js app
npm run build
npm start

# Start tunnel
cloudflared tunnel run whysocheap

# List tunnels
cloudflared tunnel list

# Delete tunnel (if needed)
cloudflared tunnel delete whysocheap

# View tunnel info
cloudflared tunnel info whysocheap
```

---

## 💡 Tips

1. **Keep both terminals open:**
   - One for Next.js (`npm start`)
   - One for Cloudflare Tunnel (`cloudflared tunnel run whysocheap`)

2. **For 24/7 hosting:**
   - Consider a dedicated computer/server
   - Or use a VPS (see `VPS-SETUP-GUIDE.md`)

3. **Backup regularly:**
   - Database file: `data/whysocheap.db`
   - Environment file: `.env.local`
   - Project folder

4. **Monitor uptime:**
   - Use services like UptimeRobot (free) to monitor your site
   - Get alerts if site goes down

---

## 🆘 Need Help?

- Cloudflare Tunnel Docs: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- Cloudflare Community: https://community.cloudflare.com/

---

**Your website is now live at https://whysocheap.site!** 🎉

Remember: The website will only work when your computer is on and both the Next.js app and Cloudflare Tunnel are running.

