import { createContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token'); // Optional: clean up if token is invalid
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    if (updatedUser.token) {
      localStorage.setItem('token', updatedUser.token);
    }
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('token');
    setLoading(false);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
