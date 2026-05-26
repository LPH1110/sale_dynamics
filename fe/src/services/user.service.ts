import { post, get } from '@/lib/axios';
import { UserDTO } from '@/types/user.types';
import { OrderDTO } from '@/types/order.types';

export interface GetInRangeRequest {
  from: string;
  to: string;
}

export interface CldUploadResponse {
  url: string;
  publicId: string;
}

export const getDetail = async (username: string): Promise<UserDTO> => {
  return get<UserDTO>(`user/detail?username=${encodeURIComponent(username)}`);
};

export const changePassword = async (username: string, newPassword: string): Promise<string> => {
  return post<string>('user/change-password', { username, newPassword });
};

export const updateInfo = async (username: string, userDTO: Partial<UserDTO>): Promise<UserDTO> => {
  return post<UserDTO>(`user/update?username=${encodeURIComponent(username)}`, userDTO);
};

export const getOrders = async (username: string): Promise<OrderDTO[]> => {
  return get<OrderDTO[]>(`user/orders?username=${encodeURIComponent(username)}`);
};

export const getRevenue = async (params: GetInRangeRequest): Promise<number> => {
  return post<number>('user/revenue', params);
};

export const changeAvatar = async (file: File, username: string): Promise<CldUploadResponse> => {
  const formData = new FormData();
  formData.append('thumbnail', file);
  formData.append('username', username);
  return post<CldUploadResponse>('user/change-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
