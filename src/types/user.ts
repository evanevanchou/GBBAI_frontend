export type IUserTableFilterValue = string | string[];

export type IUserTableFilters = {
  name: string;
  role: string[];
  status: string;
};

export type Maintainer = {
  name: string;
  email: string;
  avatar: string;
  permission: string;
};
