// TodoListInput.jsx
import React, { useState } from 'react';

const TodoListInput = ({ todoChecklist, setTodoChecklist }) => {
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = () => {
    if (newTodoText.trim() !== '') {
      const updatedList = [...todoChecklist, { id: Date.now(), text: newTodoText, completed: false }];
      setTodoChecklist(updatedList);
      setNewTodoText('');
    }
  };

  const handleToggleComplete = (id) => {
    const updatedList = todoChecklist.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodoChecklist(updatedList);
  };

  // This function will now REMOVE the item from the list
  const handleDeleteTodo = (id) => {
    const updatedList = todoChecklist.filter(todo => todo.id !== id);
    setTodoChecklist(updatedList);
  };

  return (
    <div className="border p-4 rounded-md">
      <div className="flex mb-3">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new to-do item"
          className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Todo
        </button>
      </div>

      {todoChecklist.length === 0 ? (
        <p className="text-slate-500">No to-do items yet. Add one above!</p>
      ) : (
        <ul className="space-y-2">
          {todoChecklist.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id)}
                  className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                {/* The strikethrough is ONLY based on 'completed' status */}
                <span className={`${todo.completed ? 'line-through text-slate-500' : 'text-slate-800'} text-base`}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => handleDeleteTodo(todo.id)} // This will now REMOVE the item
                className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1"
                aria-label="Delete todo item" // Original aria-label
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoListInput;
