import axios from 'axios';
import { getToken } from './accessToken';
import { User } from '@/constants/types';

const apiClient: any = axios.create({
  baseURL: `http://192.168.102.55:3000/api/users`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config : any) => {
    const token : string | null | undefined = await getToken();
    console.log(token, 111)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: Error) => Promise.reject(error)
);

export const getAllUsers = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw error;
  }
};

export const getMyProfile = async (): Promise<any> => {
    try {
      console.log(222)
      const response = await apiClient.get('/my-profile');
      return response.data;
    } catch (error) {
      console.log(`Error fetching user profile:`, error);
      throw error;
    }
  };
  
export const updateUser = async (id: string, userData: User): Promise<any> => {
  try {
    const response = await apiClient.put(`/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    throw error;
  }
};

export const updateMyProfile = async (userData: User): Promise<any> => {
  try {
    const response = await apiClient.put('/', userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user`, error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<any> => {//האם הID STRING/NUMBER
  try {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    throw error;
  }
};