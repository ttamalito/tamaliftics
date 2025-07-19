import { ILoginRequestDto, ISignupRequestDto } from '@clients';
import { AxiosResponse } from 'axios';
import { useCallback } from 'react';
import useApi from './useApi.ts';
import { routes } from '../../routes/apiRoutes.ts';

export const usePostLogin = (): [
  (body: ILoginRequestDto) => Promise<AxiosResponse | undefined>,
] => {
  const { postLogin } = useApi();
  const callback = useCallback(
    (body: ILoginRequestDto) => {
      return postLogin(routes.auth.login, body);
    },
    [postLogin],
  );
  return [callback];
};

export const usePostSignup = (): [
  (body: ISignupRequestDto) => Promise<AxiosResponse | undefined>,
] => {
  const { post } = useApi();
  const callback = useCallback(
    (body: ISignupRequestDto) => {
      return post(routes.auth.signup, body);
    },
    [post],
  );
  return [callback];
};

export const useGetPing = (): [() => Promise<AxiosResponse | undefined>] => {
  const { get } = useApi();
  const callback = useCallback(() => {
    return get(routes.auth.ping);
  }, [get]);
  return [callback];
};

export const useDeleteUser = (): [
  (username: string) => Promise<AxiosResponse | undefined>,
] => {
  const { Delete } = useApi();
  const callback = useCallback(
    (username: string) => {
      return Delete(routes.auth.deleteUser(username));
    },
    [Delete],
  );
  return [callback];
};
