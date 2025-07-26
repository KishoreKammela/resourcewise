import 'dotenv/config';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccountKey = process.env.NEXT_FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    throw new Error(
      'Firebase service account key is not set in environment variables.'
    );
  }

  let serviceAccount;
  // Check if the key is a JSON string or Base64 encoded
  if (serviceAccountKey.startsWith('{')) {
    // It's a JSON string (likely from local .env file)
    serviceAccount = JSON.parse(serviceAccountKey);
  } else {
    // It's likely Base64 encoded (for production environments like Vercel)
    const decodedKey = Buffer.from(serviceAccountKey, 'base64').toString(
      'utf-8'
    );
    serviceAccount = JSON.parse(decodedKey);
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
