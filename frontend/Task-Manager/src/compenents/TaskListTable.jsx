import React from 'react'
import moment from 'moment';

const TaskListTable = ({ tableData }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-purple-200 text-yellow-500 border-purple-200';
            case 'In Progress':
                return 'bg-cyan-100 text-cyan-500 border-cyan-200';
            case 'Completed':
                return 'bg-green-100 text-green-500 border-green-200';
            case 'Overdue':
                return 'bg-red-200 text-red-500';
            default:
                return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'bg-red-100 text-red-500 border-red-200';
            case 'Medium':
                return 'bg-orange-100 text-orange-500 border-orange-200';
            case 'Low':
                return 'bg-green-100 text-green-500 border-green-200';
            default:
                return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    }

    return (
        <div className="overflow-x-auto p-0 rounded-lg shadow-lg bg-white mt-3 border border-gray-100">
            <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className='py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>Name</th>
                        <th className='py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>Status</th>
                        <th className='py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>Priority</th>
                        <th className='py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell'>Created on</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {tableData.map((task, index) => (
                        // *** CORRECTION APPLIED HERE ***
                        // All <td> elements are on the same line as the <tr>
                        <tr
                            key={index}
                            className={
                                index % 2 === 0
                                    ? 'bg-white hover:bg-gray-50 transition duration-200 ease-in-out'
                                    : 'bg-gray-50 hover:bg-gray-100 transition duration-200 ease-in-out'
                            }
                        >
                            <td className='py-3.5 px-6 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap'>{task.title}</td><td className='py-3.5 px-6'>
                                <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                            </td><td className='py-3.5 px-6'>
                                <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                            </td><td className='py-3.5 px-6 text-sm text-gray-600 hidden md:table-cell'>
                                {moment(task.createdAt).format('DD MMM YYYY')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TaskListTable;
