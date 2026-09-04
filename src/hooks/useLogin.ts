import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { LoginDTO } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { getErrorMessage } from "../utils/error";

const useLogin = () => {
  const [isLoging, setIsLoging] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (payload: LoginDTO) => {
    try {
      setIsLoging(true);
      await login(payload);
      toast.success("Signed in successfully.");
      const redirectTo =
        (location.state as { from?: { pathname?: string } } | null)?.from
          ?.pathname ?? "/";
      navigate(redirectTo, { replace: true });
    } catch (error: any) {
      console.log("useLogin ~ handleLogin ~ error:", error);
      toast.error(
        getErrorMessage(error, "Unable to sign in. Please try again."),
      );
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
