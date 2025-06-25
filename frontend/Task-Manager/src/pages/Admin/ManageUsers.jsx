import React, { useState } from 'react';

const ManageUsers = () => {
  // State to hold our users
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice.s@example.com', role: 'Admin', status: 'Active', lastLogin: '2025-06-24' },
    { id: 2, name: 'Bob Johnson', email: 'bob.j@example.com', role: 'Editor', status: 'Active', lastLogin: '2025-06-23' },
    { id: 3, name: 'Charlie Brown', email: 'charlie.b@example.com', role: 'Viewer', status: 'Inactive', lastLogin: '2025-06-10' },
    { id: 4, name: 'Diana Prince', email: 'diana.p@example.com', role: 'Admin', status: 'Active', lastLogin: '2025-06-25' },
  ]);

  // State for new user form
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Viewer'); // Default role

  // Function to add a new user
  const addUser = () => {
    if (newUserName.trim() === '' || newUserEmail.trim() === '') return; // Don't add empty users

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'Active', // New users are active by default
      lastLogin: 'Never', // Or current date if they log in immediately
    };
    setUsers([...users, newUser]);
    // Clear the input fields
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('Viewer');
  };

  // Function to delete a user
  const deleteUser = (id) => {
    // In a real app, you'd likely confirm deletion with a modal
    if (window.confirm('Are you sure you want to delete this user?')) {
        setUsers(users.filter(user => user.id !== id));
    }
  };

  // Function to simulate editing (in a real app, this would open a modal or navigate)
  const editUser = (id) => {
    alert(`Editing user with ID: ${id}. In a real app, a modal or new page would open.`);
    // Here you would typically set state to open an edit form/modal
    // For example: setSelectedUser(users.find(u => u.id === id)); setShowEditModal(true);
  };

  // Function to toggle user status (e.g., active/inactive)
  const toggleUserStatus = (id) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
    ));
  };


  return (
    <div className="manage-users-container">
      <h1>User Management</h1>

      {/* Add New User Section */}
      <div className="add-user-form">
        <input
          type="text"
          placeholder="User Name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <input
          type="email"
          placeholder="User Email"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
        />
        <select
          value={newUserRole}
          onChange={(e) => setNewUserRole(e.target.value)}
        >
          <option value="Viewer">Viewer</option>
          <option value="Editor">Editor</option>
          <option value="Admin">Admin</option>
        </select>
        <button onClick={addUser}>Add User</button>
      </div>

      <hr className="divider" />

      {/* User List Table */}
      <div className="user-list-table-container">
        {users.length === 0 ? (
          <p className="no-users">No users found. Add one above!</p>
        ) : (
          <table className="user-list-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span></td>
                  <td>
                    <span className={`status-indicator ${user.status.toLowerCase()}`}>
                        {user.status}
                    </span>
                    <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`toggle-status-btn ${user.status.toLowerCase()}`}
                        title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                    >
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                  <td>{user.lastLogin}</td>
                  <td className="user-actions">
                    <button onClick={() => editUser(user.id)} className="action-btn edit-btn">Edit</button>
                    <button onClick={() => deleteUser(user.id)} className="action-btn delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;