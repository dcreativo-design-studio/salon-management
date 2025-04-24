// src/pages/Staff/Reports.jsx
import React, { useContext, useEffect, useState } from 'react';
import { FaCalendarAlt, FaChartBar, FaDownload, FaUserClock } from "react-icons/fa";
import { toast } from "react-toastify";
// Fix the recharts import - import components individually
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import StaffSidebar from "../../components/Layout/StaffSidebar";
import AuthContext from "../../context/AuthContext";
import { getStaffAppointments } from '../../services/appointmentService';
import { getStaffByUserId } from '../../services/staffService';

const Reports = () => {
  const { user } = useContext(AuthContext);
  const [staffInfo, setStaffInfo] = useState(null);
  const [timeframeData, setTimeframeData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [appointmentStats, setAppointmentStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0
  });
  const [timeframe, setTimeframe] = useState('month'); // week, month, year
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // Get staff information
        const staffRes = await getStaffByUserId(user.id);
        setStaffInfo(staffRes.data);

        // Get appointments for report
        await fetchAppointmentData(staffRes.data._id, timeframe);
      } catch (error) {
        console.error('Error fetching staff data:', error);
        toast.error('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, timeframe]);

  const fetchAppointmentData = async (staffId, period) => {
    try {
      // Define date range based on timeframe
      const endDate = new Date();
      const startDate = new Date();

      switch (period) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(endDate.getMonth() - 1); // Default to month
      }

      // Get appointments for the specified timeframe
      const appointmentsRes = await getStaffAppointments(staffId, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      const appointments = appointmentsRes.data;

      // Process appointment data for stats and charts
      processAppointmentData(appointments, period);
    } catch (error) {
      console.error('Error fetching appointment data:', error);
      toast.error('Failed to load appointment data');
    }
  };

  const processAppointmentData = (appointments, period) => {
    // Calculate statistics
    const stats = {
      total: appointments.length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
      cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
      noShow: appointments.filter(apt => apt.status === 'noShow').length
    };

    setAppointmentStats(stats);

    // Process timeframe data (appointments by day/week/month)
    const timeframeMap = new Map();
    const serviceCountMap = new Map();

    appointments.forEach(appointment => {
      // Get the date and format it according to timeframe
      const date = new Date(appointment.startTime);
      let timeframeKey;

      switch (period) {
        case 'week':
          // Group by day of week
          timeframeKey = date.toLocaleDateString('en-US', { weekday: 'short' });
          break;
        case 'month':
          // Group by day of month
          timeframeKey = date.getDate().toString();
          break;
        case 'year':
          // Group by month
          timeframeKey = date.toLocaleDateString('en-US', { month: 'short' });
          break;
        default:
          timeframeKey = date.getDate().toString();
      }

      // Count appointments by timeframe
      if (timeframeMap.has(timeframeKey)) {
        timeframeMap.set(timeframeKey, timeframeMap.get(timeframeKey) + 1);
      } else {
        timeframeMap.set(timeframeKey, 1);
      }

      // Count appointments by service
      const serviceName = appointment.service.name;
      if (serviceCountMap.has(serviceName)) {
        serviceCountMap.set(serviceName, serviceCountMap.get(serviceName) + 1);
      } else {
        serviceCountMap.set(serviceName, 1);
      }
    });

    // Convert to array format for charts
    const timeframeChartData = Array.from(timeframeMap, ([name, value]) => ({ name, appointments: value }));
    const serviceChartData = Array.from(serviceCountMap, ([name, value]) => ({ name, count: value }));

    // Sort data
    if (period === 'week') {
      // Sort days of the week in correct order
      const daysOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      timeframeChartData.sort((a, b) => daysOrder.indexOf(a.name) - daysOrder.indexOf(b.name));
    } else if (period === 'month') {
      // Sort by day number
      timeframeChartData.sort((a, b) => parseInt(a.name) - parseInt(b.name));
    } else if (period === 'year') {
      // Sort months in correct order
      const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      timeframeChartData.sort((a, b) => monthsOrder.indexOf(a.name) - monthsOrder.indexOf(b.name));
    }

    // Sort services by appointment count (descending)
    serviceChartData.sort((a, b) => b.count - a.count);

    setTimeframeData(timeframeChartData);
    setServiceData(serviceChartData);
  };

  const handleExportCSV = () => {
    // Generate CSV data for appointments
    try {
      const header = "Period,Appointments\n";
      const timeframeRows = timeframeData.map(row => `${row.name},${row.appointments}`).join('\n');
      const servicesHeader = "\n\nService,Count\n";
      const servicesRows = serviceData.map(row => `${row.name},${row.count}`).join('\n');
      const statsHeader = "\n\nStatistic,Value\n";
      const statsRows = Object.entries(appointmentStats)
        .map(([key, value]) => `${key},${value}`)
        .join('\n');

      const csvContent = header + timeframeRows + servicesHeader + servicesRows + statsHeader + statsRows;

      // Create a Blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `appointments-report-${timeframe}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Report exported successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  // Generate labels based on timeframe
  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'week':
        return 'Last 7 Days';
      case 'month':
        return 'Last 30 Days';
      case 'year':
        return 'Last 12 Months';
      default:
        return 'Last 30 Days';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 pt-16 pb-12 md:pl-64">
      <StaffSidebar />

      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold mb-1">My Reports</h1>
            <p className="text-neutral-600">
              View and analyze your appointment statistics.
            </p>
          </div>
          <div className="mt-4 md:mt-0 space-x-2 flex">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  timeframe === 'week'
                    ? 'bg-primary text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
                onClick={() => setTimeframe('week')}
              >
                Week
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium ${
                  timeframe === 'month'
                    ? 'bg-primary text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
                onClick={() => setTimeframe('month')}
              >
                Month
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  timeframe === 'year'
                    ? 'bg-primary text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
                onClick={() => setTimeframe('year')}
              >
                Year
              </button>
            </div>
            <button
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center gap-2"
              onClick={handleExportCSV}
            >
              <FaDownload size={14} /> Export
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-neutral-800">Total</h3>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaCalendarAlt className="text-blue-500" />
                </div>
              </div>
              <p className="text-3xl font-bold">{appointmentStats.total}</p>
              <p className="text-sm text-neutral-500 mt-1">Appointments</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-neutral-800">Completed</h3>
                <div className="p-3 bg-green-100 rounded-full">
                  <FaUserClock className="text-green-500" />
                </div>
              </div>
              <p className="text-3xl font-bold">{appointmentStats.completed}</p>
              <p className="text-sm text-neutral-500 mt-1">Successful appointments</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-neutral-800">Cancelled</h3>
                <div className="p-3 bg-red-100 rounded-full">
                  <FaCalendarAlt className="text-red-500" />
                </div>
              </div>
              <p className="text-3xl font-bold">{appointmentStats.cancelled}</p>
              <p className="text-sm text-neutral-500 mt-1">Cancelled appointments</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-neutral-800">No-Shows</h3>
                <div className="p-3 bg-amber-100 rounded-full">
                  <FaUserClock className="text-amber-500" />
                </div>
              </div>
              <p className="text-3xl font-bold">{appointmentStats.noShow}</p>
              <p className="text-sm text-neutral-500 mt-1">Missed appointments</p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-neutral-800 mb-4 flex items-center gap-2">
                  <FaChartBar className="text-primary" />
                  Appointments by {timeframe === 'week' ? 'Day' : timeframe === 'month' ? 'Date' : 'Month'}
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeframeData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="appointments" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-neutral-500 mt-4 text-center">{getTimeframeLabel()}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-neutral-800 mb-4 flex items-center gap-2">
                  <FaChartBar className="text-primary" />
                  Appointments by Service
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={serviceData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-neutral-500 mt-4 text-center">Top services by appointment count</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
