import React from 'react';
import { Token } from './types';

interface AuthContext {
  user: Token | null;
  setUser: (user: Token | null) => void;
}

export const userContext = React.createContext<AuthContext>({
  user: null,
  setUser: () => {},
});
