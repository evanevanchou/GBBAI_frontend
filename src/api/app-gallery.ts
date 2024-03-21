import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

import { MlAppStruct } from 'src/types/app';

// ----------------------------------------------------------------------

export function useGetApps() {
  const URL = endpoints.app.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      apps: (data as MlAppStruct[]) || [],
      appsLoading: isLoading,
      appsError: error,
      appsValidating: isValidating,
      appsEmpty: !data || (!isLoading && !data.length),
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetApp(id: string) {
  const URL = id ? `${endpoints.app.list}/${id}` : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  // console.log(data);

  const memoizedValue = useMemo(
    () => ({
      app: data?.message as MlAppStruct,
      appLoading: isLoading,
      appError: error,
      appValidating: isValidating,
    }),
    [data?.message, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetLatestPosts(title: string) {
  const URL = title ? [endpoints.post.latest, { params: { title } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      latestPosts: (data?.latestPosts as MlAppStruct[]) || [],
      latestPostsLoading: isLoading,
      latestPostsError: error,
      latestPostsValidating: isValidating,
      latestPostsEmpty: !isLoading && !data?.latestPosts.length,
    }),
    [data?.latestPosts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchPosts(query: string) {
  const URL = query ? [endpoints.post.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: (data?.results as MlAppStruct[]) || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
