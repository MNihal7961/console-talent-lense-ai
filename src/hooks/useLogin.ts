import { useState } from "react";
import type { LoginDTO } from "../types";
import authService from "../services/auth.service";

const useLogin = () => {
  const [isLoging, setIsLoging] = useState<boolean>(false);

  const handleLogin = async (payload: LoginDTO) => {
    try {
      setIsLoging(true);
      const loginResponse = await authService.login(payload);
      return loginResponse;
    } catch (error: any) {
      console.log("useLogin ~ handleLogin ~ error:", error);
    } finally {
      setIsLoging(false);
    }
  };

  return {
    isLoging,
    handleLogin,
  };
};

export default useLogin;
