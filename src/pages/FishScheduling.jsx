import React, { useState } from "react";

const FeedingSchedule = () => {
  const [interval, setInterval] = useState(30); // Default 30 minutes
  const [days, setDays] = useState([]);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [note, setNote] = useState("");

  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleDayToggle = (day) => {
    setDays((prevDays) =>
      prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
    );
  };

  const handleSubmit = () => {
    const scheduleData = {
      interval,
      days,
      startTime,
      endTime,
      note,
    };
    console.log("Feeding Schedule Saved:", scheduleData);
    alert("Feeding schedule saved successfully!");
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-900">Feeding Schedule</h2>
      <p className="text-gray-500">Set up your automated feeding schedule.</p>

      {/* Interval Input */}
      <div className="mt-4">
        <label className="block text-gray-700 font-semibold">Feed Every (minutes)</label>
        <input
          type="number"
          min="1"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="w-full p-2 border rounded mt-1"
        />
      </div>

      {/* Days Selection */}
      <div className="mt-4">
        <label className="block text-gray-700 font-semibold">Select Feeding Days</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
          {allDays.map((day) => (
            <button
              key={day}
              className={`p-2 rounded border text-center ${days.includes(day) ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => handleDayToggle(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Start & End Time */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        </div>
      </div>

      {/* Notes Section */}
      <div className="mt-4">
        <label className="block text-gray-700 font-semibold">Notes</label>
        <textarea
          className="w-full p-2 border rounded mt-1"
          rows="3"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Set a static feeding operation and measure feed weight released..."
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Save Schedule
      </button>
    </div>
  );
};

export default FeedingSchedule;
