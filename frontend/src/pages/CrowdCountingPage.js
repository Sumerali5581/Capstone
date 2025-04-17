import React, { useState } from 'react';
import { Box, Typography, Container, Button, CircularProgress, Input } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const CrowdCountingPage = () => {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);

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

    try {
      const response = await fetch('http://localhost:5000/api/crowd-count/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setIsProcessing(false);
        setShowResult(true);
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

  return (
    <div style={{ backgroundColor: '#f8f8f8', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Crowd Counting
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Upload a video to analyze crowd size using AI
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disableUnderline
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={!videoFile || isProcessing}
              onClick={handleUpload}
            >
              Upload Video
            </Button>
          </Box>

          {isProcessing && (
            <Box sx={{ mt: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {showResult && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Crowd Counting in Progress...</Typography>
              {/* <img
                src="http://localhost:5000/api/crowd-count/video_feed"
                alt="Crowd Count"
                width="100%"
                style={{ borderRadius: '8px' }}
              /> */}
              <video width="100%" controls autoPlay style={{ borderRadius: '8px' }}>
      <source src="http://localhost:5000/api/crowd-count/video_feed" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
            </Box>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default CrowdCountingPage;
