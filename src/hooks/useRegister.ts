import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { RegisterDTO } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { getErrorMessage } from "../utils/error";

interface RegisterFormValues extends RegisterDTO {
  confirmPassword?: string;
}

const useRegister = () => {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setIsRegistering(true);
      const { confirmPassword, ...payload } = values;
      await register(payload);
      toast.success("Account created successfully.");
      navigate("/", { replace: true });
    } catch (error: any) {
      console.log("useRegister ~ handleRegister ~ error:", error);
      toast.error(
        getErrorMessage(error, "Unable to create your account. Please try again.")
      );
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
