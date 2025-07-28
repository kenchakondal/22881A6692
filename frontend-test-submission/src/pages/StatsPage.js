import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkIcon from '@mui/icons-material/Link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const StatsPage = () => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const loadLinks = () => {
      const storedLinks = JSON.parse(localStorage.getItem('shortLinks') || '[]');
      setLinks(storedLinks);
    };

    loadLinks();
    // Refresh data every 5 seconds to show real-time updates
    const interval = setInterval(loadLinks, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const isExpired = (expiresAt) => {
    return new Date() > new Date(expiresAt);
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
  const activeLinks = links.filter(link => !isExpired(link.expiresAt)).length;
  const expiredLinks = links.filter(link => isExpired(link.expiresAt)).length;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          URL Statistics
        </Typography>
        
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <LinkIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {links.length}
                </Typography>
                <Typography color="text.secondary">
                  Total URLs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <VisibilityIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {totalClicks}
                </Typography>
                <Typography color="text.secondary">
                  Total Clicks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <AccessTimeIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {activeLinks}
                </Typography>
                <Typography color="text.secondary">
                  Active Links
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <AccessTimeIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" component="div">
                  {expiredLinks}
                </Typography>
                <Typography color="text.secondary">
                  Expired Links
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Links List */}
        {links.length > 0 ? (
          <Box>
            {links.map((link, index) => (
              <Accordion key={link.shortcode} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mr: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div">
                        /{link.shortcode}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {link.longUrl}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip 
                        label={`${link.clicks} clicks`} 
                        color="primary" 
                        size="small" 
                      />
                      <Chip 
                        label={isExpired(link.expiresAt) ? 'Expired' : 'Active'} 
                        color={isExpired(link.expiresAt) ? 'error' : 'success'} 
                        size="small" 
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Link Details
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Short URL:
                            </Typography>
                            <Button 
                              variant="text" 
                              onClick={() => copyToClipboard(`${window.location.origin}/${link.shortcode}`)}
                              sx={{ textTransform: 'none', p: 0, justifyContent: 'flex-start' }}
                            >
                              {window.location.origin}/{link.shortcode}
                            </Button>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Original URL:
                            </Typography>
                            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                              {link.longUrl}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Created:
                            </Typography>
                            <Typography variant="body2">
                              {formatDate(link.createdAt)}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Expires:
                            </Typography>
                            <Typography variant="body2">
                              {formatDate(link.expiresAt)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Status:
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color={isExpired(link.expiresAt) ? 'error' : 'success'}
                            >
                              {getTimeRemaining(link.expiresAt)}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Click Analytics
                          </Typography>
                          <Typography variant="h4" color="primary" gutterBottom>
                            {link.clicks}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Total Clicks
                          </Typography>
                          
                          {link.clickDetails && link.clickDetails.length > 0 ? (
                            <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Timestamp</TableCell>
                                    <TableCell>Source</TableCell>
                                    <TableCell>Location</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {link.clickDetails.slice(-5).map((click, clickIndex) => (
                                    <TableRow key={clickIndex}>
                                      <TableCell>
                                        {formatDate(click.timestamp)}
                                      </TableCell>
                                      <TableCell>{click.source}</TableCell>
                                      <TableCell>{click.location}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                              No clicks yet
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <LinkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No URLs shortened yet
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Start by creating your first short URL
              </Typography>
              <Button 
                component={Link} 
                to="/" 
                variant="contained" 
                size="large"
                sx={{ mt: 2 }}
              >
                Create Short URL
              </Button>
            </CardContent>
          </Card>
        )}

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button 
            component={Link} 
            to="/" 
            variant="outlined" 
            size="large"
          >
            Back to Shortener
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default StatsPage; 