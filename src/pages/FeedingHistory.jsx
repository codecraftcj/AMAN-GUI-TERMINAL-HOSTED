import React, { useState } from "react";

const FeedingHistory = () => {
  const [history] = useState([
    { id: 1, date: "2025-03-01", time: "08:30 AM", feedAmount: "2kg", status: "Completed" },
    { id: 2, date: "2025-03-01", time: "12:00 PM", feedAmount: "2.5kg", status: "Completed" },
    { id: 3, date: "2025-03-01", time: "04:30 PM", feedAmount: "3kg", status: "Completed" },
  ]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Feeding History</h2>
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Time</th>
            <th className="border border-gray-300 p-2">Feed Amount</th>
            <th className="border border-gray-300 p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((record) => (
            <tr key={record.id} className="text-center">
              <td className="border border-gray-300 p-2">{record.date}</td>
              <td className="border border-gray-300 p-2">{record.time}</td>
              <td className="border border-gray-300 p-2">{record.feedAmount}</td>
              <td className="border border-gray-300 p-2 text-green-600 font-semibold">{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedingHistory;
