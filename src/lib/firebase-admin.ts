import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";
let adminApp: App | null = null;
let adminAuth: Auth | null = null;
try {
  const serviceAccountPath = path.join(process.cwd(), "firebase-service-account.json");
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
    if (getApps().length === 0) { adminApp = initializeApp({ credential: cert(serviceAccount) }); } else { adminApp = getApps()[0]; }
    adminAuth = getAuth(adminApp);
  }
} catch (e) { console.warn("[Firebase Admin] Failed to initialize:", e); }
export { adminApp, adminAuth };
export const isAdminConfigured = adminAuth !== null;
