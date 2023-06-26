import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { get } from '../../config/convict';

/**
 * Returns an Axios instance, Here we can set default configuration (like auth)
 * @return {AxiosInstance}
 */
export function getAxiosInstance(
  accessToken = '',
  port = get('server.port'),
): AxiosInstance {
  const config: AxiosRequestConfig = {
    baseURL: `http://${get('server.localhostIp')}:${port}`,
    responseType: 'json',
    timeout: 2000,
    validateStatus: () => true,
    headers: {},
  };

  if (accessToken !== '') {
    config.headers = { authorization: `Bearer ${accessToken}` };
  }
  const instance = axios.create(config);
  return instance;
}
