import React, { useState } from 'react'
import SideMenu from './SideMenu';
import {HiOutlineMenu, HiOutlineX} from 'react-icons/hi'

const Navbar = () => {
    const [openSideMenu, setOpenSideMenu] = useState(false)
  return (
    <div className="flex gap-5 fixed top-0 w-full z-50 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4">
      <button
        className="block lg:hidden text-black"
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" /> 
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <h2 className="text-lg font-medium text-black">Expense Tracker</h2>

      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-white">
          <SideMenu activeMenu={activeMenu} /> {/* Assuming SideMenu is another component */}
        </div>
      )}
    </div>
  );
}

export default Navbar
