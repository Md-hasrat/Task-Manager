import React, { useContext } from 'react'
import Navbar from './Navbar'
import SideMenu from './SideMenu'
import { UserContext } from '../../context/UserContext'

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext)

    return (
        <div className=''>
            <Navbar />
            {user &&
                <div className="flex flex-col md:flex-row h-screen mt-20">
                    <div className="">
                        <SideMenu activeMenu={activeMenu} />
                    </div>
                    <div className='flex justify-center w-full'>

                    <div className='w-full flex-col'>{children}</div>
                    </div>
                </div>
            }
        </div>
    )
}

export default DashboardLayout
