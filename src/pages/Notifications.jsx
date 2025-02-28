import React, { useEffect, useState } from "react";
import { fetchUnreadNotifications, markNotificationAsSeen } from "../services/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, [currentPage, limit]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchUnreadNotifications((currentPage - 1) * limit, limit);
      setNotifications(data.notifications);
      setTotalCount(data.total_count);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSeen = async (notification_id) => {
    try {
      await markNotificationAsSeen(notification_id);
      setNotifications(notifications.filter(notif => notif.id !== notification_id));
      setTotalCount(totalCount - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold pb-2 border-b">Unread Notifications</h3>

      {/* Limit Dropdown */}
      <div className="mt-4 flex justify-between">
        <label className="text-sm font-semibold">
          Show:
          <select
            className="ml-2 border p-1 rounded"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            {[10, 20, 30, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Notification Table */}
      {loading ? (
        <p className="text-center py-4">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-center py-4">No unread notifications.</p>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-100 text-left">
                <th className="p-2">Message</th>
                <th className="p-2">Details</th>
                <th className="p-2">Date</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notif) => (
                <tr key={notif.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{notif.message}</td>
                  <td className="p-2">{notif.details || "No details"}</td>
                  <td className="p-2">{notif.created_at}</td>
                  <td className="p-2">
                    <button
                      className="py-1 px-3 rounded bg-green-600 text-white hover:bg-green-700"
                      onClick={() => handleMarkAsSeen(notif.id)}
                    >
                      Mark as Read
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
