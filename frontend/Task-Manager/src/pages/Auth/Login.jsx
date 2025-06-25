import React, { isValidElement, useContext, useState } from 'react';
import AuthLayout from '../../compenents/layout/AuthLayout';
import Input from '../../compenents/inputs/Input';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate()
  const {updateUser} = useContext(UserContext)

  // Handle form submission for Login
  const handleLogin = async(event) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setError('');

    // Api call for SignUp
    try {
      const reponse = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });

      const { token, role } = reponse.data

      if (token) {
        localStorage.setItem('token', token);

        // Update user
        updateUser(reponse.data);

        // Redirect user based on their role
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError
      }
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col justify-center h-3/4 md:h-full lg:w-[70%]">
        <h3 className="text-2xl font-bold text-black">Welcome Back</h3>
        <p className="mt-2 mb-6 text-xl font-medium text-slate-700">
          Please enter your details to login
        </p>

        <form className="space-y-5" onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            label="Email Address"
            placeholder="Enter your email address"
            type="text"
          />
          <Input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            label="Password"
            placeholder="Min 8 characters"
            type="password"
          />

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button
            type='submit'
            className='btn-primary'
          >
            LOGIN
          </button>
          <p className='text-md font-medium text-slate-800 mt-3'>
            Don't have an account? <Link className='font-bold text-primary underline' to="/signup">
              SIGNUP
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;

