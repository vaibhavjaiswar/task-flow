export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
}

export interface AuthTokenType {
  useremail: string;
  iat: number;
  exp: number;
}
