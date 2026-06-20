import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
} from "../services/auth.api.js";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading } = context;

  const handleLogin = async (email, password) => {
    try {
      const data = await loginApi(email, password);
      setUser(data.user);
      return data;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const data = await registerApi(name, email, password);
      setUser(data.user);
      return data;
    } catch (err) {
      console.error("Register failed:", err);
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
      throw err;
    }
  };

  return {
    user,
    loading, // only used for initial getMe check in Protected
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};