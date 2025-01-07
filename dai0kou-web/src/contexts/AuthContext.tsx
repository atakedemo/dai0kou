'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  accessToken: null,
  loginWithGitHub: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // アプリ起動時にローカルストレージからアクセストークンを読み込む
  useEffect(() => {
    const storedToken = localStorage.getItem('github_access_token');
    if (storedToken) {
      setAccessToken(storedToken);
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
      const credential = GithubAuthProvider.credentialFromResult(result);

      if (credential?.accessToken) {
        setAccessToken(credential.accessToken); // ステートに保存
        localStorage.setItem('github_access_token', credential.accessToken); // ローカルストレージに保存
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
        loginWithGitHub,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);