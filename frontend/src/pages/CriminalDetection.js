// import React, { useState } from 'react';
// import Navbar from './Navbar';

// const CriminalDetection = () => {
//   const [videoFile, setVideoFile] = useState(null);
//   const [processing, setProcessing] = useState(false);
//   const [webcamStarted, setWebcamStarted] = useState(false);

//   const handleVideoChange = (e) => {
//     setVideoFile(e.target.files[0]);
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!videoFile) {
//       alert("Please choose a video file.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('video', videoFile);

//     setProcessing(true);
//     try {
//       await fetch('http://localhost:5000/api/criminal-detection', {
//         method: 'POST',
//         body: formData,
//       });
//       setWebcamStarted(false);
//     } catch (error) {
//       console.error("Upload failed:", error);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const handleStartWebcam = async () => {
//     setProcessing(true);
//     try {
//       await fetch('http://localhost:5000/api/criminal-detection/start_webcam', {
//         method: 'POST',
//       });
//       setWebcamStarted(true);
//     } catch (error) {
//       console.error("Failed to start webcam:", error);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const handleStopWebcam = async () => {
//     try {
//       await fetch('http://localhost:5000/api/criminal-detection/stop_webcam', {
//         method: 'POST',
//       });
//       setWebcamStarted(false);
//     } catch (error) {
//       console.error("Failed to stop webcam:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 pt-24 px-4">
//       {/* Navbar */}
//       <Navbar />

//       {/* Page content */}
//       <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md mt-8">
//         <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Criminal Detection</h2>

//         {/* Upload Form */}
//         <form onSubmit={handleUpload} className="flex flex-col md:flex-row items-center gap-4 mb-8">
//           <input
//             type="file"
//             accept="video/*"
//             onChange={handleVideoChange}
//             className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition"
//           >
//             Upload Video
//           </button>
//         </form>

//         {/* Webcam Buttons */}
//         <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
//           <button
//             onClick={handleStartWebcam}
//             disabled={webcamStarted}
//             className={`py-2 px-6 rounded-full font-semibold transition ${
//               webcamStarted ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
//             }`}
//           >
//             Start Webcam
//           </button>
//           <button
//             onClick={handleStopWebcam}
//             disabled={!webcamStarted}
//             className={`py-2 px-6 rounded-full font-semibold transition ${
//               !webcamStarted ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'
//             }`}
//           >
//             Stop Webcam
//           </button>
//         </div>

//         {/* Video Feed */}
//         <div className="rounded-xl overflow-hidden shadow-md">
//           <img
//             src="http://localhost:5000/api/criminal-detection/video_feed"
//             alt="Video Feed"
//             className="w-full max-h-[400px] object-cover"
//           />
//         </div>

//         {/* Processing message */}
//         {processing && (
//           <p className="text-orange-500 text-center mt-4 font-semibold animate-pulse">
//             Processing...
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CriminalDetection;



import React, { useState } from 'react';
import Navbar from './Navbar';

const CriminalDetection = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [webcamStarted, setWebcamStarted] = useState(false);
  const [videoDetectionStarted, setVideoDetectionStarted] = useState(false);

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
      setVideoDetectionStarted(true);
      setWebcamStarted(false);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleStopDetection = async () => {
    setProcessing(true);
    try {
      await fetch('http://localhost:5000/api/criminal-detection/stop', {
        method: 'POST',
      });
      setVideoDetectionStarted(false);
    } catch (error) {
      console.error("Failed to stop detection:", error);
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
      setVideoDetectionStarted(false);
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
    <div className="min-h-screen bg-gray-100 pt-24 px-4">
      {/* Navbar */}
      <Navbar />

      {/* Page content */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md mt-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Criminal Detection</h2>

        {/* Upload Form with Stop Detection Button */}
        <form onSubmit={handleUpload} className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition"
            >
              Upload Video
            </button>
            <button
              type="button"
              onClick={handleStopDetection}
              disabled={!videoDetectionStarted}
              className={`font-semibold py-2 px-6 rounded-full transition ${
                !videoDetectionStarted
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              Stop Detection
            </button>
          </div>
        </form>

        {/* Webcam Buttons */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
          <button
            onClick={handleStartWebcam}
            disabled={webcamStarted}
            className={`py-2 px-6 rounded-full font-semibold transition ${
              webcamStarted ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Start Webcam
          </button>
          <button
            onClick={handleStopWebcam}
            disabled={!webcamStarted}
            className={`py-2 px-6 rounded-full font-semibold transition ${
              !webcamStarted ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Stop Webcam
          </button>
        </div>

        {/* Video Feed */}
        <div className="rounded-xl overflow-hidden shadow-md">
          <img
            src="http://localhost:5000/api/criminal-detection/video_feed"
            alt="Video Feed"
            className="w-full max-h-[400px] object-cover"
          />
        </div>

        {/* Processing message */}
        {processing && (
          <p className="text-orange-500 text-center mt-4 font-semibold animate-pulse">
            Processing...
          </p>
        )}
      </div>
    </div>
  );
};

export default CriminalDetection;
