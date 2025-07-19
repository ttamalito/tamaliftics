import { ICreateWorkoutPlanDto, IUpdateWorkoutPlanDto } from '@clients';
import { AxiosResponse } from 'axios';
import { useCallback } from 'react';
import useApi from './useApi.ts';
import { routes } from '../../routes/apiRoutes.ts';

export const usePostWorkoutPlan = (): [
  (body: ICreateWorkoutPlanDto) => Promise<AxiosResponse | undefined>,
] => {
  const { post } = useApi();
  const callback = useCallback(
    (body: ICreateWorkoutPlanDto) => {
      return post(routes.workoutPlans.create, body);
    },
    [post],
  );
  return [callback];
};

export const usePutWorkoutPlan = (): [
  (body: IUpdateWorkoutPlanDto) => Promise<AxiosResponse | undefined>,
] => {
  const { put } = useApi();
  const callback = useCallback(
    (body: IUpdateWorkoutPlanDto) => {
      return put(routes.workoutPlans.update, body);
    },
    [put],
  );
  return [callback];
};

export const useGetWorkoutPlanById = (): [
  (id: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (id: string) => {
      return get(routes.workoutPlans.getById(id));
    },
    [get],
  );
  return [callback];
};

export const useGetAllWorkoutPlans = (): [
  () => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(() => {
    return get(routes.workoutPlans.getAll);
  }, [get]);
  return [callback];
};

export const useGetWorkoutPlansByDay = (): [
  (day: string) => Promise<AxiosResponse | undefined>,
] => {
  const { get } = useApi();
  const callback = useCallback(
    (day: string) => {
      return get(routes.workoutPlans.getByDay(day));
    },
    [get],
  );
  return [callback];
};

export const useDeleteWorkoutPlan = (): [
  (id: string) => Promise<AxiosResponse | undefined>,
] => {
  const { Delete } = useApi();
  const callback = useCallback(
    (id: string) => {
      return Delete(routes.workoutPlans.delete(id));
    },
    [Delete],
  );
  return [callback];
};

export const usePostAddExerciseToWorkoutPlan = (): [
  (
    workoutPlanId: string,
    exerciseId: string,
  ) => Promise<AxiosResponse | undefined>,
] => {
  const { post } = useApi();
  const callback = useCallback(
    (workoutPlanId: string, exerciseId: string) => {
      return post(
        routes.workoutPlans.addExercise(workoutPlanId, exerciseId),
        null,
      );
    },
    [post],
  );
  return [callback];
};

export const useDeleteRemoveExerciseFromWorkoutPlan = (): [
  (
    workoutPlanId: string,
    exerciseId: string,
  ) => Promise<AxiosResponse | undefined>,
] => {
  const { Delete } = useApi();
  const callback = useCallback(
    (workoutPlanId: string, exerciseId: string) => {
      return Delete(
        routes.workoutPlans.removeExercise(workoutPlanId, exerciseId),
      );
    },
    [Delete],
  );
  return [callback];
};
