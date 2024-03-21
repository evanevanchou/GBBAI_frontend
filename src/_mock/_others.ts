import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const _faqs = [...Array(8)].map((_, index) => ({
  id: _mock.id(index),
  value: `panel${index + 1}`,
  question: `Questions ${index + 1}`,
  answer: _mock.description(index),
}));
