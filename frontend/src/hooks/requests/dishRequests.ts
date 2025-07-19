import { ICreateDishDto, IUpdateDishDto } from '@clients';
import { AxiosResponse } from 'axios';
import { useCallback } from 'react';
import useApi from './useApi.ts';
import { routes } from '../../routes/apiRoutes.ts';

export const usePostDish = (): [
  (body: ICreateDishDto) => Promise<AxiosResponse | undefined>,
] => {
  const { post } = useApi();
  const callback = useCallback(
    (body: ICreateDishDto) => {
      return post(routes.dishes.create, body);
    },
    [post],
  );
  return [callback];
};

export const usePutDish = (): [
  (body: IUpdateDishDto) => Promise<AxiosResponse | undefined>,
] => {
  const { put } = useApi();
  const callback = useCallback(
    (body: IUpdateDishDto) => {
      return put(routes.dishes.update, body);
    },
    [put],
  );
  return [callback];
};

export const useGetDishById = (): [
  (id: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (id: string) => {
      return get(routes.dishes.getById(id));
    },
    [get],
  );
  return [callback];
};

export const useGetAllDishes = (): [
  () => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(() => {
    return get(routes.dishes.getAll);
  }, [get]);
  return [callback];
};

export const useDeleteDish = (): [
  (id: string) => Promise<AxiosResponse | undefined>,
] => {
  const { Delete } = useApi();
  const callback = useCallback(
    (id: string) => {
      return Delete(routes.dishes.delete(id));
    },
    [Delete],
  );
  return [callback];
};

export const useGetSearchDishesByName = (): [
  (name: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (name: string) => {
      const params = new URLSearchParams();
      params.append('name', name);
      return get(routes.dishes.search, params);
    },
    [get],
  );
  return [callback];
};
