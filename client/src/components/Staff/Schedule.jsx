// src/pages/Staff/Schedule.jsx
import { useContext, useEffect, useState } from 'react';
import { FaClock, FaMoon, FaSave, FaSpinner, FaSun } from 'react-icons/fa';
import { toast } from 'react-toastify';
import StaffSidebar from '../../components/Layout/StaffSidebar';
import AuthContext from '../../context/AuthContext';
import { getStaffByUserId, getStaffSchedules, updateSchedule } from '../../services/staffService';

const StaffSchedule = () => {
  const { user } = useContext(AuthContext);
  const [staffInfo, setStaffInfo] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Days of the week
  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  // Time slots for selection
  const timeSlots = [];
  for (let i = 8; i <= 20; i++) {
    timeSlots.push(`${i}:00`);
    timeSlots.push(`${i}:30`);
  }

  useEffect(() => {
    const fetchScheduleData = async () => {
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
      } catch (error) {
        console.error('Error fetching schedule data:', error);
        toast.error('Failed to load schedule data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchScheduleData();
    }
  }, [user]);

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
    const newBreak = {
      name: 'Break',
      startTime: { hours: 14, minutes: 0 },
      endTime: { hours: 14, minutes: 30 }
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
        <div className="flex justify-between items-center mb-8">
          <div>
          // src/pages/Staff/Schedule.jsx (continued)
            <h1 className="text-2xl font-serif font-bold mb-1">My Schedule</h1>
            <p className="text-neutral-600">
              Set your working hours and break times for each day of the week.
            </p>
          </div>
          <button
            className="btn-secondary flex items-center"
            onClick={saveSchedules}
            disabled={saving || loading}
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {schedules.map((schedule, dayIndex) => (
              <div
                key={dayIndex}
                className={`bg-white rounded-lg shadow-md overflow-hidden ${
                  !schedule.isWorkingDay ? 'opacity-75' : ''
                }`}
              >
                <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium">{daysOfWeek[dayIndex]}</h2>
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <div className="text-sm mr-3 font-medium">Working Day</div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={schedule.isWorkingDay}
                          onChange={() => handleWorkingDayToggle(dayIndex)}
                        />
                        <div className={`block w-14 h-8 rounded-full ${
                          schedule.isWorkingDay ? 'bg-secondary' : 'bg-neutral-300'
                        }`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                          schedule.isWorkingDay ? 'translate-x-6' : ''
                        }`}></div>
                      </div>
                    </label>
                  </div>
                </div>

                {schedule.isWorkingDay && (
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Working Hours</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center text-neutral-700 text-sm mb-1">
                            <FaSun className="mr-2 text-yellow-500" />
                            Start Time
                          </label>
                          <select
                            className="form-input"
                            value={formatTimeObj(schedule.startTime)}
                            onChange={(e) => handleStartTimeChange(dayIndex, e.target.value)}
                          >
                            {timeSlots.map((slot) => (
                              <option key={`start-${slot}`} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="flex items-center text-neutral-700 text-sm mb-1">
                            <FaMoon className="mr-2 text-blue-500" />
                            End Time
                          </label>
                          <select
                            className="form-input"
                            value={formatTimeObj(schedule.endTime)}
                            onChange={(e) => handleEndTimeChange(dayIndex, e.target.value)}
                          >
                            {timeSlots.map((slot) => (
                              <option key={`end-${slot}`} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Breaks</h3>
                        <button
                          type="button"
                          className="text-secondary hover:text-secondary-dark text-sm font-medium"
                          onClick={() => addBreak(dayIndex)}
                        >
                          + Add Break
                        </button>
                      </div>

                      {schedule.breaks && schedule.breaks.length > 0 ? (
                        <div className="space-y-4">
                          {schedule.breaks.map((breakItem, breakIndex) => (
                            <div
                              key={breakIndex}
                              className="border border-neutral-200 rounded-lg p-4"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex-1 mr-4">
                                  <label className="text-neutral-700 text-sm mb-1 block">
                                    Break Name
                                  </label>
                                  <input
                                    type="text"
                                    className="form-input w-full"
                                    value={breakItem.name}
                                    onChange={(e) => handleBreakNameChange(dayIndex, breakIndex, e.target.value)}
                                    placeholder="e.g. Lunch, Coffee Break"
                                  />
                                </div>
                                <button
                                  type="button"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => removeBreak(dayIndex, breakIndex)}
                                >
                                  Remove
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="flex items-center text-neutral-700 text-sm mb-1">
                                    <FaClock className="mr-2 text-green-500" />
                                    Start Time
                                  </label>
                                  <select
                                    className="form-input"
                                    value={formatTimeObj(breakItem.startTime)}
                                    onChange={(e) => handleBreakStartChange(dayIndex, breakIndex, e.target.value)}
                                  >
                                    {timeSlots.map((slot) => (
                                      <option key={`break-start-${slot}`} value={slot}>
                                        {slot}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="flex items-center text-neutral-700 text-sm mb-1">
                                    <FaClock className="mr-2 text-red-500" />
                                    End Time
                                  </label>
                                  <select
                                    className="form-input"
                                    value={formatTimeObj(breakItem.endTime)}
                                    onChange={(e) => handleBreakEndChange(dayIndex, breakIndex, e.target.value)}
                                  >
                                    {timeSlots.map((slot) => (
                                      <option key={`break-end-${slot}`} value={slot}>
                                        {slot}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 border border-dashed border-neutral-300 rounded-lg">
                          <FaClock className="mx-auto text-neutral-400 mb-2" />
                          <p className="text-neutral-500 text-sm">No breaks scheduled</p>
                          <button
                            type="button"
                            className="mt-2 text-secondary hover:text-secondary-dark text-sm font-medium"
                            onClick={() => addBreak(dayIndex)}
                          >
                            Add a Break
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-end">
              <button
                className="btn-secondary flex items-center"
                onClick={saveSchedules}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffSchedule;
