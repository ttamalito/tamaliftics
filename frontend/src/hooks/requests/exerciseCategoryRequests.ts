import {
  ICreateExerciseCategoryDto,
  IUpdateExerciseCategoryDto,
} from '@clients';
import { AxiosResponse } from 'axios';
import { useCallback } from 'react';
import useApi from './useApi.ts';
import { routes } from '../../routes/apiRoutes.ts';

export const usePostExerciseCategory = (): [
  (body: ICreateExerciseCategoryDto) => Promise<AxiosResponse | undefined>,
] => {
  const { post } = useApi();
  const callback = useCallback(
    (body: ICreateExerciseCategoryDto) => {
      return post(routes.exerciseCategories.create, body);
    },
    [post],
  );
  return [callback];
};

export const usePutExerciseCategory = (): [
  (body: IUpdateExerciseCategoryDto) => Promise<AxiosResponse | undefined>,
] => {
  const { put } = useApi();
  const callback = useCallback(
    (body: IUpdateExerciseCategoryDto) => {
      return put(routes.exerciseCategories.update, body);
    },
    [put],
  );
  return [callback];
};

export const useGetExerciseCategoryById = (): [
  (id: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (id: string) => {
      return get(routes.exerciseCategories.getById(id));
    },
    [get],
  );
  return [callback];
};

export const useGetAllExerciseCategories = (): [
  () => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(() => {
    return get(routes.exerciseCategories.getAll);
  }, [get]);
  return [callback];
};

export const useDeleteExerciseCategory = (): [
  (id: string) => Promise<AxiosResponse | undefined>,
] => {
  const { Delete } = useApi();
  const callback = useCallback(
    (id: string) => {
      return Delete(routes.exerciseCategories.delete(id));
    },
    [Delete],
  );
  return [callback];
};

export const useGetSearchExerciseCategoriesByName = (): [
  (name: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (name: string) => {
      const params = new URLSearchParams();
      params.append('name', name);
      return get(routes.exerciseCategories.search, params);
    },
    [get],
  );
  return [callback];
};
