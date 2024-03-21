import axios, { AxiosRequestConfig } from 'axios';

import { msalInstance } from 'src/main';
import { BACKEND_API } from 'src/config-global';
import { msalConfig, loginRequest } from 'src/authConfig';

// ----------------------------------------------------------------------

export async function getToken(): Promise<string> {
  const currentAccount = msalInstance.getAllAccounts()[0];

  if (currentAccount && currentAccount.idTokenClaims) {
    if (currentAccount.idTokenClaims.aud === msalConfig.auth.clientId) {
      const accessTokenRequest = {
        ...loginRequest,
        account: currentAccount,
      };
      const accessTokenResponse = await msalInstance.acquireTokenSilent(accessTokenRequest);
      return `Bearer ${accessTokenResponse.accessToken}`;
      // const roles = (currentAccount.idTokenClaims as { [key: string]: any }).roles;
      // if (roles) {
      //   const intersection = Object.keys(appRoles).filter((role) => roles.includes(role));
      //   if (intersection.length > 0) {
      //     const accessTokenResponse = await msalInstance.acquireTokenSilent(accessTokenRequest);
      //     return `Bearer ${accessTokenResponse.accessToken}`;
      //   }
      // }
    }
    return '';
  }
  throw new Error('No active account found');
}

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: BACKEND_API });

axiosInstance.interceptors.request.use(async (config) => {
  const bearer = await getToken();
  config.headers.Authorization = bearer;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

export const fetcherWithRefreshKey = async (
  args: [string, number] | [string, number, AxiosRequestConfig]
) => {
  const [url, refreshKey, config] = args;

  const res = await axiosInstance.get(`${url}?refreshKey=${refreshKey}`, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/api/account/my-account',
    login: '/api/account/login',
    register: '/api/auth/register',
  },
  post: {
    list: '/post/list',
    details: '/post/details',
    latest: '/post/latest',
    search: '/post/search',
  },
  app: {
    list: '/apps',
  },
  kmm: {
    root: '/kmm',
    list: '/kmm/list',
    kb: '/kmm/kb',
    create: '/kmm/kb/create',
  },
  documentation: {
    root: '/documentation',
    faqs: '/documentation/faqs',
    contents: '/documentation/contents',
  },
};
