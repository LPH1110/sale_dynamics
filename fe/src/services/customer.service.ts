import { post, get } from '@/lib/axios';
import { CustomerDTO } from '@/types/customer.types';
import { OrderDTO } from '@/types/order.types';
import { PageResponse } from '@/types/common.types';

export const getAll = async (): Promise<CustomerDTO[]> => {
  return get<CustomerDTO[]>('customers');
};

export const getPage = async (page: number, size: number, sort = 'id,desc'): Promise<PageResponse<CustomerDTO>> => {
  return get<PageResponse<CustomerDTO>>(`customers/page?page=${page}&size=${size}&sort=${sort}`);
};

export const create = async (customer: Partial<CustomerDTO>): Promise<CustomerDTO> => {
  return post<CustomerDTO>('customers/create', customer);
};

export const getDetail = async (phone: string): Promise<CustomerDTO> => {
  return get<CustomerDTO>(`customers/detail?phone=${encodeURIComponent(phone)}`);
};

export const countNew = async (from: string, to: string): Promise<number> => {
  return post<number>('customers/count/news', { from, to });
};

export const getOrders = async (phone: string): Promise<OrderDTO[]> => {
  return get<OrderDTO[]>(`customers/detail/orders?phone=${encodeURIComponent(phone)}`);
};

export const search = async (infix: string): Promise<CustomerDTO[]> => {
  return get<CustomerDTO[]>(`customers/keyword?infix=${encodeURIComponent(infix)}`);
};
