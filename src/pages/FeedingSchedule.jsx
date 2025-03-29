import React, { useState, useEffect } from "react";
import {
  getDeviceFeedingSchedule,
  setDeviceFeedingSchedule,
} from "../services/api";

const DEVICE_ID = "EMULATOR-001";

const FeedingSchedule = () => {
  const [interval, setInterval] = useState(30); // Default 30 minutes
  const [days, setDays] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
    Sunday: true,
  });
  const [startTime, setStartTime] = useState("08:00 AM");
  const [endTime, setEndTime] = useState("05:00 PM");
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await getDeviceFeedingSchedule(DEVICE_ID);
        if (response.response) {
          const feeding_schedule_data = response.response;
          console.log("SCHEDULEEEE", feeding_schedule_data);
          setInterval(feeding_schedule_data.schedule.habit.minute_interval);
          setDays(feeding_schedule_data.schedule.habit.days);
          setStartTime(feeding_schedule_data.schedule.start_time);
          setEndTime(feeding_schedule_data.schedule.end_time);
        }
      } catch (error) {
        console.error("Error fetching device feeding schedule:", error);
      } finally {
        setLoading(false); // Stop loading when data is fetched
      }
    };

    fetchSchedule();
  }, []);

  const handleDayToggle = (day) => {
    setDays((prevDays) => ({
      ...prevDays,
      [day]: !prevDays[day],
    }));
  };

  const handleSubmit = async () => {
    const scheduleData = {
      habit: {
        minute_interval: interval,
        days,
      },
      start_time: startTime,
      end_time: endTime,
    };

    try {
      await setDeviceFeedingSchedule(DEVICE_ID, scheduleData);
      alert("Feeding schedule saved successfully!");
    } catch (error) {
      console.error("Error saving feeding schedule:", error);
      alert("Failed to save feeding schedule.");
    }
  };

  return (
    <div className="p-5 mt-4 rounded-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">Feeding Schedule</h2>
      <p className="text-gray-500">Set up your automated feeding schedule.</p>

      {/* Show loading state */}
      {loading ? (
        <div className="text-center text-gray-500 mt-4">Loading...</div>
      ) : (
        <>
          {/* Interval Input */}
          <div className="mt-4">
            <label className="block text-gray-700 font-semibold">
              Feed Every (minutes)
            </label>
            <input
              type="number"
              min="1"
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          {/* Days Selection */}
          <div className="mt-4">
            <label className="block text-gray-700 font-semibold">
              Select Feeding Days
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {Object.keys(days).map((day) => (
                <button
                  key={day}
                  className={`p-2 rounded border text-center ${
                    days[day] ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => handleDayToggle(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Start & End Time */}
          <div className="mt-4 mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold">
                Start Time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 border rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">
                End Time
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 border rounded mt-1"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Save Schedule
          </button>
        </>
      )}
    </div>
  );
};

export default FeedingSchedule;
