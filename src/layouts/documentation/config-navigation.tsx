import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      // ----------------------------------------------------------------------
      {
        subheader: t('Getting started'),
        items: [
          {
            title: t('Introduction'),
            path: paths.documentation.introduction,
          },
          {
            title: t('Setup to use'),
            path: paths.documentation.setupToUse,
          },
          {
            title: t('Deploy on Azure'),
            path: `${paths.documentation.root}/deploy-on-azure`,
          },
        ],
      },
      {
        subheader: t('Knowledge Module'),
        items: [
          {
            title: t('Chapter 1'),
            path: paths.maintenance,
          },
        ],
      },
      {
        subheader: t('Function Module'),
        items: [
          {
            title: t('Chapter 1'),
            path: paths.maintenance,
          },
        ],
      },
      {
        subheader: t('GPT Store'),
        items: [
          {
            title: t('Chapter 1'),
            path: paths.maintenance,
          },
        ],
      },
      {
        subheader: t('Dashboard Module'),
        items: [
          {
            title: t('Chapter 1'),
            path: paths.maintenance,
          },
        ],
      },
      {
        subheader: t('Tutorials'),
        items: [
          {
            title: t('user'),
            path: paths.gbbai.user.root,
            children: [
              { title: t('cards'), path: paths.maintenance },
              { title: t('list'), path: paths.maintenance },
              { title: t('create'), path: paths.maintenance },
              { title: t('edit'), path: paths.maintenance },
            ],
          },
        ],
      },
      {
        subheader: t('About'),
        items: [
          {
            title: t('Author'),
            path: paths.maintenance,
          },
          {
            title: t('Faqs'),
            path: paths.documentation.faqs,
          },
          {
            title: t('changelog'),
            path: paths.maintenance,
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
