import React, { useState, useEffect, useRef } from "react";
import { fetchDeviceCameraURL, processCurrentFrame } from "../services/api";

const FishHealthChecker = ({ device_id }) => {
  const [cameraFeed, setCameraFeed] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Fetch the camera feed URL when component mounts
  useEffect(() => {
    const loadCameraFeed = async () => {
      try {
        const url = await fetchDeviceCameraURL(device_id);
        setCameraFeed(url);
      } catch (error) {
        console.error("Error fetching camera feed:", error);
      }
    };

    loadCameraFeed();
  }, [device_id]);

  // Capture the current frame from the video feed
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
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
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold pb-2 border-b">Camera Processing</h3>

      <div className="mt-4">
        <h4 className="text-sm font-semibold">Live Camera Feed:</h4>
        {cameraFeed ? (
          <video
            ref={videoRef}
            src={cameraFeed}
            autoPlay
            playsInline
            muted
            className="w-full max-w-lg rounded shadow-lg border"
          />
        ) : (
          <p className="text-center py-4">Loading camera feed...</p>
        )}
      </div>

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleProcessImage}
        disabled={loading}
      >
        {loading ? "Processing..." : "Process Image"}
      </button>

      {processedImage && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold">Processed Image:</h4>
          <img src={processedImage} alt="Processed" className="mt-2 max-w-lg rounded shadow-lg border" />
        </div>
      )}

      {/* Hidden canvas for capturing frames */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default FishHealthChecker;
