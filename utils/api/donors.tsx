import axios from "axios";
import { getToken } from "./accessToken";
import { DonorPost } from "@/constants/types";

const apiClient: any = axios.create({
  baseURL: `http://192.168.102.55:3000/api/donors`,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config: any) => {
    const token: string | null | undefined = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: Error) => Promise.reject(error)
);

export const getAllDonors = async (): Promise<any> => {
  try {
    const response = await apiClient.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching donors:", error);
    throw error;
  }
};

export const findNearestDonors = async (
  long: number,
  lat: number
): Promise<any> => {
  try {
    const response = await apiClient.get(`/near-by?lat=${lat}&long=${long}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching donors:", error);
    throw error;
  }
};

export const getUserDonors = async (): Promise<any> => {
  try {
    const response = await apiClient.get("/my-donors");
    return response.data;
  } catch (error) {
    console.error("Error fetching donors:", error);
    throw error;
  }
};

export const getDonorById = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching donor with id ${id}:`, error);
    throw error;
  }
};

export const createDonor = async (data: DonorPost): Promise<any> => {
  try {
    const response = await apiClient.post("/", data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching donor profile:`, error);
    throw error;
  }
};

export const updateDonor = async (
  id: string,
  data: DonorPost
): Promise<any> => {
  try {
    const response = await apiClient.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating donor with id ${id}:`, error);
    throw error;
  }
};

export const deleteDonor = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.put(`/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting synagogue with id ${id}:`, error);
    throw error;
  }
};
