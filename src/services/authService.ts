import axiosClient from "../api/axiosClient";

interface LoginResponse {
  token: string;
}

export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>("/auth/login", {
    username,
    password,
  });

  return response.data;
};