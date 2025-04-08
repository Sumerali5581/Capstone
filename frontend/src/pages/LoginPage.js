import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, TextField, Button, Typography, Box, 
  Link, Alert, Tabs, Tab, Paper, CircularProgress 
} from "@mui/material";

const LoginPage = () => {
  //const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [email, setEmail] = useState("");
  //const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);  // New loading state
  const navigate = useNavigate();

  const handleMethodChange = (event, newValue) => {
    //setLoginMethod(newValue);
    setError("");
    setMessage("");
    setOtpSent(false);
    setIsLoading(false);  // Reset loading state
  };

  const handleRequestOtp = async () => {
    try {
      setIsLoading(true);  // Start loading
      setMessage('Sending OTP...');  // Show sending message
      setError('');

      const response = await fetch('http://localhost:5000/api/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setOtpSent(true);
        setMessage('OTP sent to your email');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);  // Stop loading regardless of outcome
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  // const handlePasswordLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch('http://localhost:5000/api/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await response.json();
  //     console.log('Login response:', data); // Debug log
      
  //     if (response.ok && data.token) {
  //       // Store the token in localStorage
  //       localStorage.setItem('token', data.token);
  //       console.log('Token stored, redirecting...'); // Debug log
        
  //       // // Force a reload to update authentication state
  //       // //window.location.href = '/dashboard';
  //       // // Or alternatively:
  //       // navigate('/dashboard');
  //       // // window.location.reload();
  //       setTimeout(() => {
  //         navigate('/dashboard');
  //         window.location.reload();  // Ensures re-render
  //       }, 100);
  //     } else {
  //       setError(data.error || 'Login failed');
  //     }
  //   } catch (err) {
  //     console.error('Login error:', err); // Debug log
  //     setError('Network error occurred');
  //   }
  // };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Login
        </Typography>
        
        {/* <Tabs
          value={loginMethod}
          onChange={handleMethodChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab value="password" label="Password" />
          <Tab value="otp" label="OTP" />
        </Tabs> */}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {message && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Box> 
          {/* component="form" onSubmit={handlePasswordLogin}> */}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* {loginMethod === 'password' ? (
            <>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Login with Password
              </Button>
            </>
          ) : ( */}
          {(
            <>
              {!otpSent ? (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleRequestOtp}
                  disabled={isLoading}  // Disable button while loading
                >
                  {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                      Sending OTP...
                    </Box>
                  ) : (
                    'Request OTP'
                  )}
                </Button>
              ) : (
                <>
                  <TextField
                    label="Enter OTP"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </Button>
                </>
              )}
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
