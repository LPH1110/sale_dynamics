import { CustomerDTO } from './customer.types';
import { ProductDTO } from './product.types';

export interface OrderItemDTO {
  productDTO: ProductDTO;
  quantity: number;
}

export interface Order {
  id: string;
  total: number;
  received: number;
  excess: number;
  customerOwed: number;
  createdDate: string;
  status: string;
  customer: CustomerDTO | null;
  orderItems: OrderItemDTO[];
  confirmed: boolean;
  description: string;
  issuer: string;
}

export type OrderDTO = Order;

export interface CreateOrderRequest {
  customerPhone?: string;
  items: {
    barcode: string;
    quantity: number;
  }[];
  description?: string;
}

export interface PayOrderRequest {
  orderId: string;
  amount: number;
}
