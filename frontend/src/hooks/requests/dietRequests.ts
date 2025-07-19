import { ICreateDietDto, IUpdateDietDto } from '@clients';
import { AxiosResponse } from 'axios';
import { useCallback } from 'react';
import useApi from './useApi.ts';
import { routes } from '../../routes/apiRoutes.ts';

export const usePostDiet = (): [
  (body: ICreateDietDto) => Promise<AxiosResponse | undefined>,
] => {
  const { post } = useApi();
  const callback = useCallback(
    (body: ICreateDietDto) => {
      return post(routes.diets.create, body);
    },
    [post],
  );
  return [callback];
};

export const usePutDiet = (): [
  (body: IUpdateDietDto) => Promise<AxiosResponse | undefined>,
] => {
  const { put } = useApi();
  const callback = useCallback(
    (body: IUpdateDietDto) => {
      return put(routes.diets.update, body);
    },
    [put],
  );
  return [callback];
};

export const useGetDietById = (): [
  (id: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (id: string) => {
      return get(routes.diets.getById(id));
    },
    [get],
  );
  return [callback];
};

export const useGetAllDiets = (): [
  () => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(() => {
    return get(routes.diets.getAll);
  }, [get]);
  return [callback];
};

export const useDeleteDiet = (): [
  (id: string) => Promise<AxiosResponse | undefined>,
] => {
  const { Delete } = useApi();
  const callback = useCallback(
    (id: string) => {
      return Delete(routes.diets.delete(id));
    },
    [Delete],
  );
  return [callback];
};

export const usePostAddMealToDiet = (): [
  (dietId: string, mealId: string) => Promise<AxiosResponse | undefined>,
] => {
  const { post } = useApi();
  const callback = useCallback(
    (dietId: string, mealId: string) => {
      return post(routes.diets.addMeal(dietId, mealId), null);
    },
    [post],
  );
  return [callback];
};

export const useDeleteRemoveMealFromDiet = (): [
  (dietId: string, mealId: string) => Promise<AxiosResponse | undefined>,
] => {
  const { Delete } = useApi();
  const callback = useCallback(
    (dietId: string, mealId: string) => {
      return Delete(routes.diets.removeMeal(dietId, mealId));
    },
    [Delete],
  );
  return [callback];
};

export const useGetSearchDietsByName = (): [
  (name: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (name: string) => {
      const params = new URLSearchParams();
      params.append('name', name);
      return get(routes.diets.search, params);
    },
    [get],
  );
  return [callback];
};
