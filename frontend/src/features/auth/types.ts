export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface SignupRequest {
    email: string;
    password: string;
  }
  
  export interface VerifyRequest {
    email: string;
    code: string;
  }
  
  export interface AuthResponse {
    token: string;
  }
  
  export interface MeResponse {
    id: number;
    email: string;
  }
  