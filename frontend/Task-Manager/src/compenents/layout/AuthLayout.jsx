import React from 'react';
import UI_Image from '../../assets/image/auth-image.png';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Left Section: Form Content */}
      <div className="flex-1 px-12 pb-12 bg-white md:w-[60vw]">
        <h1 className="text-2xl font-medium text-black mb-4">Task Manager</h1>
        {children}
      </div>

      {/* Right Section: Decorative Background */}
      <div className="hidden md:flex w-[40vw] items-center justify-center bg-blue-50 bg-no-repeat bg-center overflow-hidden">
        <img
          src={UI_Image}
          alt="Decorative background"
          className="object-contain w-full h-full"
        />
      </div>
    </div>
  );
};


export default AuthLayout;

