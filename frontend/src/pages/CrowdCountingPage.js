// import React, { useState } from 'react';
// import { Box, Typography, Container, Button, CircularProgress, Input } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import Navbar from './Navbar';

// const CrowdCountingPage = () => {
//   const navigate = useNavigate();
//   const [videoFile, setVideoFile] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [showResult, setShowResult] = useState(false);

//   const handleFileChange = (e) => {
//     setVideoFile(e.target.files[0]);
//     setShowResult(false); // Reset result if user selects a new file
//   };

//   const handleUpload = async () => {
//     if (!videoFile) return;

//     const formData = new FormData();
//     formData.append('video', videoFile);

//     setIsProcessing(true);
//     setShowResult(false);

//     try {
//       const response = await fetch('http://localhost:5000/api/crowd-count/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         setIsProcessing(false);
//         setShowResult(true);
//       } else {
//         alert('Upload failed');
//         setIsProcessing(false);
//       }
//     } catch (error) {
//       console.error('Error uploading video:', error);
//       alert('An error occurred');
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div style={{ backgroundColor: '#f8f8f8', minHeight: '100vh' }}>
//       <Navbar />
//       <Container maxWidth="md">
//         <Box sx={{ mt: 4, textAlign: 'center' }}>
//           <Typography variant="h4" gutterBottom>
//             Crowd Counting
//           </Typography>
//           <Typography variant="subtitle1" gutterBottom>
//             Upload a video to analyze crowd size using AI
//           </Typography>

//           <Box sx={{ mt: 3 }}>
//             <Input
//               type="file"
//               accept="video/*"
//               onChange={handleFileChange}
//               disableUnderline
//             />
//           </Box>

//           <Box sx={{ mt: 2 }}>
//             <Button
//               variant="contained"
//               color="primary"
//               disabled={!videoFile || isProcessing}
//               onClick={handleUpload}
//             >
//               Upload Video
//             </Button>
//           </Box>

//           {isProcessing && (
//             <Box sx={{ mt: 2 }}>
//               <CircularProgress />
//             </Box>
//           )}

//           {showResult && (
//             <Box sx={{ mt: 3 }}>
//               <Typography variant="h6">Crowd Counting in Progress...</Typography>
//               {/* <img
//                 src="http://localhost:5000/api/crowd-count/video_feed"
//                 alt="Crowd Count"
//                 width="100%"
//                 style={{ borderRadius: '8px' }}
//               /> */}
//               <video width="100%" controls autoPlay style={{ borderRadius: '8px' }}>
//       <source src="http://localhost:5000/api/crowd-count/video_feed" type="video/mp4" />
//       Your browser does not support the video tag.
//     </video>
//             </Box>
//           )}
//         </Box>
//       </Container>
//     </div>
//   );
// };

// export default CrowdCountingPage;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const CrowdCountingPage = () => {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
    setShowResult(false); // Reset result if user selects a new file
  };


  const handleUpload = async () => {
    if (!videoFile) return;
  
    const formData = new FormData();
    formData.append('video', videoFile);
  
    setIsProcessing(true);
    setShowResult(false);
    setIsStreaming(false);
  
    try {
      const response = await fetch('http://localhost:5000/api/crowd-count/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        setIsProcessing(false);
        setShowResult(true);
        setIsStreaming(true); // Start stream
      } else {
        alert('Upload failed');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('An error occurred');
      setIsProcessing(false);
    }
  };
  
  const handleStopStream = async () => {
    try {
      await fetch('http://localhost:5000/api/crowd-count/stop', {
        method: 'POST'
      });
      setIsStreaming(false);
      setShowResult(false);  // Optionally hide the video stream
    } catch (error) {
      console.error('Failed to stop stream:', error);
    }
  };
  

  return (
    <div className="bg-gray-100 min-h-screen pt-24 px-4">
      <Navbar />
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
        
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Crowd Counting</h1>
          <p className="text-gray-600">Upload a video to analyze crowd size using AI</p>
        </div>

        {/* File Upload */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full 
            file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            onClick={handleUpload}
            disabled={!videoFile || isProcessing}
            // className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition ${
            //   (!videoFile || isProcessing) && 'opacity-50 cursor-not-allowed'
            // }`}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition ${
              (!videoFile || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isProcessing ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>

        {/* Loading Spinner */}
        {isProcessing && (
          <div className="flex justify-center mt-4">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        )}

        {/* {showResult && (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
      Crowd Counting Stream
    </h2>
    <img
      src="http://localhost:5000/api/crowd-count/video_feed"
      alt="Live Crowd Detection Stream"
      className="w-full rounded-lg shadow-lg"
    />
  </div>
)} */}

{showResult && (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
      Crowd Counting Stream
    </h2>
    <img
      src={isStreaming ? "http://localhost:5000/api/crowd-count/video_feed" : ""}
      alt="Live Crowd Detection Stream"
      className="w-full rounded-lg shadow-lg"
    />
    <div className="flex justify-center mt-4">
      <button
        onClick={handleStopStream}
        disabled={!isStreaming}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full transition"
      >
        Stop Stream
      </button>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default CrowdCountingPage;
