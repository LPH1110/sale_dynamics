import { post, get, update } from '@/lib/axios';
import { ProductDTO, Thumbnail } from '@/types/product.types';
import { PageResponse } from '@/types/common.types';

export interface DisableProductResponse {
  error: boolean;
  message: string;
}

export const getAll = async (): Promise<ProductDTO[]> => {
  return get<ProductDTO[]>('products');
};

export const getPage = async (page: number, size: number, sort = 'name,asc'): Promise<PageResponse<ProductDTO>> => {
  return get<PageResponse<ProductDTO>>(`products/page?page=${page}&size=${size}&sort=${sort}`);
};

export const search = async (infix: string): Promise<ProductDTO[]> => {
  return get<ProductDTO[]>(`products/keyword?infix=${encodeURIComponent(infix)}`);
};

export const create = async (params: Record<string, unknown>): Promise<ProductDTO> => {
  return post<ProductDTO>('products/save', params);
};

export const getDetail = async (barcode: string): Promise<ProductDTO> => {
  return get<ProductDTO>(`products/detail?barcode=${encodeURIComponent(barcode)}`);
};

export const saveProduct = async (product: ProductDTO): Promise<ProductDTO> => {
  return update<ProductDTO>('products/update', product);
};

export const disable = async (barcode: string): Promise<DisableProductResponse> => {
  return get<DisableProductResponse>(`products/disable?barcode=${encodeURIComponent(barcode)}`);
};

export const saveThumbnail = async (barcode: string, file: File): Promise<Thumbnail> => {
  const formData = new FormData();
  formData.append('barcode', barcode);
  formData.append('thumbnail', file);
  return post<Thumbnail>('products/save-thumbnail', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteThumbnail = async (barcode: string, thumbnailId: number): Promise<string> => {
  return post<string>('products/delete-thumbnail', { barcode, thumbnailId });
};
