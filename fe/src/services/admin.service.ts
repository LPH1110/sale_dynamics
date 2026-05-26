import { post, get } from '@/lib/axios';
import { UserDTO } from '@/types/user.types';
import { PageResponse } from '@/types/common.types';

export interface VerificationToken {
  id: number;
  token: string;
  expiryDate: string;
  verified: boolean;
}

export interface CreateUserResponse {
  error: boolean;
  message: string;
  data: VerificationToken;
}

export const getUsers = async (): Promise<UserDTO[]> => {
  return get<UserDTO[]>('admin/users');
};

export const getUsersPage = async (page: number, size: number, sort = 'username,asc'): Promise<PageResponse<UserDTO>> => {
  return get<PageResponse<UserDTO>>(`admin/users/page?page=${page}&size=${size}&sort=${sort}`);
};

export const createUser = async (params: Record<string, string>): Promise<CreateUserResponse> => {
  return post<CreateUserResponse>('admin/create', params);
};

export const generateVerifyToken = async (username: string): Promise<string> => {
  return get<string>(`admin/generate-verify-token?username=${encodeURIComponent(username)}`);
};

export const blockUser = async (username: string): Promise<string> => {
  return get<string>(`admin/user/block?username=${encodeURIComponent(username)}`);
};

export const unblockUser = async (username: string): Promise<string> => {
  return get<string>(`admin/user/unblock?username=${encodeURIComponent(username)}`);
};
