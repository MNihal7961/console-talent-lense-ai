import apiClient from "./api.client.service";
import type { LoginDTO, RegisterDTO } from "../types";

class AuthService {
  async register(payload: RegisterDTO) {
    const response = await apiClient.post("/auth/signup", payload);
    return response.data || null;
  }

  async login(payload: LoginDTO) {
    const response = await apiClient.post("/auth/signin", payload);
    return response.data || null;
  }
}

const authService = new AuthService();

export default authService;
