import React, { useEffect } from 'react'
import { API_PATHS } from '../../utils/apiPaths'
import axiosInstance from '../../utils/axiosInstance'
import { LuUsers } from 'react-icons/lu'
import Model from '../Model'
import AvatarGroup from '../layout/AvatarGroup'

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = React.useState([])
  const [tempSelectedUsers, setTempSelectedUsers] = React.useState([])
  const [isModelOpen, setIsModelOpen] = React.useState(true)

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS)
      if (response.data?.length > 0) {
        setAllUsers(response.data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers)
    setIsModelOpen(false)
  }

  const selectedUserAvatars = allUsers
    .filter(user => selectedUsers.includes(user._id))
    .map(user => user.profileImageUrl)

  useEffect(() => {
    getAllUsers()
  }, [])

  useEffect(() => {
    if (selectedUsers.length === 0) {
      setTempSelectedUsers([])
    }
  }, [selectedUsers])

  return (
    <div className='space-y-4 mt-2'>
      {selectedUserAvatars.length === 0 && (
        <button
          className="card-btn bg-white text-black border border-slate-100 hover:bg-gray-50"
          onClick={() => setIsModelOpen(true)}
        >
          <LuUsers className="text-lg" /> Add Users
        </button>
      )}

      {selectedUserAvatars.length > 0 && (
        <div className="cursor-pointer" 
        onClick={() => setIsModelOpen(true)}>
          <AvatarGroup   avatars={selectedUserAvatars} maxVisible={3} />
        </div>
      )}       

      <Model
        isOpen={isModelOpen}
        onClose={() => setIsModelOpen(false)}
        title="Select Users"
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.map(user => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleUserSelection(user._id)}
            >
              <img
                src={user.profileImageUrl}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white"> 
                  {user.name} 
                </p>
                <p className='text-[13px] text-gray-500'>{user.email}</p>
              </div>
              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm focus:ring-primary focus:ring-offset-0 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-offset-gray-700"
              /> 
            </div>
          ))}
        </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
                className="card-btn" 
                onClick={() => setIsModelOpen(false)}
              >
                Cancel
            </button>
            <button className='card-btn-fill' onClick={handleAssign}
            >DONE
            </button>
          </div>

      </Model>
    </div>
  )
}

export default SelectUsers
