import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import LoginForm from './pages/LoginForm';
import CriminalDetection from './pages/CriminalDetection';
import CrowdCountingPage from './pages/CrowdCountingPage';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/check-auth', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem('token');
    }
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
      
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginForm />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />

        <Route
          path='/crowd-counting'
          element={isAuthenticated ? <CrowdCountingPage/> : <Navigate to="/login" />}
        />

        <Route
          path='/criminal-detection'
          element={isAuthenticated ? <CriminalDetection/> : <Navigate to="/login" />}
        />

        {/* <Route
          path='/dummy'
          element={<CriminalDetection />}
        /> */}

        <Route 
          path="/about" 
          element={isAuthenticated ? <About /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/contact" 
          element={isAuthenticated ? <Contact /> : <Navigate to="/login" />} 
        />

        

    //   </Routes>
    // </Router>
    // <Router>
    //   <Routes>
      
    //     {/* <Route 
    //       path="/login" 
    //       element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginForm />} 
    //     /> */}
    //     <Route 
    //       path="/dashboard" 
    //       element={<DashboardPage />} 
    //     />
    //     <Route 
    //       path="/" 
    //       element={<Navigate to={ "/dashboard"} />} 
    //     />

    //     <Route
    //       path='/crowd-counting'
    //       element={<CrowdCountingPage />}
    //     />

    //     <Route
    //       path='/criminal-detection'
    //       element={<CriminalDetection/>}
    //     />

    //     <Route
    //       path='/dummy'
    //       element={<CriminalDetection />}
    //     />

    //     <Route 
    //       path="/about" 
    //       element={<About />} 
    //     />

    //     <Route 
    //       path="/contact" 
    //       element={ <Contact />} 
    //     />

        

    //   </Routes>
    // </Router>

  );
  
}

export default App;
