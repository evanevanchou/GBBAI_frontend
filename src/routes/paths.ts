import { paramCase } from 'src/utils/change-case';

import { _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  GBB: '/gbb-ai',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  documentation: {
    root: `${ROOTS.GBB}/documentation`,
    introduction: `${ROOTS.GBB}/documentation/introduction`,
    setupToUse: `${ROOTS.GBB}/documentation/setup-to-use`,
    faqs: `${ROOTS.GBB}/documentation/faqs`,
  },
  // post: {
  //   root: `/post`,
  //   details: (id: string) => `/post/details/${id}`,
  // },
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
    ad: {
      login: `${ROOTS.AUTH}/ad/login`,
    },
  },
  // DASHBOARD
  gbbai: {
    root: ROOTS.GBB,
    permission: `${ROOTS.GBB}/permission`,
    kb: {
      root: `${ROOTS.GBB}/kb`,
      details: (id: string) => `${ROOTS.GBB}/kb/${id}`,
      edit: (id: string) => `${ROOTS.GBB}/kb/${id}/edit`,
    },
    function: {
      root: `${ROOTS.GBB}/function`,
      details: (id: string) => `${ROOTS.GBB}/function/${id}`,
      edit: (id: string) => `${ROOTS.GBB}/function/${id}/edit`,
    },
    appGallery: {
      root: `${ROOTS.GBB}/app-gallery`,
      details: (id: string) => `${ROOTS.GBB}/app-gallery/${id}`,
      edit: (id: string) => `${ROOTS.GBB}/app-gallery/${id}/edit`,
      aiContentGenerator: {
        root: `${ROOTS.GBB}/app-gallery/ai-content-generator`,
        list: `${ROOTS.GBB}/app-gallery/ai-content-generator`,
        new: `${ROOTS.GBB}/app-gallery/ai-content-generator/new`,
        edit: (id: string) => `${ROOTS.GBB}/app-gallery/ai-content-generator/${id}/edit`,
        details: (title: string) =>
          `${ROOTS.GBB}/app-gallery/ai-content-generator/${paramCase(title)}`,
      },
    },
    benchmark: {
      root: `${ROOTS.GBB}/benchmark`,
      details: (id: string) => `${ROOTS.GBB}/benchmark/${id}`,
      edit: (id: string) => `${ROOTS.GBB}/benchmark/${id}/edit`,
    },
    user: {
      root: `${ROOTS.GBB}/user`,
      account: `${ROOTS.GBB}/user/account`,
    },
    post: {
      root: `${ROOTS.GBB}/post`,
      new: `${ROOTS.GBB}/post/new`,
      details: (title: string) => `${ROOTS.GBB}/post/${paramCase(title)}`,
      edit: (title: string) => `${ROOTS.GBB}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.GBB}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.GBB}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },
  },
};
