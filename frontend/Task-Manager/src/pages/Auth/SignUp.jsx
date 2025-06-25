import React, {  useContext, useState } from 'react'
import AuthLayout from '../../compenents/layout/AuthLayout'
import ProfilePhotoSelector from '../../compenents/inputs/ProfilePhotoSelector';
import Input from '../../compenents/inputs/Input';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import imageUpload from '../../utils/uploadImage';
import { validateEmail } from '../../utils/helper';


const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminInviteToken, setAdminInviteToken] = useState('');
  const [error, setError] = useState(null);
   const [loading, setLoading] = useState(false);

   const navigate = useNavigate()
  const {updateUser} = useContext(UserContext)


  // Handle form submission for SignUp
  const handleSignUp = async(event) => {
    event.preventDefault();

    let profileImageUrl = ''

    if (!name) {
      setError('Full name is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setError('');
    setLoading(true)

    // Api call for login
    try {

      if(profilePic){
        const imageUploadRes = await imageUpload(profilePic)
        profileImageUrl = imageUploadRes.imageUrl || "" 
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name,
        email,
        password,
        adminInviteToken,
        profileImageUrl
      })

      const {token,role} = response.data

      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data);
        if (role === 'admin') {
          navigate('/admin/dashboard')
        }else{
          navigate('/user/dashboard')
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false)
    }
  };

  return (
    <AuthLayout>
      <div className="lg-w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-2xl font-semibold text-black">Create an Account</h3>
        <p className="text-xl font-medium text-slate-700 mt-[5px] mb-6">Join us today by entering your details below</p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={name}
              onChange={(e) => setFullName(e.target.value)}
              label='Full Name'
              placeholder='Enter your full name'
              type='text' // Corrected: changed from text='text'
            />

            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              label="Email Address"
              placeholder="Enter your email address"
              type="email" // Changed type to 'email' for better browser validation
            />
            <Input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              label="Password"
              placeholder="Min 8 characters"
              type="password"
            />
            <Input
              value={adminInviteToken} // Corrected: bound to adminInviteToken state
              onChange={(event) => setAdminInviteToken(event.target.value)} // Corrected: updates adminInviteToken state
              label="Admin Invite Token"
              placeholder="4 Digits Code"
              type="text"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium mt-2">{error}</p>}

          <button
            type='submit'
            className='btn-primary mt-4'
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Signing Up...' : 'SIGNUP'}
          </button>

          <p className='text-md font-medium text-slate-800 mt-3'>
            Already have an account? <Link className='font-bold text-primary underline' to="/login">
              LOGIN
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp
