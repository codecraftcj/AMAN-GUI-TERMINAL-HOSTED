import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, fetchUser, logoutUser } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await fetchUser(); // Fetch authenticated user
        setUser(userData);
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials); // API call to login user
      localStorage.setItem("token", response.token); // Store token
      setUser(response.user); // Save user data
      return response.user; // Return user data to determine redirect path
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  const logout = async () => {
    localStorage.removeItem("token"); // Remove token on logout
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
