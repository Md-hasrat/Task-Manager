import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data';

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === '/logout') {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate('/login');
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
    return () => {};
  }, [user]);


  const mainMenuItems = sideMenuData.filter((item) => item.path !== '/logout');
  const logoutItem = sideMenuData.find((item) => item.path === '/logout');

  return (
    <div className="w-64 h-screen bg-white shadow-xl flex flex-col pt-8">
      {/* User Profile Section */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="relative mb-3">
          <img
            src={user.profileImageUrl || ''} 
            alt="Profile Image"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow-md"
          />
        </div>
        {user.role === 'admin' && (
          <div className="bg-blue-600 text-white text-[10px] font-medium px-3 py-0.5 rounded-full mb-1">
            Admin
          </div>
        )}
        <h5 className="text-gray-900 font-semibold text-lg leading-tight mb-0.5">
          {user.name || 'Guest User'}
        </h5>
        <p className="text-gray-500 text-sm">
          {user.email || 'guest@example.com'}
        </p>
      </div>

      {/* Menu Items that should fill available space */}
      <div className="mt-6 flex-grow">
        {mainMenuItems.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`
                w-full flex items-center gap-4 py-3 px-6 mb-3 cursor-pointer
                rounded-lg transition-all duration-200 ease-in-out
                ${
                  activeMenu === item.label
                    ? 'bg-blue-100 text-blue-700 font-medium border-r-4 border-blue-600' // Active styles
                    : 'text-gray-700 hover:bg-gray-100' // Default/hover styles
                }
              `}
            onClick={() => handleClick(item.path)}
          >
            {/* Icon color changes based on active state */}
            {item.icon && (
              <item.icon
                className={`text-xl ${
                  activeMenu === item.label ? 'text-blue-600' : 'text-gray-500'
                }`}
              />
            )}
            {item.label}
          </button>
        ))}
      {logoutItem && ( // Only render if logout item exists in data
        <button
          className={`
              w-full flex items-center gap-4  px-6   cursor-pointer
              rounded-lg transition-all duration-200 ease-in-out
              ${
                activeMenu === logoutItem.label
                  ? 'bg-blue-100 text-blue-700 font-medium border-r-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          onClick={() => handleClick(logoutItem.path)}
        >
          {logoutItem.icon && (
            <logoutItem.icon
              className={`text-xl ${
                activeMenu === logoutItem.label
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }`}
            />
          )}
          {logoutItem.label}
        </button>
      )}
      </div>

      {/* Logout button at the very bottom, pushed by mt-auto */}
    </div>
  );
};

export default SideMenu;