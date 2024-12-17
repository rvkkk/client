import axios from "axios";
import { getToken } from "./accessToken";
import { DonationPost } from "@/constants/types";

const apiClient: any = axios.create({
  baseURL: "http://192.168.102.55:3000/api/donations",
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

export const getAllDonations = async (): Promise<any> => {
  try {
    const response = await apiClient.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching donations:", error);
    throw error;
  }
};

export const getUserDonations = async (): Promise<any> => {
  try {
    const response = await apiClient.get("/my-donations");
    return response.data;
  } catch (error) {
    console.error("Error fetching donations:", error);
    throw error;
  }
};

export const getDonorDonations = async (id: string, limit: number = 50, skip: number = 0): Promise<any> => {
  try {
    const response = await apiClient.get(`/donor/${id}?limit=${limit}&skip=${skip}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching donations:", error);
    throw error;
  }
};

export const getDonationById = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching donation with id ${id}:`, error);
    throw error;
  }
};

export const createDonation = async (data: DonationPost): Promise<any> => {
  try {
    const response = await apiClient.post("/", data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching donation profile:`, error);
    throw error;
  }
};

export const updateDonation = async (
  id: string,
  data: DonationPost
): Promise<any> => {
  try {
    const response = await apiClient.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating donation with id ${id}:`, error);
    throw error;
  }
};

export const deleteDonation = async (id: string): Promise<any> => {
  try {
    const response = await apiClient.put(`/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting donation with id ${id}:`, error);
    throw error;
  }
};
