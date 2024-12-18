import axios, { type AxiosResponse } from 'axios';
import type { Automation } from '@sharedTypes/types';

const BE_URL = import.meta.env.VITE_SERVER_URL;

type GetAutomationsResponse = {
  total: number;
  data: Automation[];
};

class Gateway {
  static async get<T>(path: string, params?: Record<string, string | number>): Promise<AxiosResponse<T>> {
    const queryString = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : '';
    const res = await axios.get<T>(`${BE_URL}/${path}${queryString}`);
    return res;
  }

  static async getAutomations(params?: Record<string, string | number>): Promise<AxiosResponse<GetAutomationsResponse>> {
    const response = await Gateway.get<GetAutomationsResponse>('automations', params);
    return response;
  }
}

export default Gateway;
