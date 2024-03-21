import { _mock } from './_mock';

// ----------------------------------------------------------------------

const BENCHMAKR_JOBS = ['GPT 4v benchmark', 'PTU vs. PAYGO', 'PTU vs. PAYGO'];

const CODE_DESCRIPTIONS = [
  'Test the latency of GPT 4v in Canada region.',
  `Run the benchmark in Sweden central region.`,
  `Run the benchmark in East US 2 region.`,
  'Retives a video from the database based on the given location.',
  'An application that is used to perform mathematical calculations.',
  'Acquire information about the current weather conditions in your area.',
  'The process involves obtaining data related to the stock market',
  'An in-depth examination of the current sales trends in the market, including a comprehensive analysis of factors influencing these trends',
];

const PARAMS = [
  ['query', 'user_id'],
  ['item'],
  ['customer_id', 'order_id'],
  ['time_filter', 'location'],
  ['num1', 'num2', 'operator'],
  ['location'],
  ['stock_code', 'start_date', 'end_date'],
  ['time'],
];

const SHARED_PERSONS = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  name: `Admin ${index + 1}`,
  email: `admin${index + 1}@gbb-ai.com`,
  avatarUrl: _mock.image.avatar(index),
  permission: index % 2 ? 'view' : 'edit',
}));

const statuses = ['Completed', 'Running', 'Failed', 'Completed'];

const tags = [
  ['Dev'],
  ['Prod'],
  ['Test'],
  ['Assistant'],
  ['Assistant'],
  ['Stock'],
  ['Sales'],
  ['Fitness'],
  ['Nature'],
  ['Business'],
];

// ----------------------------------------------------------------------

const shared = (index: number) =>
  (index === 0 && SHARED_PERSONS.slice(0, 5)) ||
  (index === 1 && SHARED_PERSONS.slice(5, 9)) ||
  (index === 2 && SHARED_PERSONS.slice(9, 11)) ||
  (index === 3 && SHARED_PERSONS.slice(11, 12)) ||
  [];

export const _allBenchmarks = BENCHMAKR_JOBS.map((name, index) => ({
  id: `benchmark_${index + 1}`,
  name,
  url: '',
  size: 0,
  shared: shared(index),
  description: CODE_DESCRIPTIONS[index],
  params: PARAMS[index],
  tags: tags[index],
  createdAt: _mock.time(index),
  modifiedAt: _mock.time(index),
  type: `${name.split('.').pop()}`,
  status: statuses[index],
  isFavorited: true,
}));
