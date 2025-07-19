import { AxiosResponse } from 'axios';
import { useCallback } from 'react';
import useApi from './useApi.ts';
import { routes } from '../../routes/apiRoutes.ts';

export const useGetWeeklyWeightById = (): [
  (id: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (id: string) => {
      return get(routes.weeklyWeights.getById(id));
    },
    [get],
  );
  return [callback];
};

export const useGetAllWeeklyWeights = (): [
  () => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(() => {
    return get(routes.weeklyWeights.getAll);
  }, [get]);
  return [callback];
};

export const useGetWeeklyWeightsByYear = (): [
  (year: number) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (year: number) => {
      return get(routes.weeklyWeights.getByYear(year));
    },
    [get],
  );
  return [callback];
};

export const useGetWeeklyWeightsBetweenDates = (): [
  (startDate: string, endDate: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (startDate: string, endDate: string) => {
      const params = new URLSearchParams();
      params.append('startDate', startDate);
      params.append('endDate', endDate);
      return get(routes.weeklyWeights.getRange, params);
    },
    [get],
  );
  return [callback];
};

export const useGetWeeklyWeightForDate = (): [
  (date: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (date: string) => {
      const params = new URLSearchParams();
      params.append('date', date);
      return get(routes.weeklyWeights.getForDate, params);
    },
    [get],
  );
  return [callback];
};
