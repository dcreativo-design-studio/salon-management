// src/pages/Staff/Schedule.jsx
import React, { useContext, useEffect, useState } from 'react';
import { FaCalendarAlt, FaClock, FaPlus, FaSave, FaSpinner, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import StaffSidebar from '../../components/Layout/StaffSidebar';
import AuthContext from '../../context/AuthContext';
import { getStaffAppointments } from '../../services/appointmentService';
import { getStaffByUserId, getStaffSchedules, updateSchedule } from '../../services/staffService';

const Schedule = () => {
  const { user } = useContext(AuthContext);
  const [staffInfo, setStaffInfo] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showUpcomingAppointments, setShowUpcomingAppointments] = useState(true);

  // Days of the week
  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  // Time slots for selection (half-hour intervals from 7:00 to 20:00)
  const timeSlots = [];
  for (let i = 7; i <= 20; i++) {
    timeSlots.push(`${i}:00`);
    if (i < 20) {
      timeSlots.push(`${i}:30`);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get staff information
        const staffRes = await getStaffByUserId(user.id);
        setStaffInfo(staffRes.data);

        // Get schedule
        const schedulesRes = await getStaffSchedules(staffRes.data._id);

        // Organize schedules by day of week
        const organizedSchedules = [];
        for (let i = 0; i < 7; i++) {
          const daySchedule = schedulesRes.data.find(s => s.dayOfWeek === i);

          if (daySchedule) {
            organizedSchedules[i] = daySchedule;
          } else {
            // Create default schedule for day if not found
            organizedSchedules[i] = {
              dayOfWeek: i,
              isWorkingDay: i >= 1 && i <= 5, // Monday to Friday are working days by default
              startTime: { hours: 9, minutes: 0 },
              endTime: { hours: 18, minutes: 0 },
              breaks: [
                {
                  name: 'Lunch',
                  startTime: { hours: 12, minutes: 0 },
                  endTime: { hours: 13, minutes: 0 }
                }
              ]
            };
          }
        }

        setSchedules(organizedSchedules);

        // Get upcoming appointments
        fetchUpcomingAppointments(staffRes.data._id);
      } catch (error) {
        console.error('Error fetching staff data:', error);
        toast.error('Failed to load schedule data');
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const fetchUpcomingAppointments = async (staffId) => {
    try {
      // Get upcoming appointments
      const appointmentsRes = await getStaffAppointments(staffId, {
        upcoming: true,
        limit: 10
      });

      setAppointments(appointmentsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
      setLoading(false);
    }
  };

  // Format time object to string (HH:MM)
  const formatTimeObj = (timeObj) => {
    if (!timeObj) return '09:00';
    const hours = timeObj.hours.toString().padStart(2, '0');
    const minutes = timeObj.minutes.toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Parse time string to object ({ hours, minutes })
  const parseTimeStr = (timeStr) => {
    const [hoursStr, minutesStr] = timeStr.split(':');
    return {
      hours: parseInt(hoursStr, 10),
      minutes: parseInt(minutesStr, 10)
    };
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format time for display
  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  // Handle working day toggle
  const handleWorkingDayToggle = (dayIndex) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[dayIndex] = {
      ...updatedSchedules[dayIndex],
      isWorkingDay: !updatedSchedules[dayIndex].isWorkingDay
    };
    setSchedules(updatedSchedules);
  };

  // Handle start time change
  const handleStartTimeChange = (dayIndex, timeStr) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[dayIndex] = {
      ...updatedSchedules[dayIndex],
      startTime: parseTimeStr(timeStr)
    };
    setSchedules(updatedSchedules);
  };

  // Handle end time change
  const handleEndTimeChange = (dayIndex, timeStr) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[dayIndex] = {
      ...updatedSchedules[dayIndex],
      endTime: parseTimeStr(timeStr)
    };
    setSchedules(updatedSchedules);
  };

  // Handle break start time change
  const handleBreakStartChange = (dayIndex, breakIndex, timeStr) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[dayIndex].breaks[breakIndex] = {
      ...updatedSchedules[dayIndex].breaks[breakIndex],
      startTime: parseTimeStr(timeStr)
    };
    setSchedules(updatedSchedules);
  };

  // Handle break end time change
  const handleBreakEndChange = (dayIndex, breakIndex, timeStr) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[dayIndex].breaks[breakIndex] = {
      ...updatedSchedules[dayIndex].breaks[breakIndex],
      endTime: parseTimeStr(timeStr)
    };
    setSchedules(updatedSchedules);
  };

  // Handle break name change
  const handleBreakNameChange = (dayIndex, breakIndex, name) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[dayIndex].breaks[breakIndex] = {
      ...updatedSchedules[dayIndex].breaks[breakIndex],
      name
    };
    setSchedules(updatedSchedules);
  };

  // Add new break
  const addBreak = (dayIndex) => {
    const updatedSchedules = [...schedules];

    // Calculate default break time in the middle of the working hours
    const startHour = updatedSchedules[dayIndex].startTime.hours;
    const endHour = updatedSchedules[dayIndex].endTime.hours;
    const middleHour = Math.floor((startHour + endHour) / 2);

    const newBreak = {
      name: 'Break',
      startTime: { hours: middleHour, minutes: 0 },
      endTime: { hours: middleHour, minutes: 30 }
    };

    updatedSchedules[dayIndex].breaks = [
      ...updatedSchedules[dayIndex].breaks,
      newBreak
    ];

    setSchedules(updatedSchedules);
  };

  // Remove break
  const removeBreak = (dayIndex, breakIndex) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[dayIndex].breaks = updatedSchedules[dayIndex].breaks.filter(
      (_, i) => i !== breakIndex
    );
    setSchedules(updatedSchedules);
  };

  // Save schedule changes
  const saveSchedules = async () => {
    setSaving(true);
    try {
      // Save each day's schedule
      for (const schedule of schedules) {
        await updateSchedule(staffInfo._id, schedule.dayOfWeek, schedule);
      }
      toast.success('Schedule updated successfully');
    } catch (error) {
      console.error('Error saving schedules:', error);
      toast.error('Failed to update schedule');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 pt-16 pb-12 md:pl-64">
      <StaffSidebar />

      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold mb-1">My Schedule</h1>
            <p className="text-neutral-600">
              Manage your working hours and breaks for each day of the week.
            </p>
          </div>
          <div className="mt-4 md:mt-0 space-x-4 flex">
            <button
              className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-300 transition-colors"
              onClick={() => setShowUpcomingAppointments(!showUpcomingAppointments)}
            >
              {showUpcomingAppointments ? 'Hide Appointments' : 'Show Appointments'}
            </button>
            <button
              className="btn-primary flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              onClick={saveSchedules}
              disabled={saving}
            >
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              Save Changes
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <FaSpinner className="animate-spin text-primary text-3xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Schedule Editor */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-neutral-200 bg-neutral-50">
                  <h2 className="font-serif font-semibold flex items-center gap-2">
                    <FaCalendarAlt className="text-primary" />
                    Weekly Schedule
                  </h2>
                </div>

                <div className="p-4">
                  {schedules.map((daySchedule, dayIndex) => (
                    <div key={dayIndex} className="mb-6 pb-6 border-b border-neutral-200 last:border-0 last:mb-0 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">{daysOfWeek[dayIndex]}</h3>
                        <div className="flex items-center gap-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              value=""
                              className="sr-only peer"
                              checked={daySchedule.isWorkingDay}
                              onChange={() => handleWorkingDayToggle(dayIndex)}
                            />
                            <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            <span className="ml-3 text-sm font-medium text-neutral-700">
                              {daySchedule.isWorkingDay ? 'Working Day' : 'Day Off'}
                            </span>
                          </label>
                        </div>
                      </div>

                      {daySchedule.isWorkingDay && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Start Time
                              </label>
                              <select
                                className="w-full p-2 border border-neutral-300 rounded-md"
                                value={formatTimeObj(daySchedule.startTime)}
                                onChange={(e) => handleStartTimeChange(dayIndex, e.target.value)}
                              >
                                {timeSlots.map((time) => (
                                  <option key={`start-${time}`} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-1">
                                End Time
                              </label>
                              <select
                                className="w-full p-2 border border-neutral-300 rounded-md"
                                value={formatTimeObj(daySchedule.endTime)}
                                onChange={(e) => handleEndTimeChange(dayIndex, e.target.value)}
                              >
                                {timeSlots.map((time) => (
                                  <option key={`end-${time}`} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-neutral-700">Breaks</h4>
                              <button
                                type="button"
                                className="text-sm text-primary flex items-center gap-1 hover:text-primary-dark"
                                onClick={() => addBreak(dayIndex)}
                              >
                                <FaPlus size={12} /> Add Break
                              </button>
                            </div>

                            {daySchedule.breaks.length > 0 ? (
                              <div className="space-y-3">
                                {daySchedule.breaks.map((breakItem, breakIndex) => (
                                  <div key={breakIndex} className="bg-neutral-50 p-3 rounded-md border border-neutral-200">
                                    <div className="flex items-center gap-2 mb-2">
                                      <input
                                        type="text"
                                        className="flex-1 p-1 text-sm border border-neutral-300 rounded"
                                        value={breakItem.name}
                                        onChange={(e) => handleBreakNameChange(dayIndex, breakIndex, e.target.value)}
                                        placeholder="Break Name"
                                      />
                                      <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => removeBreak(dayIndex, breakIndex)}
                                      >
                                        <FaTrash size={14} />
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="block text-xs text-neutral-500 mb-1">
                                          Start
                                        </label>
                                        <select
                                          className="w-full p-1 text-sm border border-neutral-300 rounded"
                                          value={formatTimeObj(breakItem.startTime)}
                                          onChange={(e) => handleBreakStartChange(dayIndex, breakIndex, e.target.value)}
                                        >
                                          {timeSlots.map((time) => (
                                            <option key={`break-start-${breakIndex}-${time}`} value={time}>
                                              {time}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                      <div>
                                        <label className="block text-xs text-neutral-500 mb-1">
                                          End
                                        </label>
                                        <select
                                          className="w-full p-1 text-sm border border-neutral-300 rounded"
                                          value={formatTimeObj(breakItem.endTime)}
                                          onChange={(e) => handleBreakEndChange(dayIndex, breakIndex, e.target.value)}
                                        >
                                          {timeSlots.map((time) => (
                                            <option key={`break-end-${breakIndex}-${time}`} value={time}>
                                              {time}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-neutral-500 italic">No breaks set for this day.</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            {showUpcomingAppointments && (
              <div className="lg:col-span-4">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 border-b border-neutral-200 bg-neutral-50">
                    <h2 className="font-serif font-semibold flex items-center gap-2">
                      <FaClock className="text-primary" />
                      Upcoming Appointments
                    </h2>
                  </div>

                  <div className="divide-y divide-neutral-200 max-h-[600px] overflow-y-auto">
                    {appointments.length > 0 ? (
                      appointments.map((appointment) => (
                        <div key={appointment._id} className="p-4 hover:bg-neutral-50">
                          <p className="font-medium">{appointment.client.firstName} {appointment.client.lastName}</p>
                          <p className="text-sm text-neutral-600">{appointment.service.name}</p>
                          <div className="flex items-center gap-1 mt-1 text-sm text-neutral-500">
                            <span>{formatDate(appointment.startTime)}</span>
                            <span>•</span>
                            <span>{formatTime(appointment.startTime)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-neutral-500">No upcoming appointments.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
