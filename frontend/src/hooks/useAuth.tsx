import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useSaveToken } from './useSaveToken.tsx';
import { routes } from '@routes';
import { ILoginRequestDto } from '@clients';
import { usePostLogin } from './requests/authRequests.ts';

// inspired by: https://www.robinwieruch.de/react-router-authentication/

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<{
  token?: string;
  onLogin: (loginViewModel: ILoginRequestDto) => Promise<string | undefined>;
  onLogout: () => void;
  setToken: (token: string) => void;
}>({
  token: '',
  onLogin: () => {
    console.log('onLogin');
    return Promise.reject(undefined);
  },
  onLogout: () => {
    console.log('onLogout');
  },
  setToken: () => {
    console.log('setToken');
  },
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useSaveToken();
  const [loginRequest] = usePostLogin();

  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Login function to be used in the login page
   * Returns a promise with the destination route if the login is successful
   * or an error message if the login fails
   */
  const handleLogin = useCallback(
    async (loginModel: ILoginRequestDto) => {
      try {
        const response = await loginRequest(loginModel);
        if (response?.status === 200) {
          const token: string = response.data.accessToken;
          setToken(token);
          const destination: string = location.state?.from || routes.HOME;
          return Promise.resolve(destination);
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          return Promise.reject(error.response.data.result.response.message);
        }
      }
    },
    [location.state?.from, loginRequest, setToken],
  );

  const handleLogout = useCallback(() => {
    setToken('');
    navigate(routes.LOGIN);
  }, [navigate, setToken]);

  const value = useMemo(() => {
    return {
      token,
      onLogin: handleLogin,
      onLogout: handleLogout,
      setToken,
    };
  }, [handleLogin, handleLogout, setToken, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
