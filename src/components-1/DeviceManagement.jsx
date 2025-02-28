import { useEffect, useState } from "react";
import { fetchRegisteredDevices, fetchAvailableDevices, confirmDevice, removeDevice } from "../services/api";

const DeviceManagement = () => {
    const [registeredDevices, setRegisteredDevices] = useState([]);
    const [availableDevices, setAvailableDevices] = useState([]);
    const [loadingRegistered, setLoadingRegistered] = useState(false);
    const [loadingAvailable, setLoadingAvailable] = useState(false);
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [loadingRemove, setLoadingRemove] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState("");

    useEffect(() => {
        const interval = setInterval(loadDevices, 3000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const loadDevices = async () => {


        try {
            const registered = await fetchRegisteredDevices();
            setRegisteredDevices(registered);

            const available = await fetchAvailableDevices();
            setAvailableDevices(Object.entries(available)); // Convert object to array
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingRegistered(false);
            setLoadingAvailable(false);
        }
    };

    const handleConfirmDevice = async (device_id) => {
        setLoadingConfirm(true);
        try {
            await confirmDevice(device_id);
            alert(`Device ${device_id} confirmed successfully.`);
            setAvailableDevices(availableDevices.filter(([id]) => id !== device_id)); // Remove from available list
            loadDevices(); // Refresh registered devices
        } catch (error) {
            alert(`Failed to confirm device: ${error.message}`);
        } finally {
            setLoadingConfirm(false);
        }
    };

    const handleRemoveDevice = async () => {
        if (!selectedDevice) return alert("Please select a device to remove.");
        setLoadingRemove(true);
        try {
            await removeDevice(selectedDevice);
            setSelectedDevice(""); // Reset selection
            loadDevices(); // Refresh registered and available devices
        } catch (error) {
            console.log("ERROR FOUND")
            console.log(error)
        } finally {
            setLoadingRemove(false);
        }
    };

    return (
        <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold">Device Management</h2>

            {/* Registered Devices List */}
            <div className="mt-4">
                <h3 className="text-lg font-bold">Registered Devices</h3>
                {loadingRegistered ? (
                    <p>Loading registered devices...</p>
                ) : registeredDevices.length > 0 ? (
                    <ul className="mt-2">
                        {registeredDevices.map(({ device_id, status, hostname }) => (
                            <li key={device_id} className="flex justify-between items-center p-2 bg-gray-800 rounded-lg mt-2">
                                <span>{device_id} ({hostname}) - <span className="text-gray-400">{status}</span></span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No registered devices found.</p>
                )}
            </div>

            {/* Available Devices List */}
            <div className="mt-6">
                <h3 className="text-lg font-bold">Available Devices</h3>
                {loadingAvailable ? (
                    <p>Loading available devices...</p>
                ) : availableDevices.length > 0 ? (
                    <ul className="mt-2">
                        {availableDevices.map(([device_id, info]) => (
                            <li key={device_id} className="flex justify-between items-center p-2 bg-gray-800 rounded-lg mt-2">
                                <span>{device_id} ({info.hostname})</span>
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                                    onClick={() => handleConfirmDevice(device_id)}
                                    disabled={loadingConfirm}
                                >
                                    {loadingConfirm ? "Confirming..." : "Confirm"}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No available devices found.</p>
                )}
            </div>

            {/* Remove Device Section */}
            <div className="mt-6">
                <h3 className="text-lg font-bold">Remove a Device</h3>
                <select
                    className="bg-gray-800 text-white p-2 rounded mt-2 w-full"
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                >
                    <option value="">Select a device to remove</option>
                    {registeredDevices.map(({ device_id }) => (
                        <option key={device_id} value={device_id}>{device_id}</option>
                    ))}
                </select>
                <button
                    className={`py-2 px-4 rounded mt-4 ${
                        loadingRemove
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                    onClick={handleRemoveDevice}
                    disabled={loadingRemove || !selectedDevice}
                >
                    {loadingRemove ? "Removing..." : "Remove Device"}
                </button>
            </div>
        </div>
    );
};

export default DeviceManagement;