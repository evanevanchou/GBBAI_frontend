// ----------------------------------------------------------------------

export type IFunctionFilterValue = string | string[] | Date | null;

export type IFunctionFilters = {
  name: string;
  tags: string[];
  statuses: string[];
  startDate: Date | null;
  endDate: Date | null;
};

export type IFunctionShared = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  permission: string;
};

// ----------------------------------------------------------------------

export type IFunctionManager = {
  id: string;
  name: string;
  size: number;
  url: string;
  code: string;
  meta: string;
  dependencies: string[];
  description: string;
  params: string[];
  type: string;
  tags: string[];
  isFavorited: boolean;
  status: string;
  shared: IFunctionShared[] | null;
  createdAt: Date | number | string;
  modifiedAt: Date | number | string;
};

export type IFunction = IFunctionManager;
