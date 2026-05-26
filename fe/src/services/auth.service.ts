import { post, get } from '@/lib/axios';
import { LoginResponse, UserDTO } from '@/types/user.types';
import { ApiResponse } from '@/types/common.types';

export const login = async (params: Record<string, string>): Promise<ApiResponse<LoginResponse>> => {
  return post<ApiResponse<LoginResponse>>('auth/login', params);
};

export const register = async (params: Record<string, unknown>): Promise<ApiResponse<UserDTO>> => {
  return post<ApiResponse<UserDTO>>('auth/register', params);
};

export const verifyUser = async (token: string): Promise<ApiResponse<string>> => {
  return get<ApiResponse<string>>(`auth/verify-user?token=${token}`);
};
