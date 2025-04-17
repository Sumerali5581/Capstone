// import React, { useEffect, useState } from 'react';
// import { Container, Typography, Box, Card, CardContent, CardActions, Button, Grid } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import Navbar from './Navbar';

// const DashboardPage = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:5000/api/dashboard-data', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           handleLogout();
//           return;
//         }
//         throw new Error('Failed to fetch dashboard data');
//       }

//       const data = await response.json();
//       setDashboardData(data);
//     } catch (error) {
//       console.error('Error:', error);
//       if (error.message.includes('Token is invalid')) {
//         handleLogout();
//       }
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     window.location.href = '/login';
//   };

//   return (
//     <div className="dashboard-page" style={{ backgroundColor: '#f0f0f0', minHeight: '100vh', width: '100vw' }}>
//       <Navbar />
//       <Container maxWidth="lg">
//         <Box sx={{ mt: 4 }}>
//           <Typography variant="h4" gutterBottom>
//             Dashboard
//           </Typography>
//           {dashboardData && (
//             <Typography variant="h6" gutterBottom>
//               Welcome to your dashboard!
//             </Typography>
//           )}
//           <Grid container spacing={3} sx={{ mt: 2 }}>
//             {/* Crowd Counting Card */}
//             <Grid item xs={12} sm={6}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h5" component="div">
//                     Crowd Counting
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Access the crowd counting module using AI-based surveillance.
//                   </Typography>
//                 </CardContent>
//                 <CardActions>
//                   <Button size="small" onClick={() => navigate('/crowd-counting')}>
//                     Go to Crowd Counting
//                   </Button>
//                 </CardActions>
//               </Card>
//             </Grid>

//             {/* Criminal Detection Card */}
//             <Grid item xs={12} sm={6}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h5" component="div">
//                     Criminal Detection
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Navigate to the criminal detection component to monitor suspicious activities.
//                   </Typography>
//                 </CardContent>
//                 <CardActions>
//                   <Button size="small" onClick={() => navigate('/criminal-detection')}>
//                     Go to Criminal Detection
//                   </Button>
//                 </CardActions>
//               </Card>
//             </Grid>
//           </Grid>
//         </Box>
//       </Container>
//     </div>
//   );
// };

// export default DashboardPage;

import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page" style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Grid container spacing={4} mt={2}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="h5">Crowd Counting</Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/crowd-counting')}>
                    Go to Crowd Counting
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="h5">Criminal Detection</Typography>
                  <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={() => navigate('/criminal-detection')}>
                    Go to Criminal Detection
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default DashboardPage;
