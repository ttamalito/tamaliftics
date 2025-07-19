import { ICreateExerciseDto, IUpdateExerciseDto } from '@clients';
import { AxiosResponse } from 'axios';
import { useCallback } from 'react';
import useApi from './useApi.ts';
import { routes } from '../../routes/apiRoutes.ts';

export const usePostExercise = (): [
  (body: ICreateExerciseDto) => Promise<AxiosResponse | undefined>,
] => {
  const { post } = useApi();
  const callback = useCallback(
    (body: ICreateExerciseDto) => {
      return post(routes.exercises.create, body);
    },
    [post],
  );
  return [callback];
};

export const usePutExercise = (): [
  (body: IUpdateExerciseDto) => Promise<AxiosResponse | undefined>,
] => {
  const { put } = useApi();
  const callback = useCallback(
    (body: IUpdateExerciseDto) => {
      return put(routes.exercises.update, body);
    },
    [put],
  );
  return [callback];
};

export const useGetExerciseById = (): [
  (id: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (id: string) => {
      return get(routes.exercises.getById(id));
    },
    [get],
  );
  return [callback];
};

export const useGetAllExercises = (): [
  () => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(() => {
    return get(routes.exercises.getAll);
  }, [get]);
  return [callback];
};

export const useGetExercisesByCategory = (): [
  (categoryId: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (categoryId: string) => {
      return get(routes.exercises.getByCategory(categoryId));
    },
    [get],
  );
  return [callback];
};

export const useDeleteExercise = (): [
  (id: string) => Promise<AxiosResponse | undefined>,
] => {
  const { Delete } = useApi();
  const callback = useCallback(
    (id: string) => {
      return Delete(routes.exercises.delete(id));
    },
    [Delete],
  );
  return [callback];
};

export const useGetSearchExercisesByName = (): [
  (name: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (name: string) => {
      const params = new URLSearchParams();
      params.append('name', name);
      return get(routes.exercises.search, params);
    },
    [get],
  );
  return [callback];
};
