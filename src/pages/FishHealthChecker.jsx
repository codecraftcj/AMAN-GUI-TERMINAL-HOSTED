import React, { useState, useEffect, useRef } from "react";
import { fetchTerminalCameraURL, processCurrentFrame } from "../services/api";
import { IoCamera, IoCheckmarkCircle, IoRefresh } from "react-icons/io5";

const FishHealthChecker = ({ device_id }) => {
  const [cameraFeed, setCameraFeed] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Fetch the camera feed URL when the component mounts
  useEffect(() => {
    const loadCameraFeed = async () => {
      try {
        const url = await fetchTerminalCameraURL();
        setCameraFeed(url);
      } catch (error) {
        console.error("Error fetching camera feed:", error);
      }
    };

    loadCameraFeed();
  }, []);

  // Capture the current frame from the live feed
  const captureFrame = () => {
    if (!canvasRef.current || !imageRef.current) return null;

    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      const img = imageRef.current;

      if (!img.complete) {
        reject("Image not fully loaded");
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };

  // Process the captured image
  const handleProcessImage = async () => {
    setLoading(true);
    try {
      const frameBlob = await captureFrame();
      if (!frameBlob) {
        alert("Failed to capture image from camera.");
        setLoading(false);
        return;
      }

      const processedImageUrl = await processCurrentFrame(frameBlob);
      setProcessedImage(processedImageUrl);
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
        <h3 className="text-xl font-bold text-center text-gray-900">Fish Health Checker</h3>
        <p className="text-center text-gray-500">Monitor and analyze fish health using real-time image processing.</p>

        {/* Live Camera Feed */}
        <div className="mt-6 relative border rounded-lg overflow-hidden shadow-md">
          {cameraFeed ? (
            <img
              ref={imageRef}
              src={cameraFeed}
              alt="Live Camera Feed"
              crossOrigin="anonymous"
              className="w-full rounded-lg"
            />
          ) : (
            <div className="flex items-center justify-center h-60 bg-gray-200 text-gray-600">
              Loading camera feed...
            </div>
          )}
        </div>

        {/* Capture & Process Button */}
        <div className="mt-4 flex justify-center">
          <button
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all disabled:bg-gray-400"
            onClick={handleProcessImage}
            disabled={loading}
          >
            {loading ? (
              <>
                <IoRefresh className="animate-spin mr-2" size={20} />
                Processing...
              </>
            ) : (
              <>
                <IoCamera className="mr-2" size={20} />
                Capture & Analyze
              </>
            )}
          </button>
        </div>

        {/* Processed Image */}
        {processedImage && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md border">
            <h4 className="text-lg font-semibold text-center text-gray-800">Processed Image</h4>
            <div className="mt-4 flex flex-col items-center">
              <img src={processedImage} alt="Processed" className="rounded-lg shadow-md border" />
              <p className="text-green-600 mt-2 flex items-center">
                <IoCheckmarkCircle className="mr-1" size={20} />
                Analysis Complete
              </p>
            </div>
          </div>
        )}

        {/* Hidden canvas for capturing frames */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default FishHealthChecker;
