import { sub } from 'date-fns';

import { _id, _descriptions } from './assets';

// ----------------------------------------------------------------------

export const _mock = {
  id: (index: number) => _id[index],
  time: (index: number) => sub(new Date(), { days: index, hours: index }),
  // Text
  description: (index: number) => _descriptions[index],
  // Image
  image: {
    avatar: (index: number) => `/assets/avatars/avatar_${index + 1}.jpg`,
  },
};
