import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Alert,
  Snackbar 
} from '@mui/material';
import { Link } from 'react-router-dom';
import Log from '../middleware/logger';

const ShortenerPage = () => {
  const [urls, setUrls] = useState([
    { longUrl: '', validity: 30, customShortcode: '', result: null },
    { longUrl: '', validity: 30, customShortcode: '', result: null },
    { longUrl: '', validity: 30, customShortcode: '', result: null },
    { longUrl: '', validity: 30, customShortcode: '', result: null },
    { longUrl: '', validity: 30, customShortcode: '', result: null }
  ]);
  
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const generateShortcode = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isShortcodeUnique = (shortcode) => {
    const existingLinks = JSON.parse(localStorage.getItem('shortLinks') || '[]');
    return !existingLinks.some(link => link.shortcode === shortcode);
  };

  const handleUrlChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const handleShorten = (index) => {
    const url = urls[index];
    
    if (!url.longUrl) {
      Log('error', 'component', `User tried to shorten an empty URL at index ${index}.`);
      setNotification({ open: true, message: 'Please enter a URL', severity: 'error' });
      return;
    }

    if (!isValidUrl(url.longUrl)) {
      Log('error', 'component', `Invalid URL provided: ${url.longUrl}`);
      setNotification({ open: true, message: 'Please enter a valid URL', severity: 'error' });
      return;
    }

    let shortcode = url.customShortcode || generateShortcode();
    
    // Ensure uniqueness
    while (!isShortcodeUnique(shortcode)) {
      shortcode = generateShortcode();
    }

    const now = new Date();
    const expiryTime = new Date(now.getTime() + (url.validity * 60 * 1000));
    
    const shortLink = {
      shortcode,
      longUrl: url.longUrl,
      createdAt: now.toISOString(),
      expiresAt: expiryTime.toISOString(),
      clicks: 0,
      clickDetails: []
    };

    // Save to localStorage
    const existingLinks = JSON.parse(localStorage.getItem('shortLinks') || '[]');
    existingLinks.push(shortLink);
    localStorage.setItem('shortLinks', JSON.stringify(existingLinks));

    // Update state with result
    const newUrls = [...urls];
    newUrls[index].result = `${window.location.origin}/${shortcode}`;
    setUrls(newUrls);

    Log('info', 'component', `Successfully shortened URL: ${url.longUrl} to ${shortcode}`);
    setNotification({ open: true, message: 'URL shortened successfully!', severity: 'success' });
  };

  const handleShortenAll = () => {
    let shortenedCount = 0;
    urls.forEach((url, index) => {
      if (url.longUrl && !url.result) {
        handleShorten(index);
        shortenedCount++;
      }
    });
    
    if (shortenedCount === 0) {
      setNotification({ open: true, message: 'No valid URLs to shorten', severity: 'warning' });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setNotification({ open: true, message: 'Copied to clipboard!', severity: 'info' });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          URL Shortener
        </Typography>
        <Typography variant="h6" component="p" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
          Shorten up to 5 URLs concurrently
        </Typography>

        <Grid container spacing={3}>
          {urls.map((url, index) => (
            <Grid item xs={12} key={index}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    URL #{index + 1}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Enter Long URL"
                        variant="outlined"
                        value={url.longUrl}
                        onChange={(e) => handleUrlChange(index, 'longUrl', e.target.value)}
                        placeholder="https://example.com/very-long-url"
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        label="Validity (minutes)"
                        type="number"
                        variant="outlined"
                        value={url.validity}
                        onChange={(e) => handleUrlChange(index, 'validity', parseInt(e.target.value) || 30)}
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        label="Custom Shortcode"
                        variant="outlined"
                        value={url.customShortcode}
                        onChange={(e) => handleUrlChange(index, 'customShortcode', e.target.value)}
                        placeholder="optional"
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Button 
                        fullWidth
                        variant="contained" 
                        onClick={() => handleShorten(index)}
                        disabled={!url.longUrl || !!url.result}
                        sx={{ height: '56px' }}
                      >
                        Shorten
                      </Button>
                    </Grid>
                  </Grid>
                  
                  {url.result && (
                    <Box sx={{ mt: 2 }}>
                      <Alert severity="success">
                        <Typography variant="body2">
                          Short URL: 
                          <Button 
                            variant="text" 
                            onClick={() => copyToClipboard(url.result)}
                            sx={{ ml: 1, textTransform: 'none' }}
                          >
                            {url.result}
                          </Button>
                        </Typography>
                      </Alert>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={handleShortenAll}
          >
            Shorten All URLs
          </Button>
          <Button 
            component={Link} 
            to="/stats" 
            variant="outlined" 
            size="large"
          >
            View Statistics
          </Button>
        </Box>

        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          <Alert severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ShortenerPage; 