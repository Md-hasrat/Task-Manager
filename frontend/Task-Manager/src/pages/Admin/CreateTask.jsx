import React, { useState } from 'react'
import DashboardLayout from '../../compenents/layout/DashboardLayout'
import { PRIORITY_DATA } from '../../utils/data'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { LuTrash2 } from 'react-icons/lu'
import SelectDropdown from '../../compenents/inputs/SelectDropdown'
import SelectUsers from '../../compenents/inputs/SelectUsers'
import TodoListInput from '../../compenents/inputs/TodoListInput'
import AddAttachmentsInput from '../../compenents/inputs/AddAttachmentsInput'



const CreateTask = () => {

  const location = useLocation()
  const { taskId } = location.state || {}
  const navigate = useNavigate()

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
    priority: "Low",
    dueDate: null
  })

  const [currentTask, setCurrentTask] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false)

  const handleValueChange = (key, value) => {
    setTaskData((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
      priority: "Low",
      dueDate: null
    })
  }

  // Function to create or update a task
  const creaetTask = async () => { }

  // Function to update an existing task
  const updateTask = async () => { }

  // Function to delete a task
  const handleSubmit = async (e) => { }

  // Function to fetch task details by ID
  const getTaskById = async (taskId) => { }

  // Function to handle task deletion
  const handleDeleteTask = async () => { }



  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-0 md:mt-4 px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>

              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border-rose-100 hover:border-rose-300 cursor-pointer transition-all duration-300"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-lg font-medium text-slate-600">
                Task Title
              </label>
              <input
                placeholder="Create App UI"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-lg font-medium text-slate-600">
                Description
              </label>
              <textarea
                placeholder="Describe task"
                className="form-input"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              />
            </div>
            <div className="grid grid-cols-12 gap-3 mt-2">
              <div className="col-span-12 md:col-span-6">
                <label className="text-lg font-medium text-slate-600">
                  Priority
                </label>
                <SelectDropdown

                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <label className="text-lg font-medium text-slate-600">
                  Due Date
                </label>
                <input
                  placeholder="Create App UI"
                  className="form-input"
                  value={taskData.dueDate || ""}
                  onChange={({ target }) =>
                    handleValueChange("dueDate", target.value)
                  }
                  type="date"
                />
              </div>
            </div>

            <div className="col-span-12 md:col-span-3">
              <label className="text-lg font-medium text-slate-600">
                Assign To
              </label>
              <SelectUsers
                selectedUsers={taskData.assignedTo}
                setSelectedUsers={(value) => {
                  handleValueChange("assignedTo", value);
                }}
              />
            </div>

              <div className="mt-3">
                <label className="text-lg font-medium text-slate-600">
                  TODO Checklist
                </label>
                <TodoListInput
                  todoChecklist={taskData.todoChecklist}
                  setTodoChecklist={(value) => handleValueChange("todoChecklist", value)}
                />
              </div>

              <div className="mt-3">
                <label className="text-lg font-medium text-slate-600">
                 Add Attachments
                </label>
                <AddAttachmentsInput
                  attachments={taskData.todoChecklist}
                  setAttachments={(value) => handleValueChange("attachments", value)}
                />
              </div>


          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


export default CreateTask
