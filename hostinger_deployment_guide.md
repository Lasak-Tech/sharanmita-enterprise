# Hostinger Deployment Guide for Sharanmita Enterprise

This guide walks you through deploying the **Sharanmita Enterprise** application on Hostinger. 

The application architecture consists of:
*   **Frontend**: React (Vite) client (static files).
*   **Backend**: Node.js + Express API server (runs continuously).
*   **Database & Auth**: Firebase Firestore and Firebase Authentication.

---

## 🚀 Step 1: Prepare the React Client for Production

Since we refactored the client code, it no longer has hardcoded `localhost` URLs. It reads the server URL from environment variables during the build process.

1. On your local machine, open a terminal in the `client` directory.
2. Run the build command, specifying your production API URL (e.g., `https://api.yourdomain.com` or `https://yourdomain.com/api` depending on your setup):
   
   **In PowerShell (Windows):**
   ```powershell
   $env:VITE_API_URL="https://api.yourdomain.com"
   npm run build
   ```

   **In Bash (Mac/Linux):**
   ```bash
   VITE_API_URL="https://api.yourdomain.com" npm run build
   ```

3. This generates a **`dist/`** directory inside the `client` folder. These are the optimized static HTML, CSS, and JS files.

---

## 🌐 Step 2: Deploy the Client to Hostinger (Shared or Cloud Hosting)

You can host the React frontend on standard Hostinger Shared or Cloud Hosting via the file manager:

1. Log in to Hostinger hPanel and open the **File Manager** for your domain.
2. Navigate to `public_html/`.
3. Upload the **contents** of your local `client/dist/` folder directly into `public_html/`.
4. Create a file named **`.htaccess`** in the `public_html/` directory to handle React Router client-side routing on page refresh. Add the following rules:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

---

## ⚙️ Step 3: Deploy the Node.js Backend Server

Running a continuous Node.js backend requires a server environment. You have two options on Hostinger:

### Option A: Hostinger VPS Hosting (Recommended & Standard)

A VPS gives you full control to run Node.js processes, handle reverse proxy routing, and manage SSL certificates.

#### 1. Connect to your VPS
Use SSH (via PuTTY or Terminal) to connect:
```bash
ssh root@your_vps_ip
```

#### 2. Install Node.js, Git, and PM2
Run the following commands on your VPS to install dependencies:
```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Install PM2 (Process Manager to keep Node.js running in the background)
sudo npm install -g pm2
```

#### 3. Clone and Setup the Server
Clone your GitHub repository onto the VPS:
```bash
git clone https://github.com/Lasak-Tech/sharanmita-enterprise.git
cd sharanmita-enterprise/server
npm install --production
```

#### 4. Configure Production Environment Variables
Create a `.env` file in the `server` directory:
```bash
nano .env
```
Paste your production environment variables:
```env
PORT=5000
JWT_SECRET="your_production_jwt_secret"
NODE_ENV=production

# Firebase Credentials (If not using the JSON file)
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_CLIENT_EMAIL="your-firebase-client-email"
FIREBASE_PRIVATE_KEY="your-firebase-private-key-with-escaped-newlines"
```

> [!IMPORTANT]
> **Firebase Credentials**:
> Since `firebase-service-account.json` is gitignored for security, you must either:
> 1. Manually upload `firebase-service-account.json` to the server root using an SFTP client (like FileZilla).
> 2. Pass all three `FIREBASE_*` environment variables in your `.env` file. (The server will automatically fall back to them if the JSON file is missing).

#### 5. Start the Server with PM2
Use PM2 to run the Express backend:
```bash
pm2 start src/index.js --name "sharanmita-api"
pm2 save
pm2 startup
```

#### 6. Setup Nginx Reverse Proxy
Install Nginx to forward external HTTP/HTTPS requests to your Node.js app:
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/default
```
Configure Nginx to reverse proxy to port `5000`:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Restart Nginx:
```bash
sudo systemctl restart nginx
```

#### 7. Set Up Free SSL (Let's Encrypt)
Secure your API endpoint with SSL using Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

---

### Option B: Hostinger hPanel Node.js (Shared/Cloud Hosting)

If your Hostinger Shared/Cloud plan includes hPanel Node.js support (currently in beta/rolling out):

1. Go to **hPanel** -> **Node.js** under the website's dashboard.
2. Upload your `server/` directory files (excluding `node_modules` or `.git`) to the server.
3. Configure the Node.js application settings:
   *   **Application Document Root**: `/public_html/server` (or the folder where you uploaded the backend code).
   *   **App Startup File**: `src/index.js`
4. Add the environment variables (`PORT`, `JWT_SECRET`, `FIREBASE_PROJECT_ID`, etc.) inside the hPanel Node.js environment configuration interface.
5. Upload your `firebase-service-account.json` directly into the Node.js root folder.
6. Click **Install package.json** (or similar button) in hPanel to install dependencies.
7. Click **Start** or **Run** to run the app.
