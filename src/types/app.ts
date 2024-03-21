import { ColorType } from 'src/theme/palette';

import { Maintainer } from './user';

// ----------------------------------------------------------------------

export type AppFilterStruct = {
  scenario: string[];
  category: string;
  colors: string[];
  priceRange: string;
  rating: string;
};

export type AppFilterValueStruct = string | string[] | number | number[];

export type MlAppStruct = {
  category: string;
  content: string;
  cover: string;
  dateCreated: string;
  dateModified: string;
  id: string;
  rating: number;
  scenario: string;
  scenarios: { title: string; color: ColorType }[];
  title: string;
  type: string;
  tags: string[];
  maintainers: Maintainer[];
  totalRating: number;
};
