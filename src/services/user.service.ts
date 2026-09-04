import apiClient from "./api.client.service";

class UserService {
  async getCurrentUser() {
    const response = await apiClient.get("/user/me");
    return response.data || null;
  }
}

const userService = new UserService();

export default userService;
