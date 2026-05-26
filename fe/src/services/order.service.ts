import { post, get } from '@/lib/axios';
import { OrderDTO } from '@/types/order.types';
import { ProductDTO } from '@/types/product.types';
import { PageResponse } from '@/types/common.types';

export interface PayOrderParams {
  orderId: string;
  received: number;
  excess: number;
  customerOwed: number;
}

export interface TopSellingProductResponse {
  productDTO: ProductDTO;
  quantity: number;
  totalRevenue: number;
}

export const getAll = async (): Promise<OrderDTO[]> => {
  return get<OrderDTO[]>('orders');
};

export const getPage = async (page: number, size: number, sort = 'createdDate,desc'): Promise<PageResponse<OrderDTO>> => {
  return get<PageResponse<OrderDTO>>(`orders/page?page=${page}&size=${size}&sort=${sort}`);
};

export const create = async (order: Partial<OrderDTO>): Promise<OrderDTO> => {
  return post<OrderDTO>('orders/create', order);
};

export const getDetail = async (orderId: string): Promise<OrderDTO> => {
  return get<OrderDTO>(`orders/detail?orderId=${encodeURIComponent(orderId)}`);
};

export const confirm = async (orderId: string): Promise<string> => {
  return get<string>(`orders/confirm?orderId=${encodeURIComponent(orderId)}`);
};

export const pay = async (params: PayOrderParams): Promise<OrderDTO> => {
  return post<OrderDTO>('orders/payment', params);
};

export const countInRange = async (from: string, to: string): Promise<number> => {
  return post<number>('orders/quantity', { from, to });
};

export const getTopSelling = async (limit: number, from: string, to: string): Promise<TopSellingProductResponse[]> => {
  return post<TopSellingProductResponse[]>(`orders/top-sellings?limit=${limit}`, { from, to });
};
