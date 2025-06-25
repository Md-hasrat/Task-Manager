import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'; // For date and time formatting
import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/UserContext';
import DashboardLayout from '../../compenents/layout/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { addThousandsSeparator } from '../../utils/helper';

import InfoCard from '../../compenents/InfoCard';
import TaskListTable from '../../compenents/TaskListTable';
import { LuAArrowDown } from 'react-icons/lu';
import CustomPieChart from '../../compenents/charts/CustomPieChart';
import CustomBarChart from '../../compenents/charts/CustomBarChart';

const COLORS = ['#8D51FF', '#00B8DB', '#FFBB28', '#7BCE00'];

const Dashboard = () => {
  // Enforce user authentication
  useUserAuth();

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // State for dashboard data and loading/error status
  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Prepare chart data for visualization
  const prepareChartData = (data) => {
    const taskDistribution = data?.charts?.taskDistribution || null;
    const taskPriorityLevel = data?.charts?.taskPriority || null;


    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.completed || 0 },
    ]


    setPieChartData(taskDistributionData);

    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevel?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevel?.Medium || 0 },
      { priority: "High", count: taskPriorityLevel?.High || 0 },
    ]

    setBarChartData(priorityLevelData);

  }



  // Helper function to determine the time-based greeting
  const getGreeting = () => {
    const hour = moment().hour();
    if (hour < 12) {
      return 'Good Morning';
    }
    if (hour < 17) {
      return 'Good Afternoon';
    }
    return 'Good Evening';
  };

  // Fetches dashboard data from the API
  const getDashboardData = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS_API.GET_DASHBOARD_DATA);
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data || null); // Prepare chart data after fetching
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when the user context is available
  useEffect(() => {
    if (user) {
      getDashboardData();
    }
  }, [user]); // Dependency array ensures this runs when 'user' changes

  // Handler for "See All" tasks button
  const handleSeeMoreTasks = () => {
    navigate('/admin/tasks');
  };

  // Display loading or error messages if applicable
  if (loading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="flex justify-center items-center h-full">
          <p className="text-red-600">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  // Destructure task distribution for cleaner access
  const { taskDistribution } = dashboardData?.charts || {};
  const { All, Pending, InProgress, completed } = taskDistribution || {};

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-0">
        <div className="col-span-3">
          {/* Dynamic greeting based on time of day */}
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            {getGreeting()}, {user?.name}!
          </h2>
          {/* Current date and time */}
          <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
            {moment().format('dddd Do MMMM YYYY')}
          </p>
        </div>

        {/* Task Summary Info Cards */}
        <div className="grid grid-cols-2 sm:grid md:grid-cols-4 pl-14 gap-3 md:gap-6 mt-5">
          <InfoCard
            label="Total Tasks"
            value={addThousandsSeparator(All || 0)}
            color="bg-primary"
          />
          <InfoCard
            label="Pending Tasks"
            value={addThousandsSeparator(Pending || 0)}
            color="bg-violet-500"
          />
          <InfoCard
            label="In Progress Tasks"
            value={addThousandsSeparator(InProgress || 0)}
            color="bg-cyan-500"
          />
          <InfoCard
            label="Completed Tasks"
            value={addThousandsSeparator(completed || 0)}
            color="bg-lime-500"
          />
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">

        {/* Pie Chart for Task Distribution */}

        <div>
          <div className="card ">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Task Distribution</h2>
            </div>
            <CustomPieChart
              data={pieChartData}
              colors={COLORS}
            />
          </div>
        </div>

        {/* Bar Chart for Task Priority Levels */}
        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Task Priority Levels</h2>
            </div>
            <CustomBarChart
              data={barChartData}
            />
          </div>
        </div>

        {/* Recent Tasks Table */}
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-xl">Recent Tasks</h5> {/* Changed to plural */}

              <button className='card-btn' onClick={handleSeeMoreTasks}>
                See All <LuAArrowDown className='text-base ml-1' /> {/* Added margin to icon */}
              </button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
