import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAOTzg-_clcUc5jrJ-3o8Sn5YOgQzLXVWc",
  authDomain: "login-test-e5d60.firebaseapp.com",
  projectId: "login-test-e5d60",
  storageBucket: "login-test-e5d60.firebasestorage.app",
  messagingSenderId: "244205868281",
  appId: "1:244205868281:web:7b4f95af0a90d090433e28",
  measurementId: "G-KVZ67W0V1Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;