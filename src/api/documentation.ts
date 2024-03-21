import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

import { IFaq } from 'src/types/faq';

// ----------------------------------------------------------------------

export function useGetFaqList() {
  const URL = endpoints.documentation.faqs;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      faqList: (data as IFaq[]) || [],
      isLoading,
      hasError: error,
      isValidating,
      isEmpty: !data || (!isLoading && !data.length),
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetContents(section: string) {
  const URL = section ? `${endpoints.documentation.contents}/${section}` : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const mockData: string = '';

  const memoizedValue = useMemo(
    () => ({
      content: data?.content || mockData,
      isLoading,
      hasError: error,
      isValidating,
      isEmpty: !data || (!isLoading && !data.length),
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
