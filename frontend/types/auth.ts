export interface User {
  id: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  roles: string[];
}

export interface AuthResponse {
  accessToken: string;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  // error: string | null;
}
