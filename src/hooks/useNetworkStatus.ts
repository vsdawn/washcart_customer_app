import { useAppSelector } from './useAppSelector';

export const useNetworkStatus = () => {
  const isConnected = useAppSelector(state => state.app.isNetworkConnected);
  return { isConnected };
};

export default useNetworkStatus;
