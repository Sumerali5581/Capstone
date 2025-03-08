import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Link } from "@mui/material";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        mt: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // backgroundImage: "url('/path/to/your/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 2,
        boxShadow: 3,
        p: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
          border: "1px solid #ddd",
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ backgroundColor: "white" }}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ backgroundColor: "white" }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
          <Link href="#" variant="body2" sx={{ mt: 2, display: "block", textAlign: "center" }}>
            Forgot Password?
          </Link>
          <Link href="#" variant="body2" sx={{ mt: 1, display: "block", textAlign: "center" }}>
            Don't have an account? Sign Up
          </Link>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
