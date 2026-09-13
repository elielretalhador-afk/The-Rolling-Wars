import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging, isSupported } from 'firebase/messaging';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  projectId: "gen-lang-client-0495354481",
  appId: "1:506646024333:web:3262beb37c8eb3fcad52c4",
  apiKey: "AIzaSyAuDft-kpklb542LtwxFCAQMUCdfYl8py8",
  authDomain: "gen-lang-client-0495354481.firebaseapp.com",
  storageBucket: "gen-lang-client-0495354481.firebasestorage.app",
  messagingSenderId: "506646024333",
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, "ai-studio-urbanozeiro-675f17be-1d5e-4948-8a36-ce5490765ddc");
export const auth = getAuth(app);
export const storage = getStorage(app);


export const functions = getFunctions(app, 'us-central1');

export let messaging: any = null;
isSupported().then(supported => {
  if (supported) {
    messaging = getMessaging(app);
  }
});
