import React, { useState } from 'react';


const ManageTasks = () => {
  // State to hold our tasks
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Learn React Hooks', description: 'Deep dive into useState, useEffect, useContext.', dueDate: '2025-07-01', priority: 'High', completed: false },
    { id: 2, title: 'Build a Todo App', description: 'Apply concepts to a practical project.', dueDate: '2025-06-28', priority: 'High', completed: false },
    { id: 3, title: 'Read "Clean Code"', description: 'Improve coding practices and maintainability.', dueDate: '2025-07-15', priority: 'Medium', completed: false },
    { id: 4, title: 'Grocery Shopping', description: 'Milk, Eggs, Bread, Vegetables.', dueDate: '2025-06-25', priority: 'Low', completed: true },
  ]);

  // State for the new task input
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium'); // Default priority

  // Function to add a new task
  const addTask = () => {
    if (newTaskTitle.trim() === '') return; // Don't add empty tasks

    const newTask = {
      id: tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1, // Simple ID generation
      title: newTaskTitle,
      description: newTaskDescription,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    // Clear the input fields
    setNewTaskTitle('');
    setNewTaskTaskDescription('');
    setNewTaskDueDate('');
    setNewTaskPriority('Medium');
  };

  // Function to toggle task completion status
  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Function to delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Simple sorting for demonstration (e.g., by completion status, then due date)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  return (
    <div className="manage-tasks-container">
      <h1>My Tasks</h1>

      {/* Add New Task Section */}
      <div className="add-task-form">
        <input
          type="text"
          placeholder="Task Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <textarea
          placeholder="Task Description (optional)"
          value={newTaskDescription}
          onChange={(e) => setNewTaskTaskDescription(e.target.value)}
        ></textarea>
        <div className="form-row">
            <label htmlFor="dueDate">Due Date:</label>
            <input
                type="date"
                id="dueDate"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
            />
            <label htmlFor="priority">Priority:</label>
            <select
                id="priority"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
            >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
        </div>
        <button onClick={addTask}>Add Task</button>
      </div>

      <hr className="divider" />

      {/* Task List */}
      <div className="task-list">
        {sortedTasks.length === 0 ? (
            <p className="no-tasks">No tasks yet! Add one above.</p>
        ) : (
            sortedTasks.map((task) => (
                <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''} priority-${task.priority.toLowerCase()}`}>
                    <div className="task-header">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleComplete(task.id)}
                        />
                        <h3 className={`task-title ${task.completed ? 'strike-through' : ''}`}>{task.title}</h3>
                        <div className={`priority-badge ${task.priority.toLowerCase()}`}>{task.priority}</div>
                    </div>
                    {task.description && <p className="task-description">{task.description}</p>}
                    <div className="task-meta">
                        {task.dueDate && <span className="due-date">Due: {task.dueDate}</span>}
                    </div>
                    <div className="task-actions">
                        {/* You could add an edit button here that opens a modal or changes the card to an editable state */}
                        <button onClick={() => deleteTask(task.id)} className="delete-btn">Delete</button>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ManageTasks;