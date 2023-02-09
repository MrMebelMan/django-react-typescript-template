import { useContext } from 'react';
import { userContext } from './context';
import { Token } from './types';
import { clearSessionCookie, setSessionCookie } from './utils';

export const useUser = () => {
  const { user, setUser } = useContext(userContext);

  const addUser = (user: Token | null) => {
    if (!user) {
      console.log(`!user ${JSON.stringify(user)}`);
      return;
    }
    console.log(`setting user ${JSON.stringify(user)}`);
    setUser({ access: user.access, refresh: user.refresh });
    setSessionCookie(user.access, user.refresh);
  };

  const removeUser = () => {
    clearSessionCookie();
    setUser(null);
  };

  return { user, addUser, removeUser };
};
