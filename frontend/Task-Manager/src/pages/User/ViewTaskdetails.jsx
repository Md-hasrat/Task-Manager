import React, { useState, useEffect } from 'react';

const ViewTaskdetails = ({ taskId, onClose, tasks = [] }) => {
  // State to hold the task details
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // In a real application, you would fetch task details from an API
  // based on taskId. For this example, we'll simulate it from the 'tasks' prop.
  useEffect(() => {
    if (!taskId) {
      setError("No task ID provided.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate API call delay
    const fetchTaskDetails = setTimeout(() => {
      const foundTask = tasks.find(t => t.id === taskId);
      if (foundTask) {
        setTask(foundTask);
      } else {
        setError("Task not found.");
      }
      setLoading(false);
    }, 300); // Simulate network latency

    return () => clearTimeout(fetchTaskDetails); // Cleanup on unmount or taskId change
  }, [taskId, tasks]); // Re-run effect if taskId or tasks list changes

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-xl animate-pulse">
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded mt-2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg">
        <p className="font-semibold">Error:</p>
        <p>{error}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
          >
            Close
          </button>
        )}
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-6 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg shadow-lg">
        <p>No task selected or found. Please provide a valid task ID.</p>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition duration-300"
          >
            Close
          </button>
        )}
      </div>
    );
  }

  // Helper function to get priority class
  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-gray-900'; // Darker text for yellow background
      case 'low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-2xl p-6 md:p-8 border border-gray-200 animate-fade-in-up max-w-2xl mx-auto my-8">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold transition duration-200"
          aria-label="Close"
        >
          &times;
        </button>
      )}

      <h2 className="text-3xl font-extrabold text-gray-900 mb-4 pb-2 border-b border-gray-200">
        Task Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-6">
        <div>
          <p className="text-sm font-semibold text-gray-600">Title:</p>
          <p className={`text-xl font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </p>
        </div>

        {task.description && (
          <div>
            <p className="text-sm font-semibold text-gray-600">Description:</p>
            <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-gray-600">Due Date:</p>
          <p className="text-gray-700">
            {task.dueDate || 'N/A'}
            {task.dueDate && new Date(task.dueDate) < new Date() && !task.completed && (
              <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Overdue</span>
            )}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-600">Priority:</p>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityClass(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-600">Status:</p>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${task.completed ? 'bg-green-500 text-white' : 'bg-orange-400 text-white'}`}>
            {task.completed ? 'Completed' : 'Active'}
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
        {/* These buttons would trigger actions, potentially closing this view
            and opening an edit form, or marking the task complete/delete it. */}
        <button
          onClick={() => alert(`Simulating mark as ${task.completed ? 'incomplete' : 'complete'}`)}
          className={`px-5 py-2 rounded-md font-medium transition duration-300
            ${task.completed ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
        >
          Mark as {task.completed ? 'Incomplete' : 'Complete'}
        </button>
        <button
          onClick={() => alert('Simulating edit task action')}
          className="px-5 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-300"
        >
          Edit Task
        </button>
        <button
          onClick={() => alert('Simulating delete task action')}
          className="px-5 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition duration-300"
        >
          Delete Task
        </button>
      </div>
    </div>
  );
};

export default ViewTaskdetails;