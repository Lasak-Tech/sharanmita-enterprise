import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the service account JSON file
const serviceAccountPath = path.resolve('firebase-service-account.json');
console.log(`[Firebase] Looking for service account at: ${serviceAccountPath}`);

let serviceAccount;
if (fs.existsSync(serviceAccountPath)) {
  console.log('[Firebase] JSON file found.');
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  // Ensure private key has actual newlines (JSON stores them as literal \n)
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
} else {
  // Fallback to env variables if file is missing (e.g. in production)
  serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/^['"]|['"]$/g, ''),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  };
}

if (!admin.apps.length) {
  try {
    console.log('[Firebase] Attempting to initialize...');
    const key = serviceAccount.private_key || serviceAccount.privateKey;
    console.log('[Firebase] Service Account Info:', {
      projectId: serviceAccount.project_id || serviceAccount.projectId,
      clientEmail: serviceAccount.client_email || serviceAccount.clientEmail,
      hasPrivateKey: !!key,
      privateKeyStart: key?.substring(0, 30)
    });
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log(`[Firebase] Initialized successfully using ${fs.existsSync(serviceAccountPath) ? 'JSON file' : 'environment variables'}`);
  } catch (error) {
    console.error('[Firebase] Initialization error:', error.message);
  }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth, admin };
