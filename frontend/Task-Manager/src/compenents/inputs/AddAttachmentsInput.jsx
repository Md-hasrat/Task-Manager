import React, { useState } from 'react';

const AddAttachmentsInput = ({ attachments, setAttachments }) => {
  const [linkInput, setLinkInput] = useState('');
  const [isChecklistEnabled, setIsChecklistEnabled] = useState(false); // To manage the radio button

  const handleAddLink = () => {
    // Basic URL validation (you can enhance this regex)
    const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
    if (linkInput.trim() !== '' && urlRegex.test(linkInput.trim())) {
      // Assuming 'attachments' will still hold the links for the parent component
      // If this link is meant to be part of todoChecklist based on the radio button,
      // you'll need to adjust the logic to pass it to the correct parent state handler.
      setAttachments([...attachments, linkInput.trim()]);
      setLinkInput(''); // Clear the input field
      // Optional: Logic to handle isChecklistEnabled for the added item
    } else {
      // Optional: Add some user feedback for invalid URL
      alert('Please enter a valid URL (e.g., https://example.com)');
    }
  };

  const handleClearInput = () => {
    setLinkInput('');
  };

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg">
      {/* Top section: AddCemoTen and Close Button (usually handled by parent modal) */}
      {/* For this component, we start with the "Embed by" label */}

      {/* "Embed by" Label */}
      <label htmlFor="add-link-input" className="text-sm font-medium text-slate-700 mb-2">
        Embed by
      </label>

      {/* Input Field with Embedded Paperclip Icon */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {/* Paperclip Icon (SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-slate-400"
          >
            <path
              fillRule="evenodd"
              d="M18.97 3.659A2.25 2.25 0 0017.25 3H7.5A2.25 2.25 0 005.79 3.659L4.027 6.02A2.25 2.25 0 003 7.5v9.75a2.25 2.25 0 001.027 1.841L5.79 21.341A2.25 2.25 0 007.5 21h9.75a2.25 2.25 0 001.71-0.659l1.763-2.36A2.25 2.25 0 0021 17.25V7.5a2.25 2.25 0 00-1.027-1.841l-1.763-2.36zM13.5 6a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0V6zm-5.25 6a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0V12z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          id="add-link-input"
          type="text"
          placeholder="Add Link"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddLink();
            }
          }}
          className="block w-full pl-10 pr-3 py-2 border border-blue-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>

      {/* "Add checklistied" and "todoChecklist" section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="add-checklistied"
            name="attachment-type"
            checked={isChecklistEnabled}
            onChange={() => setIsChecklistEnabled(true)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label htmlFor="add-checklistied" className="text-sm text-slate-700">
            Add checklistied
          </label>
        </div>
        <div className="flex items-center gap-1">
          {/* Paperclip Icon for todoChecklist (SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 text-slate-400"
          >
            <path
              fillRule="evenodd"
              d="M18.97 3.659A2.25 2.25 0 0017.25 3H7.5A2.25 2.25 0 005.79 3.659L4.027 6.02A2.25 2.25 0 003 7.5v9.75a2.25 2.25 0 001.027 1.841L5.79 21.341A2.25 2.25 0 007.5 21h9.75a2.25 2.25 0 001.71-0.659l1.763-2.36A2.25 2.25 0 0021 17.25V7.5a2.25 2.25 0 00-1.027-1.841l-1.763-2.36zM13.5 6a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0V6zm-5.25 6a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0V12z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-slate-700">todoChecklist</span>
        </div>
      </div>

      {/* Trashcan Icon and Red Add Button */}
      <div className="flex justify-end items-center gap-2">
        <button
          type="button"
          onClick={handleClearInput}
          className="p-2 text-slate-400 hover:text-red-500 focus:outline-none rounded-md"
          title="Clear link input"
        >
          {/* Trashcan Icon (SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M16.5 4.478a.75.75 0 00-1.06.02L13.75 6H7.75a.75.75 0 000 1.5h7.06l-.583 1.064a1.5 1.5 0 00-.304.965V18.75a1.5 1.5 0 001.5 1.5h2.25a1.5 1.5 0 001.5-1.5V9.079a1.5 1.5 0 00-.304-.965L16.5 4.478zM6.347 11.25a.75.75 0 01-1.06-.02L3.06 9H1.5a.75.75 0 000 1.5h.75L2.69 20.25a1.5 1.5 0 001.5 1.5H8.25a1.5 1.5 0 001.5-1.5V12.079a1.5 1.5 0 00-.304-.965L6.347 11.25z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          onClick={handleAddLink}
          className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentsInput;


