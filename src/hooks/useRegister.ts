import { useState } from "react";
import type { RegisterDTO } from "../types";
import authService from "../services/auth.service";

const useRegister = () => {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const handleRegister = async (payload: RegisterDTO) => {
    try {
      setIsRegistering(true);
      const registerResponse = await authService.register(payload);
      return registerResponse;
    } catch (error: any) {
      console.log("useRegister ~ handleRegister ~ error:", error);
    } finally {
      setIsRegistering(false);
    }
  };
  return {
    isRegistering,
    handleRegister,
  };
};

export default useRegister;
