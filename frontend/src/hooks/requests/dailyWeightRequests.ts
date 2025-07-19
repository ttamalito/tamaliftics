import { ICreateDailyWeightDto, IUpdateDailyWeightDto } from '@clients';
import { AxiosResponse } from 'axios';
import { useCallback } from 'react';
import useApi from './useApi.ts';
import { routes } from '../../routes/apiRoutes.ts';

export const usePostDailyWeight = (): [
  (body: ICreateDailyWeightDto) => Promise<AxiosResponse | undefined>,
] => {
  const { post } = useApi();
  const callback = useCallback(
    (body: ICreateDailyWeightDto) => {
      return post(routes.dailyWeights.create, body);
    },
    [post],
  );
  return [callback];
};

export const usePutDailyWeight = (): [
  (body: IUpdateDailyWeightDto) => Promise<AxiosResponse | undefined>,
] => {
  const { put } = useApi();
  const callback = useCallback(
    (body: IUpdateDailyWeightDto) => {
      return put(routes.dailyWeights.update, body);
    },
    [put],
  );
  return [callback];
};

export const useGetDailyWeightById = (): [
  (id: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (id: string) => {
      return get(routes.dailyWeights.getById(id));
    },
    [get],
  );
  return [callback];
};

export const useGetAllDailyWeights = (): [
  () => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(() => {
    return get(routes.dailyWeights.getAll);
  }, [get]);
  return [callback];
};

export const useGetDailyWeightsBetweenDates = (): [
  (startDate: string, endDate: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (startDate: string, endDate: string) => {
      const params = new URLSearchParams();
      params.append('startDate', startDate);
      params.append('endDate', endDate);
      return get(routes.dailyWeights.getRange, params);
    },
    [get],
  );
  return [callback];
};

export const useDeleteDailyWeight = (): [
  (id: string) => Promise<AxiosResponse | undefined>,
] => {
  const { Delete } = useApi();
  const callback = useCallback(
    (id: string) => {
      return Delete(routes.dailyWeights.delete(id));
    },
    [Delete],
  );
  return [callback];
};
