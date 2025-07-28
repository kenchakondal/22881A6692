import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ShortenerPage from './pages/ShortenerPage';
import StatsPage from './pages/StatsPage';
import Log from '../Logging Middleware/logger';

// Create a modern theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// This component will handle the redirection logic
const RedirectHandler = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    const links = JSON.parse(localStorage.getItem('shortLinks') || '[]');
    const link = links.find(l => l.shortcode === shortcode);

    if (link) {
      // Check if link is expired
      const now = new Date();
      const expiryTime = new Date(link.expiresAt);
      
      if (now > expiryTime) {
        Log('error', 'redirect', `Shortcode ${shortcode} has expired`);
        navigate('/');
        return;
      }

      // Log the click event
      Log('info', 'redirect', `Redirecting shortcode ${shortcode} to ${link.longUrl}`);
      
      // Update click count and details
      const updatedLinks = links.map(l => {
        if (l.shortcode === shortcode) {
          const clickDetail = {
            timestamp: new Date().toISOString(),
            source: document.referrer || 'Direct',
            location: window.location.hostname
          };
          
          return {
            ...l,
            clicks: l.clicks + 1,
            clickDetails: [...(l.clickDetails || []), clickDetail]
          };
        }
        return l;
      });
      
      localStorage.setItem('shortLinks', JSON.stringify(updatedLinks));
      
      // Redirect to the original URL
      window.location.href = link.longUrl;
    } else {
      Log('error', 'redirect', `Shortcode not found: ${shortcode}`);
      navigate('/');
    }
  }, [shortcode, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px'
    }}>
      Redirecting...
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/:shortcode" element={<RedirectHandler />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
