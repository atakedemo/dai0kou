'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, GithubAuthProvider, getIdToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  idToken: string | null;
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  accessToken: null,
  idToken: null,
  loginWithGitHub: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    const storedTokenGithub = localStorage.getItem('github_access_token');
    if (storedTokenGithub) {
      setAccessToken(storedTokenGithub);
    }const storedTokenFirebase = localStorage.getItem('firebase_access_token');
    if (storedTokenFirebase) {
      setIdToken(storedTokenFirebase);
    }

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGitHub = async () => {
    try {
      setLoading(true);
      const provider = new GithubAuthProvider();
      provider.addScope('repo');
      provider.addScope('write:repo_hook'); 
      const result = await signInWithPopup(auth, provider);

      // Set Github Token
      const credential = GithubAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setAccessToken(credential.accessToken); // ステートに保存
        localStorage.setItem('github_access_token', credential.accessToken); // ローカルストレージに保存
      }

      // Set Firebase Token
      const firebaseToken = await getIdToken(result.user);
      if(firebaseToken) {
        console.log(firebaseToken)
        setIdToken(firebaseToken)
        localStorage.setItem('firebase_access_token', firebaseToken); 
      }

      setUser(result.user);
    } catch (error) {
      console.error('GitHubログイン失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('github_access_token'); // ローカルストレージから削除
    } catch (error) {
      console.error('ログアウト失敗:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        accessToken,
        idToken,
        loginWithGitHub,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);