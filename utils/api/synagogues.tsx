import axios from "axios";
import { getToken } from "./accessToken";
import { SynagoguePost } from "@/constants/types";

const apiClient: any = axios.create({
  baseURL: "http://192.168.102.55:3000/api/synagogues",
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

export const getAllSynagogues = async (): Promise<any> => {
  try {
    const response = await apiClient.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching synagogues:", error);
    throw error;
  }
};

export const findNearestSynagogues = async (
  long: number,
  lat: number
): Promise<any> => {
  try {
    const response = await apiClient.get(`/near-by?lat=${lat}&long=${long}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching synagogues:", error);
    throw error;
  }
};

export const getUserSenagogues = async (): Promise<any> => {
  try {
    const response = await apiClient.get("/my-synagogues");
    return response.data;
  } catch (error) {
    console.error("Error fetching donors:", error);
    throw error;
  }
};

export const getSynagogueById = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching synagogue with id ${id}:`, error);
    throw error;
  }
};

export const createSynagogue = async (data: SynagoguePost): Promise<any> => {
  try {
    const response = await apiClient.post("/", data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching synagogue profile:`, error);
    throw error;
  }
};

export const updateSynagogue = async (
  id: string,
  userData: SynagoguePost
): Promise<any> => {
  try {
    const response = await apiClient.put(`/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating synagogue with id ${id}:`, error);
    throw error;
  }
};

export const deleteSynagogue = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.put(`/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting synagogue with id ${id}:`, error);
    throw error;
  }
};
