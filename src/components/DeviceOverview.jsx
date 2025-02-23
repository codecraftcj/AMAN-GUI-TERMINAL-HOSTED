import { fetchLatestWaterParameters } from "../services/api";
import { useEffect,useState } from "react";
const DeviceOverview = () => {
    const [waterParameters, setWaterParameters] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchWaterParameters = async () => {
            try {
                const data = await fetchLatestWaterParameters();
                setWaterParameters(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchWaterParameters();
    }, []);
    return (
        <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold">Device Overview</h2>
    <p className="mt-2 text-gray-300">
      View the status and details of connected devices.
    </p>
    <p>{waterParameters}</p>
  </div>
    )
  
};

export default DeviceOverview;
