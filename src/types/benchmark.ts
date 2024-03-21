// ----------------------------------------------------------------------

export type IBenchmarkFilterValue = string | string[] | Date | null;

export type IBenchmarkFilters = {
  name: string;
  tags: string[];
  statuses: string[];
  startDate: Date | null;
  endDate: Date | null;
};

export type IBenchmarkShared = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  permission: string;
};

// ----------------------------------------------------------------------

export type IBenchmarkManager = {
  id: string;
  name: string;
  size: number;
  url: string;
  description: string;
  params: string[];
  type: string;
  tags: string[];
  isFavorited: boolean;
  status: string;
  shared: IBenchmarkShared[] | null;
  createdAt: Date | number | string;
  modifiedAt: Date | number | string;
};

export type IBenchmark = IBenchmarkManager;
