import Cookies from 'universal-cookie';
import { Token } from './types';

export const config = {
  API_URL:
    process.env.NODE_ENV === 'production'
      ? 'TODO'
      : 'http://localhost:8000/api',
};

export const setSessionCookie = (access: string, refresh: string) => {
  new Cookies().set('session', JSON.stringify({ access, refresh }), {
    path: '/',
  });
};

export const getSessionCookie = (): Token => {
  return new Cookies().get('session');
};

export const getAccessToken = (): string => {
  const session: Token = getSessionCookie();
  return session?.access;
};

export const getRefreshToken = (): string => {
  const session: Token = getSessionCookie();
  return session.access;
};

export const clearSessionCookie = () => {
  new Cookies().remove('session');
  window.location.href = '/login';
};

export const sleep = (milliseconds: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
};

export const refreshToken = async (): Promise<boolean> => {
  const token = getSessionCookie();
  const response = await fetch(`${config.API_URL}/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token?.access}`,
    },
    body: JSON.stringify({ refresh: token?.refresh }),
  });
  if (response.status !== 200) {
    return false;
  }
  const json = await response.json();
  setSessionCookie(json.access, token.refresh);
  return true;
};

export const checkIsLoggedIn = async (): Promise<boolean> => {
  const token = getSessionCookie();
  try {
    const response = await fetch(`${config.API_URL}/token/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token?.access}`,
      },
      body: JSON.stringify({ token: token?.access }),
    });
    if (response.status === 200) {
      return true;
    }
    const json = await response.json();
    if (json.code === 'token_not_valid') {
      if (await refreshToken()) {
        return checkIsLoggedIn();
      }
    }
    // window.location.href = "/login";
    return false;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return false;
  }
};
