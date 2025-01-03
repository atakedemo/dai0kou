import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyALT5yC13eWF6EmgoZ6kq8vl1WAufWvovc",
    authDomain: "ai-agent-bamb00.firebaseapp.com",
    projectId: "ai-agent-bamb00",
    storageBucket: "ai-agent-bamb00.firebasestorage.app",
    messagingSenderId: "33517488829",
    appId: "1:33517488829:web:6c1ff95d320a81835c85d4",
    measurementId: "G-18GKDZERES"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { auth };

