import { ICreateMealDto, IUpdateMealDto } from '@clients';
import { AxiosResponse } from 'axios';
import { useCallback } from 'react';
import useApi from './useApi.ts';
import { routes } from '../../routes/apiRoutes.ts';

export const usePostMeal = (): [
  (body: ICreateMealDto) => Promise<AxiosResponse | undefined>,
] => {
  const { post } = useApi();
  const callback = useCallback(
    (body: ICreateMealDto) => {
      return post(routes.meals.create, body);
    },
    [post],
  );
  return [callback];
};

export const usePutMeal = (): [
  (body: IUpdateMealDto) => Promise<AxiosResponse | undefined>,
] => {
  const { put } = useApi();
  const callback = useCallback(
    (body: IUpdateMealDto) => {
      return put(routes.meals.update, body);
    },
    [put],
  );
  return [callback];
};

export const useGetMealById = (): [
  (id: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (id: string) => {
      return get(routes.meals.getById(id));
    },
    [get],
  );
  return [callback];
};

export const useGetAllMeals = (): [
  () => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(() => {
    return get(routes.meals.getAll);
  }, [get]);
  return [callback];
};

export const useDeleteMeal = (): [
  (id: string) => Promise<AxiosResponse | undefined>,
] => {
  const { Delete } = useApi();
  const callback = useCallback(
    (id: string) => {
      return Delete(routes.meals.delete(id));
    },
    [Delete],
  );
  return [callback];
};

export const usePostAddDishToMeal = (): [
  (mealId: string, dishId: string) => Promise<AxiosResponse | undefined>,
] => {
  const { post } = useApi();
  const callback = useCallback(
    (mealId: string, dishId: string) => {
      return post(routes.meals.addDish(mealId, dishId), null);
    },
    [post],
  );
  return [callback];
};

export const useDeleteRemoveDishFromMeal = (): [
  (mealId: string, dishId: string) => Promise<AxiosResponse | undefined>,
] => {
  const { Delete } = useApi();
  const callback = useCallback(
    (mealId: string, dishId: string) => {
      return Delete(routes.meals.removeDish(mealId, dishId));
    },
    [Delete],
  );
  return [callback];
};
