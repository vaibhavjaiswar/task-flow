export interface RegisterResponseType {
  user: { email: string; name: string | null; createdAt: Date };
}

export interface LoginResponseType {
  user: { email: string; name: string | null; createdAt: Date };
}
