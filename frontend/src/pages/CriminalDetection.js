import React, { useState } from 'react';

const CriminalDetection = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [webcamStarted, setWebcamStarted] = useState(false);

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert("Please choose a video file.");
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);

    setProcessing(true);
    try {
      await fetch('http://localhost:5000/api/criminal-detection', {
        method: 'POST',
        body: formData,
      });
      setWebcamStarted(false);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleStartWebcam = async () => {
    setProcessing(true);
    try {
      await fetch('http://localhost:5000/api/criminal-detection/start_webcam', {
        method: 'POST',
      });
      setWebcamStarted(true);
    } catch (error) {
      console.error("Failed to start webcam:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleStopWebcam = async () => {
    try {
      await fetch('http://localhost:5000/api/criminal-detection/stop_webcam', {
        method: 'POST',
      });
      setWebcamStarted(false);
    } catch (error) {
      console.error("Failed to stop webcam:", error);
    }
  };
  
  

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Criminal Detection</h2>

      <form onSubmit={handleUpload}>
        <input type="file" accept="video/*" onChange={handleVideoChange} />
        <button type="submit">Upload Video</button>
      </form>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleStartWebcam} disabled={webcamStarted}>Start Webcam</button>
        <button onClick={handleStopWebcam} disabled={!webcamStarted}>Stop Webcam</button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <img
          src="http://localhost:5000/api/criminal-detection/video_feed"
          alt="Video Feed"
          style={{ width: '100%', maxHeight: '400px' }}
        />
      </div>

      {processing && <p style={{ color: 'orange' }}>Processing...</p>}
    </div>
  );
};

export default CriminalDetection;
