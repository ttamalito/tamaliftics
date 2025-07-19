import {
  ICreateExerciseTrackPointDto,
  IUpdateExerciseTrackPointDto,
} from '@clients';
import { AxiosResponse } from 'axios';
import { useCallback } from 'react';
import useApi from './useApi.ts';
import { routes } from '../../routes/apiRoutes.ts';

export const usePostExerciseTrackPoint = (): [
  (body: ICreateExerciseTrackPointDto) => Promise<AxiosResponse | undefined>,
] => {
  const { post } = useApi();
  const callback = useCallback(
    (body: ICreateExerciseTrackPointDto) => {
      return post(routes.exerciseTrackPoints.create, body);
    },
    [post],
  );
  return [callback];
};

export const usePutExerciseTrackPoint = (): [
  (body: IUpdateExerciseTrackPointDto) => Promise<AxiosResponse | undefined>,
] => {
  const { put } = useApi();
  const callback = useCallback(
    (body: IUpdateExerciseTrackPointDto) => {
      return put(routes.exerciseTrackPoints.update, body);
    },
    [put],
  );
  return [callback];
};

export const useGetExerciseTrackPointById = (): [
  (id: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (id: string) => {
      return get(routes.exerciseTrackPoints.getById(id));
    },
    [get],
  );
  return [callback];
};

export const useGetTrackPointsForExercise = (): [
  (exerciseId: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (exerciseId: string) => {
      return get(routes.exerciseTrackPoints.getForExercise(exerciseId));
    },
    [get],
  );
  return [callback];
};

export const usePostTrackPointsForExercises = (): [
  (exerciseIds: string[]) => Promise<AxiosResponse | undefined>,
] => {
  const { post } = useApi();
  const callback = useCallback(
    (exerciseIds: string[]) => {
      return post(routes.exerciseTrackPoints.getForExercises, exerciseIds);
    },
    [post],
  );
  return [callback];
};

export const useGetTrackPointsForExerciseBetweenDates = (): [
  (
    exerciseId: string,
    startDate: string,
    endDate: string,
  ) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (exerciseId: string, startDate: string, endDate: string) => {
      const params = new URLSearchParams();
      params.append('startDate', startDate);
      params.append('endDate', endDate);
      return get(
        routes.exerciseTrackPoints.getForExerciseDateRange(exerciseId),
        params,
      );
    },
    [get],
  );
  return [callback];
};

export const useDeleteExerciseTrackPoint = (): [
  (id: string) => Promise<AxiosResponse | undefined>,
] => {
  const { Delete } = useApi();
  const callback = useCallback(
    (id: string) => {
      return Delete(routes.exerciseTrackPoints.delete(id));
    },
    [Delete],
  );
  return [callback];
};
