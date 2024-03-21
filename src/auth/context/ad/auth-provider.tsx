import { useMemo, useState, useCallback } from 'react';
import { MsalProvider, useIsAuthenticated } from '@azure/msal-react';

import {
  removeStorage,
  AOAI_CREDENTIAL_KEY,
  AOAI_STORAGE_CONFIG,
} from 'src/hooks/use-local-storage';

import { msalInstance } from 'src/main';
import { loginRequest } from 'src/authConfig';

import { AuthContext } from './auth-context';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

function AuthProviderWrapper({ children }: Props) {
  // const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [popupClick, setPopupClick] = useState(false);

  // LOGIN
  const handleLoginWithPopup = useCallback(async () => {
    try {
      setPopupClick(true);
      await msalInstance.loginPopup(loginRequest);
      setPopupClick(false);
    } catch (e) {
      setPopupClick(false);
      console.error(e);
    }
  }, []);

  // const handleLoginWithPopup = () => {
  //   instance.loginPopup(loginRequest).catch((e) => {
  //     console.log(e);
  //   });
  // };

  // LOGOUT
  const handleLogoutWithPopup = useCallback(async () => {
    msalInstance.logoutPopup({
      postLogoutRedirectUri: '/',
      mainWindowRedirectUri: '/',
    });
    removeStorage(AOAI_CREDENTIAL_KEY);
    removeStorage(AOAI_STORAGE_CONFIG);
  }, []);

  // const handleLogoutWithPopup = () => {
  //   instance.logoutPopup({
  //     postLogoutRedirectUri: '/',
  //     mainWindowRedirectUri: '/',
  //   });
  // };

  // const status = popupClick ? 'loading' : isAuthenticated ? 'authenticated' : 'unauthenticated';

  let status = 'unauthenticated';
  if (popupClick) {
    status = 'loading';
  } else if (isAuthenticated) {
    status = 'authenticated';
  }

  const user = msalInstance.getAllAccounts()[0] || null;

  const memoizedValue = useMemo(
    () => ({
      user: {
        ...user,
        displayName: user?.name,
        photoURL: '',
        role: 'admin',
      },
      method: 'ad',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      loginWithPopup: handleLoginWithPopup,
      logout: handleLogoutWithPopup,
    }),
    [handleLoginWithPopup, handleLogoutWithPopup, status, user]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

// ----------------------------------------------------------------------

export const AuthProvider = ({ children }: Props) => (
  <MsalProvider instance={msalInstance}>
    <AuthProviderWrapper>{children}</AuthProviderWrapper>
  </MsalProvider>
);
