import 'dotenv/config';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.NEXT_FIREBASE_SERVICE_ACCOUNT_KEY as string
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
