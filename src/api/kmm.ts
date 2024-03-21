import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { endpoints, fetcherWithRefreshKey } from 'src/utils/axios';

import { IDataset, KbItemManager } from 'src/types/dataset';

// ----------------------------------------------------------------------

export function useGetKmmList(refreshKey: number) {
  const URL = endpoints.kmm.list;

  const { data, isLoading, error, isValidating } = useSWR([URL, refreshKey], fetcherWithRefreshKey);

  const memoizedValue = useMemo(
    () => ({
      kmmList: (data as IDataset[]) || [],
      isLoading,
      hasError: error,
      isValidating,
      isEmpty: !data || (!isLoading && !data.length),
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetKbMeta(id: string, refreshKey: number) {
  const URL = id ? `${endpoints.kmm.root}/${id}` : '';

  const { data, isLoading, error, isValidating } = useSWR([URL, refreshKey], fetcherWithRefreshKey);

  const memoizedValue = useMemo(
    () => ({
      kbMeta: (data as IDataset) || null,
      isLoading,
      hasError: error,
      isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetKbItems(id: string, refreshKey: number) {
  const URL = id ? `${endpoints.kmm.root}/${id}/items` : '';

  const { data, isLoading, error, isValidating } = useSWR([URL, refreshKey], fetcherWithRefreshKey);

  const memoizedValue = useMemo(
    () => ({
      kbItems: (data as KbItemManager[]) || [],
      isLoading,
      hasError: error,
      isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function getKbItem(kbId: string, id: string) {
  const URL = id ? `${endpoints.kmm.root}/${kbId}/items/${id}` : '';

  try {
    const res = await axios.get(URL);
    if (res.status === 200) {
      return res.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// ----------------------------------------------------------------------

export async function uploadSource(id: string, fileData: FormData) {
  const URL = id ? `${endpoints.kmm.kb}/${id}/upload` : '';

  try {
    const res = await axios.post(URL, fileData);
    if (res.status === 200) {
      return res.data;
    }
    return res;
  } catch (error) {
    return error;
  }
}

// ----------------------------------------------------------------------

export async function createKnowledge(payload: {
  indexName: string;
  kbName: string;
  tags: string[];
}) {
  const URL = endpoints.kmm.create;

  try {
    const res = await axios.post(URL, payload);
    if (res.status === 200) {
      return res.data;
    }
    return null;
  } catch (error) {
    return error;
  }
}

// ----------------------------------------------------------------------

export async function deleteKnowledge(kbId: string, indexName: string) {
  const URL = kbId ? `${endpoints.kmm.root}/delete` : '';

  try {
    const res = await axios.post(URL, { kbId, indexName });
    if (res.status === 200) {
      return res.data;
    }
    return null;
  } catch (error) {
    return error;
  }
}

// ----------------------------------------------------------------------

export async function indexFiles(
  kbId: string,
  fileId: string,
  payload: { indexName: string; filePrefix: string; containerName: string }
) {
  const URL = kbId && fileId ? `${endpoints.kmm.kb}/${kbId}/index/${fileId}` : '';

  try {
    const res = await axios.post(URL, payload);
    if (res.status === 200) {
      return res.data;
    }
    return null;
  } catch (error) {
    return error;
  }
}
