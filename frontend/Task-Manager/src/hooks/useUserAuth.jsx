import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';  // Adjust path as needed

export const useUserAuth = () => {
  const { user, loading, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      clearUser();
      navigate('/login');
    }
  }, [loading, user, clearUser, navigate]);

  return { user, loading };
};
