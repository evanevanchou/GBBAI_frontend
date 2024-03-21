// ----------------------------------------------------------------------

export type IDatasetFilterValue = string | string[] | Date | null;

export type IDatasetFilters = {
  name: string;
  tags: string[];
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};

export type IQaTableFilters = {
  name: string;
  tags: string[];
  topics: string[];
  statuses: string[];
  startDate: Date | null;
  endDate: Date | null;
};

export type IKbTableFilters = {
  name: string;
  types: string[];
  statuses: string[];
  startDate: Date | null;
  endDate: Date | null;
};

export type IDatasetShared = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  permission: string;
};

export type Maintainer = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  permission?: string;
};

export type DatasetMetricManager = {
  totalDatasets: number;
  totalItems: number;
  totalTopics: number;
};

export type ActivityManager = {
  labels: string[];
  series: { name: string; data: number[] }[];
};

export type RecentUpdateManager = {
  name: string;
  dateUpdated: string;
  filesCount: number;
};

export type DatasetCountManager = {
  name: string;
  count: number;
};

export type QaItemManager = {
  id: string;
  type: string;
  topic: string;
  content: string;
  attachments: { nodeId: string; files: (File | string)[] }[];
  lastModifiedBy: Maintainer;
  dateCreated: Date | number | string;
  dateModified: Date | number | string;
  tags?: string[];
  status?: string; // "added" | "updated" | "deleted";
  itemStatus?: string; // "C" | "D" | "U";
};

export type DatasetQaManager = {
  id: string;
  title: string;
  tags: string[];
  maintainers: Maintainer[];
  dateCreated: Date | number | string;
  dateModified: Date | number | string;
  data: QaItemManager[];
  topics: string[];
  amount?: number;
  localData?: QaItemManager[];
  lastEvaluatedKey?: string;
};

export type RagSourceManager = {
  id: string;
  name: string;
  type: string;
  index: string;
  status: string;
};

export type KbItemManager = {
  id: string;
  name: string;
  tags: string[];
  url: string;
  storage: { account: string; container: string };
  shared: Maintainer[];
  createdAt: Date | number | string;
  modifiedAt: Date | number | string;
  // data: QaItemManager[];
  type: string;
  status: string;
  error?: string;
  size: number;
  chunks: number;
  isFavorited: boolean;
  lastEvaluatedKey?: string;
};

export type DatasetManager = {
  id: string;
  title: string;
  tags: string[];
  type?: string;
  count?: number | string;
  description?: string;
  maintainers: Maintainer[];
  dateCreated: Date | number | string;
  dateModified: Date | number | string;
  isDeleting?: boolean;
};

// ----------------------------------------------------------------------

export type IDatasetManager = {
  id: string;
  name: string;
  size: number;
  type: string;
  tags: string[];
  isFavorited: boolean;
  index?: string;
  status: string;
  shared: IDatasetShared[] | null;
  createdAt: Date | number | string;
  modifiedAt: Date | number | string;
};

export type IDataset = IDatasetManager;

export type IConfiguration = {
  'open-chat-Deployment': string;
  'open-chat-Past messages included': string;
  'open-chat-Temperature': string;
  'open-chat-Top P': string;
  'open-chat-Max response': string;
  'open-chat-Stop sequence': string;
  'open-chat-Frequency penalty': string;
  'open-chat-Presence penalty': string;
  'open-chat-System message': string;
  'open-chat-Should stream': boolean;

  'rag-Deployment': string;
  'rag-Past messages included': string;
  'rag-Temperature': string;
  'rag-Top P': string;
  'rag-Max response': string;
  'rag-Stop sequence': string;
  'rag-Frequency penalty': string;
  'rag-Presence penalty': string;
  'rag-Retrieve count': string;
  'rag-System message': string;
  'rag-Should stream': boolean;
  'rag-Retrieval mode': string;
  'rag-Use semantic ranker': boolean;

  'function-calling-Deployment': string;
  'function-calling-Past messages included': string;
  'function-calling-Temperature': string;
  'function-calling-Top P': string;
  'function-calling-Max response': string;
  'function-calling-Stop sequence': string;
  'function-calling-Frequency penalty': string;
  'function-calling-Presence penalty': string;
  'function-calling-System message': string;
  'function-calling-Should stream': boolean;

  [key: string]: any;
};

