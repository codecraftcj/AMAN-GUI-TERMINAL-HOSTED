import React, { useEffect, useState } from "react";
import { fetchRegisteredDevices, fetchDeviceJobs } from "../services/api";

const JobQueue = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [jobs, setJobs] = useState([]);
  const [limit, setLimit] = useState(10); // Default limit to 10
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const deviceList = await fetchRegisteredDevices();
        setDevices(deviceList);
        if (deviceList.length > 0) {
          setSelectedDevice(deviceList[0].device_id); // Set default to first device
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };
    fetchDevices();
  }, []);

  useEffect(() => {
    if (!selectedDevice) return;
    setLoading(true);
    let isMounted = true;

    const fetchJobs = async () => {
      try {
        const jobData = await fetchDeviceJobs(selectedDevice, { limit });
        if (isMounted) {
          setJobs(jobData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching device jobs:", error);
        setLoading(false);
      }
    };

    fetchJobs();
    const interval = setInterval(fetchJobs, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedDevice, limit]); // Fetch jobs when device or limit changes

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold pb-2 border-b">Device Job Records</h3>
      
      {/* Device Selection */}
      <label className="block text-sm font-semibold mt-2">Select Device:</label>
      <select
        className="w-full p-2 mt-2 border rounded-lg"
        value={selectedDevice}
        onChange={(e) => setSelectedDevice(e.target.value)}
      >
        {devices.map((device) => (
          <option key={device.device_id} value={device.device_id}>
            {device.device_id}
          </option>
        ))}
      </select>

      {/* Limit Selection */}
      <label className="block text-sm font-semibold mt-4">Number of Jobs:</label>
      <select
        className="w-full p-2 mt-2 border rounded-lg"
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
      >
        {[...Array(20)].map((_, index) => {
          const value = (index + 1) * 10;
          return <option key={value} value={value}>{value}</option>;
        })}
      </select>

      {/* Job Records Table */}
      {loading ? (
        <p className="text-center py-4">Loading job records...</p>
      ) : !jobs || jobs.length === 0 ? (
        <p className="text-center py-4">No job records found.</p>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-100 text-left">
                <th className="p-2">Job ID</th>
                <th className="p-2">Issued At</th>
                <th className="p-2">Job Name</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{job.id}</td>
                  <td className="p-2">{new Date(job.issued_at).toLocaleString()}</td>
                  <td className="p-2">{job.job_name}</td>
                  <td
                    className={`p-2 font-semibold ${
                      job.status === "Completed" ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {job.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobQueue;
