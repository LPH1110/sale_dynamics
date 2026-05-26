export interface Customer {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  createdDate?: string;
}

export type CustomerDTO = Customer;
export type CreateCustomerRequest = Customer;
export type UpdateCustomerRequest = Customer;
