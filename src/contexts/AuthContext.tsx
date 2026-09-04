import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { User } from "../interface/user";
import type { LoginDTO, RegisterDTO } from "../types";
import authService from "../services/auth.service";
import userService from "../services/user.service";
import { TOKEN_KEY } from "../utils/constants";

interface AuthContextType {
  user: User | null;
  isUserLoggedIn: boolean;
  isAuthLoading: boolean;
  login: (payload: LoginDTO) => Promise<User>;
  register: (payload: RegisterDTO) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const currentUser = await userService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.log("AuthProvider ~ bootstrapAuth ~ error:", error);
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    bootstrapAuth();

    window.addEventListener("auth:logout", logout);
    return () => window.removeEventListener("auth:logout", logout);
  }, [logout]);

  const login = useCallback(async (payload: LoginDTO) => {
    const response = await authService.login(payload);
    localStorage.setItem(TOKEN_KEY, response.accessToken);
    setUser(response.user);
    return response.user as User;
  }, []);

  const register = useCallback(async (payload: RegisterDTO) => {
    const response = await authService.register(payload);
    localStorage.setItem(TOKEN_KEY, response.accessToken);
    setUser(response.user);
    return response.user as User;
  }, []);

  const value: AuthContextType = {
    user,
    isUserLoggedIn: !!user,
    isAuthLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
