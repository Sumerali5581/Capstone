import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/dashboard-data', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error:', error);
      if (error.message.includes('Token is invalid')) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    
    // Force a reload and redirect to login
    window.location.href = '/login';
    // Or alternatively:
    // navigate('/login');
    // window.location.reload();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleLogout}
          sx={{ mb: 3 }}
        >
          Logout
        </Button>
        {dashboardData && (
          <Typography>
            {/* Display your dashboard data here */}
            Welcome to your dashboard!
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default DashboardPage;
