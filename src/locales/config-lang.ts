import merge from 'lodash/merge';
import { enUS as enUSAdapter, zhCN as zhCNAdapter } from 'date-fns/locale';

// core
import { enUS as enUSCore, zhCN as zhCNCore } from '@mui/material/locale';
// data-grid
import { enUS as enUSDataGrid, zhCN as zhCNDataGrid } from '@mui/x-data-grid';
// date-pickers
import { enUS as enUSDate, zhCN as zhCNDate } from '@mui/x-date-pickers/locales';

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: 'English',
    value: 'en',
    systemValue: merge(enUSDate, enUSDataGrid, enUSCore),
    adapterLocale: enUSAdapter,
    icon: 'flagpack:gb-nir',
  },
  {
    label: 'Chinese',
    value: 'cn',
    systemValue: merge(zhCNDate, zhCNDataGrid, zhCNCore),
    adapterLocale: zhCNAdapter,
    icon: 'flagpack:cn',
  },
];

export const defaultLang = allLangs[0]; // English

// GET MORE COUNTRY FLAGS
// https://icon-sets.iconify.design/flagpack/
// https://www.dropbox.com/sh/nec1vwswr9lqbh9/AAB9ufC8iccxvtWi3rzZvndLa?dl=0
