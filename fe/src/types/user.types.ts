export interface Role {
  id?: number;
  authority: string;
}

export interface UserDTO {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  avatarURL: string | null;
  authorities: Role[];
  changedPasswordDate: string | null;
  createdDate: string;
  enabled: boolean;
  blocked: boolean;
  orders?: any[];
}

export interface LoginResponse {
  jwt: string;
  userDTO: UserDTO;
}
