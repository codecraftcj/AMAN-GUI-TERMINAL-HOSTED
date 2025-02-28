import { createContext, useContext, useEffect, useState } from "react";
import { fetchUser, loginUser, logoutUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchUser();
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      
      if (!response || !response.token) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response));
      setUser(response);
      return response;
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
