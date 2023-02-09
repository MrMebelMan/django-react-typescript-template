import { useEffect } from 'react';
import { Token } from './types';
import { useUser } from './useUser';
import { getSessionCookie } from './utils';

export const useAuth = () => {
  const { user, addUser, removeUser } = useUser();

  useEffect(() => {
    const token = getSessionCookie();
    if (token) {
      console.log(`adding token ${JSON.stringify(token)}`);
      addUser(token);
    }
  }, [addUser]);

  const login = (user: Token | null) => {
    addUser(user);
  };

  const logout = () => {
    removeUser();
  };

  return { user, login, logout };
};
