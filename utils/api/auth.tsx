import axios from "axios";
import { saveToken, deleteToken } from "./accessToken";
import { UserPost } from "@/constants/types";

const apiClient: any = axios.create({
  baseURL: `http://192.168.102.55:3000/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (userData: Pick<UserPost, "email" | "password">): Promise<any> => {
  try {
    const response = await apiClient.post("/login", userData);
    saveToken(response.data.token);
    return response.data.user;
  } catch (error: any) {
    console.error("Error login user:", error);
    throw error.response.data;
  }
};

export const register = async (user: UserPost): Promise<any> => {
  try {
    const response = await apiClient.post("/register", user);
    saveToken(response.data.token);
    return response.data;
  } catch (error : any) {
    console.error("Error creating user:", error);
    throw error.response.data;
  }
};

export const logout = async (): Promise<any> => {
  try {
    await deleteToken();
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
