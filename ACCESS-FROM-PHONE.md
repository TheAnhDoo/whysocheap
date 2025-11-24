# 📱 Access Your Localhost Website from Your Phone

Quick guide to access your website on your phone while developing locally.

---

## 🎯 Method 1: Using Your Local IP Address (Easiest)

### Step 1: Find Your Computer's IP Address

**On Windows:**
```powershell
# Open PowerShell and run:
ipconfig

# Look for "IPv4 Address" under your Wi-Fi adapter
# Example: 192.168.1.100
```

**Or use this command:**
```powershell
ipconfig | findstr IPv4
```

**Common IP ranges:**
- `192.168.1.x` (most common)
- `192.168.0.x`
- `10.0.0.x`

### Step 2: Start Your Next.js App with Network Access

**Option A: Use the network script (if available)**
```bash
npm run dev:network
```

**Option B: Start with hostname flag**
```bash
npm run dev -- -H 0.0.0.0
```

**Option C: Update package.json script (see below)**

### Step 3: Access from Your Phone

1. **Make sure your phone is on the same Wi-Fi network** as your computer
2. **Open your phone's browser**
3. **Type your computer's IP address + port:**
   ```
   http://192.168.1.100:3000
   ```
   (Replace `192.168.1.100` with YOUR actual IP address)

**That's it!** Your website should load on your phone! 🎉

---

## 🎯 Method 2: Using Next.js Dev Server with Network Access

### Update package.json

Add this script to your `package.json`:

```json
"scripts": {
  "dev": "next dev",
  "dev:network": "next dev -H 0.0.0.0",
  ...
}
```

Then run:
```bash
npm run dev:network
```

The `-H 0.0.0.0` flag makes Next.js listen on all network interfaces, not just localhost.

### Access from Phone

Use: `http://YOUR_IP_ADDRESS:3000`

---

## 🎯 Method 3: Quick PowerShell Script

Create a file `start-dev-network.bat`:

```batch
@echo off
echo Finding your IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    set IP=!IP:~1!
    echo.
    echo Your IP address is: !IP!
    echo.
    echo Starting Next.js on network...
    echo Your site will be accessible at: http://!IP!:3000
    echo.
    echo Make sure your phone is on the same Wi-Fi network!
    echo.
    npm run dev -- -H 0.0.0.0
)
pause
```

Then just double-click the file to start!

---

## 🔧 Troubleshooting

### Issue: "Can't connect" or "Connection refused"

**Solutions:**
1. **Check Windows Firewall:**
   - Go to Windows Defender Firewall
   - Click "Allow an app through firewall"
   - Make sure Node.js is allowed (or allow port 3000)

2. **Check if server is running:**
   - Make sure `npm run dev` is running
   - Check terminal for errors

3. **Verify IP address:**
   - Run `ipconfig` again
   - Make sure you're using the correct IP
   - Make sure it's the Wi-Fi adapter, not Ethernet

4. **Check Wi-Fi network:**
   - Phone and computer must be on the SAME Wi-Fi network
   - Some networks block device-to-device communication
   - Try a different Wi-Fi network if needed

### Issue: "Site can't be reached"

**Solutions:**
1. **Make sure you're using `http://` not `https://`**
2. **Check the port number** (should be `:3000`)
3. **Try accessing from computer first:** `http://YOUR_IP:3000`
4. **Restart the dev server** with network flag

### Issue: "Connection timeout"

**Solutions:**
1. **Disable Windows Firewall temporarily** to test
2. **Check router settings** - some routers block local network access
3. **Try using your computer's hostname** instead of IP:
   ```
   http://YOUR-COMPUTER-NAME:3000
   ```

---

## 📋 Quick Checklist

- [ ] Found your computer's IP address
- [ ] Started Next.js with `-H 0.0.0.0` flag
- [ ] Phone is on the same Wi-Fi network
- [ ] Windows Firewall allows Node.js/port 3000
- [ ] Using `http://` not `https://`
- [ ] Using correct IP address and port (3000)

---

## 💡 Pro Tips

1. **Bookmark the IP address** on your phone for quick access
2. **Note:** Your IP might change if you reconnect to Wi-Fi
3. **For development:** Use Method 1 (local IP) - fastest and easiest
4. **For testing with others:** Use Cloudflare Tunnel or ngrok (see other guides)

---

## 🚀 Quick Start (Copy & Paste)

```powershell
# 1. Find your IP
ipconfig | findstr IPv4

# 2. Start Next.js on network
npm run dev -- -H 0.0.0.0

# 3. On your phone, open:
# http://YOUR_IP_ADDRESS:3000
```

**Example:**
```
Your IP: 192.168.1.100
Phone URL: http://192.168.1.100:3000
```

---

## 📱 Testing Checklist

Once connected:
- [ ] Website loads on phone
- [ ] Navigation works
- [ ] Images load correctly
- [ ] Forms work
- [ ] Mobile responsive design looks good

---

**That's it!** You can now test your website on your phone while developing! 🎉

