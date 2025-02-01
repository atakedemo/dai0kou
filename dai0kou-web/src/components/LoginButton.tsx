'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export function LoginButton() {
  const { user, loading, loginWithGitHub, logout, accessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGitHub()
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      console.log('accessToekn:', accessToken);
      console.log('user :', user)
      await logout();
      console.log('Logout!!!');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <Button onClick={handleLogout} disabled={loading || isLoading}>
        {loading || isLoading ? 'Logging out...' : 'Logout'}
      </Button>
    );
  }

  return (
    <Button onClick={handleLogin} disabled={loading || isLoading}>
      {loading || isLoading ? 'Logging in...' : 'Login with GitHub'}
    </Button>
  );
}