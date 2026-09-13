
import { Capacitor } from '@capacitor/core';
import { db, auth } from '../lib/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail,
  signInWithCredential
} from 'firebase/auth';
import { collection, doc, setDoc, getDocs, getDoc, query, where } from 'firebase/firestore';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

// ==========================================
// SERVIÇO DE AUTENTICAÇÃO E IDENTIDADE
// ==========================================

export interface AuthUser {
  uid: string; // Equivalente ao playerId
  username: string;
  email?: string;
  phone?: string;
  accountVerified: boolean;
  authProvider: 'local' | 'google';
}

const AUTH_TOKEN_KEY = 'urbanozeiro_auth_token';

export const AuthService = {
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const savedSession = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!savedSession) return null;
      
      const session = JSON.parse(savedSession) as AuthUser;
      return session;
    } catch {
      return null;
    }
  },

  async login(username: string, password: string): Promise<AuthUser> {
    // 1. Encontrar o e-mail associado a este nome de usuário
    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      const err = new Error("Usuário não encontrado.");
      (err as any).code = 'auth/user-not-found';
      throw err;
    }
    
    const email = querySnapshot.docs[0].data().email;

    // 2. Tentar login com e-mail e senha
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;
    
    const sessionUser: AuthUser = {
      uid: fbUser.uid,
      username: username,
      email: fbUser.email || undefined,
      accountVerified: true,
      authProvider: 'local'
    };
    
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  async register(username: string, email: string, password: string): Promise<AuthUser> {
    // 0. Validar nome de usuário
    if (username.includes(' ') || username.includes('@')) {
      const err = new Error("Nome de usuário inválido. Não use espaços ou @.");
      (err as any).code = 'auth/invalid-username';
      throw err;
    }
    
    // 1. Verificar se o nome de usuário já está em uso
    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const err = new Error("Este nome de usuário já está em uso.");
      (err as any).code = 'auth/username-already-in-use';
      throw err;
    }

    let fbUser;
    try {
      // 2. Tentar criar conta
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      fbUser = userCredential.user;
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        // Fluxo seguro: Tentar logar com a senha fornecida para associar o username
        try {
          const loginCredential = await signInWithEmailAndPassword(auth, email, password);
          fbUser = loginCredential.user;
          
          // Verificar se a conta já possui username no firestore
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists() && userDoc.data().username) {
            const existingUsername = userDoc.data().username;
            const err2 = new Error(`Esta conta de e-mail já está associada ao usuário: ${existingUsername}`);
            (err2 as any).code = 'auth/email-already-has-username';
            throw err2;
          }
        } catch (loginErr: any) {
          if (loginErr.code === 'auth/wrong-password' || loginErr.code === 'auth/invalid-credential') {
             const err3 = new Error("Este e-mail já está cadastrado (provavelmente via Google). Para usar uma senha, redefina-a através do 'Esqueci minha senha'.");
             (err3 as any).code = 'auth/wrong-password-for-existing';
             throw err3;
          }
          throw loginErr;
        }
      } else {
        throw err;
      }
    }
    
    // 3. Atualizar perfil e salvar no Firestore
    await updateProfile(fbUser, {
      displayName: username
    });
    
    await setDoc(doc(db, 'users', fbUser.uid), {
      uid: fbUser.uid,
      username: username,
      email: fbUser.email
    }, { merge: true });
    
    const sessionUser: AuthUser = {
      uid: fbUser.uid,
      username: username,
      email: fbUser.email || undefined,
      accountVerified: true,
      authProvider: 'local'
    };
    
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    try { await signOut(auth); } catch(e) {}
    try { await FirebaseAuthentication.signOut(); } catch(e) {}
  },

  async loginWithGoogle(): Promise<AuthUser> {
    let fbUser;
    
    if (Capacitor.isNativePlatform()) {
      const result = await FirebaseAuthentication.signInWithGoogle();
      const credential = GoogleAuthProvider.credential(result.credential?.idToken);
      const userCredential = await signInWithCredential(auth, credential);
      fbUser = userCredential.user;
    } else {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      fbUser = result.user;
    }
    
    // Validate or generate username
    const userDocRef = doc(db, 'users', fbUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    let username = fbUser.displayName || 'GooglePlayer';
    const email = fbUser.email || '';

    if (userDoc.exists() && userDoc.data().username) {
      username = userDoc.data().username;
    } else {
      // Save new Google user
      try {
        await setDoc(userDocRef, {
          uid: fbUser.uid,
          username: username,
          email: email
        }, { merge: true });
      } catch (e) {}
    }

    const sessionUser: AuthUser = {
      uid: fbUser.uid,
      username: username,
      email: email || undefined,
      accountVerified: true,
      authProvider: 'google'
    };
        
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  async requestPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }
};
