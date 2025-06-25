import React, { useContext } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom'

import SignUp from './pages/Auth/SignUp'
import Login from './pages/Auth/Login'

// Admin Pages
import Dashboard from './pages/Admin/Dashboard'
import ManageTasks from './pages/Admin/ManageTasks'
import CreateTask from './pages/Admin/CreateTask'
import ManageUsers from './pages/Admin/ManageUsers'

// User Pages
import UserDashboard from './pages/User/UserDashboard'
import MyTasks from './pages/User/MyTasks'
import ViewTaskdetails from './pages/User/ViewTaskdetails'

import PrivateRoute from './routes/PrivateRoute'
import UserProvider, { UserContext } from './context/UserContext'

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTasks />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
            <Route path="/admin/user" element={<ManageUsers />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={['user']} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tasks" element={<MyTasks />} />
            <Route path="/user/task-details/:id" element={<ViewTaskdetails />} />
          </Route>

          {/* Root Redirect */}
          <Route path="/" element={<Root />} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App

// Root component to redirect based on auth role
const Root = () => {
  const { user, loading } = useContext(UserContext)

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return user.role === 'admin'
    ? <Navigate to="/admin/dashboard" />
    : <Navigate to="/user/dashboard" />
}
