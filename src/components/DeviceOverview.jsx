import { fetchLatestWaterParameters, fetchDeviceJobs,fetchDeviceCameraURL } from "../services/api";
import { useEffect, useState } from "react";

const DeviceOverview = () => {
    const DEVICE_ID = "EMULATOR-001";
    const [waterParameters, setWaterParameters] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cameraURL,setCameraURL] = useState(null);
    useEffect(() => {
        let isMounted = true; 

        const fetchWaterParameters = async () => {
            try {
                const data = await fetchLatestWaterParameters();
                if (isMounted) {
                    setWaterParameters(data);
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
            }
        };

        const fetchDeviceJobsJSON = async () => {
            try {
                const jobData = await fetchDeviceJobs(DEVICE_ID);
                console.log(jobData);
                if (isMounted) {
                    setJobs(jobData);
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
            }
        };
        const fetchDeviceCamera = async(device_id) =>{
            const camera_url = await fetchDeviceCameraURL(DEVICE_ID);
            setCameraURL(camera_url)
        }
        const interval = setInterval(fetchWaterParameters, 5000);
        const interval2 = setInterval(fetchDeviceJobsJSON, 5000);
        fetchDeviceCamera(DEVICE_ID)
        return () => {
            isMounted = false;
            clearInterval(interval);
            clearInterval(interval2);
        };
    }, []);

    return (
        <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold">Device Overview</h2>
            <p className="mt-2 text-gray-300">
                View the status and details of connected devices.
            </p>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {waterParameters ? (
                        <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow">
                            <p><strong>Device ID:</strong> {waterParameters.device_id}</p>
                            <p><strong>PH Level:</strong> {waterParameters.ph_level}</p>
                            <p><strong>Temperature:</strong> {waterParameters.temperature}°C</p>
                            <p><strong>Hydrogen Sulfide:</strong> {waterParameters.hydrogen_sulfide_level} ppm</p>
                            <p><strong>Turbidity:</strong> {waterParameters.turbidity} NTU</p>
                            <p className="text-gray-400 text-sm">
                                <strong>Last Updated:</strong> {waterParameters.created_date}
                            </p>
                        </div>
                    ) : (
                        <p>No data available</p>
                    )}
                    
                    <div className="mt-6">
                        <h3 className="text-xl font-bold">Device Jobs</h3>
                        {jobs.length > 0 ? (
                            <table className="w-full mt-2 border-collapse border border-gray-700">
                                <thead>
                                    <tr className="bg-gray-800">
                                        <th className="border border-gray-700 p-2">Job ID</th>
                                        <th className="border border-gray-700 p-2">Issued At</th>
                                        <th className="border border-gray-700 p-2">Job Name</th>
                                        <th className="border border-gray-700 p-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((job) => (
                                        <tr key={job.id} className="bg-gray-700">
                                            <td className="border border-gray-700 p-2 text-center">{job.id}</td>
                                            <td className="border border-gray-700 p-2 text-center">{job.issued_at}</td>
                                            <td className="border border-gray-700 p-2 text-center">{job.job_name}</td>
                                            <td className="border border-gray-700 p-2 text-center">{job.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No jobs available</p>
                        )}
                    </div>
                    <div className="mt-6">
                        <h3 className="text-xl font-bold">Camera Feed</h3>
                        {cameraURL ? (
                            <img src={cameraURL} alt="Camera Feed" className="mt-2 w-full rounded-lg" />
                        ) : (
                            <p>No camera feed available</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default DeviceOverview;