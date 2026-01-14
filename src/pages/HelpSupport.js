import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper,
  Divider,
  Avatar
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ContactSupport as ContactSupportIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon,
  Description as DescriptionIcon,
  VideoLibrary as VideoIcon,
  School as SchoolIcon,
  BugReport as BugReportIcon,
  Feedback as FeedbackIcon,
  Star as StarIcon,
  Security as SecurityIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

const HelpSupport = () => {
  const [expanded, setExpanded] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      question: 'How do I create a new reservation?',
      answer: 'Navigate to the "New Reservation" page, fill in customer details, select date/time, choose a table, and confirm.'
    },
    {
      question: 'Can I modify existing reservations?',
      answer: 'Yes, go to the Reservations page, find the reservation, and use the edit or cancel options.'
    },
    {
      question: 'How do I add new staff members?',
      answer: 'Only admins can add staff. Go to Staff Management page and click "Add Staff".'
    },
    {
      question: 'How are tables assigned?',
      answer: 'Tables are assigned based on availability, party size, and customer preferences.'
    },
    {
      question: 'Can I export reservation data?',
      answer: 'Yes, go to System Settings > Backup & Export to export reservation data.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Support request submitted! We will contact you within 24 hours.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <Box className="fade-in">
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        🆘 Help & Support
      </Typography>

      {/* Quick Support Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            className="card-cinematic"
            sx={{ 
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { transform: 'translateY(-5px)' }
            }}
          >
            <CardContent>
              <Avatar sx={{ 
                bgcolor: 'rgba(138, 43, 226, 0.2)',
                color: '#8a2be2',
                width: 60,
                height: 60,
                margin: '0 auto 20px'
              }}>
                <ChatIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Live Chat
              </Typography>
              <Typography variant="body2" color="textSecondary">
                24/7 Support Available
              </Typography>
              <Chip label="Online" color="success" size="small" sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            className="card-cinematic"
            sx={{ 
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { transform: 'translateY(-5px)' }
            }}
          >
            <CardContent>
              <Avatar sx={{ 
                bgcolor: 'rgba(0, 255, 255, 0.2)',
                color: '#00ffff',
                width: 60,
                height: 60,
                margin: '0 auto 20px'
              }}>
                <PhoneIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Phone Support
              </Typography>
              <Typography variant="body2" color="textSecondary">
                +1 (800) 123-4567
              </Typography>
              <Chip label="Mon-Fri 9AM-6PM" className="chip-cyan" size="small" sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            className="card-cinematic"
            sx={{ 
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { transform: 'translateY(-5px)' }
            }}
          >
            <CardContent>
              <Avatar sx={{ 
                bgcolor: 'rgba(255, 0, 255, 0.2)',
                color: '#ff00ff',
                width: 60,
                height: 60,
                margin: '0 auto 20px'
              }}>
                <EmailIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Email Support
              </Typography>
              <Typography variant="body2" color="textSecondary">
                support@restaurantpro.com
              </Typography>
              <Chip label="24/7" className="chip-pink" size="small" sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            className="card-cinematic"
            sx={{ 
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { transform: 'translateY(-5px)' }
            }}
          >
            <CardContent>
              <Avatar sx={{ 
                bgcolor: 'rgba(255, 215, 0, 0.2)',
                color: '#ffd700',
                width: 60,
                height: 60,
                margin: '0 auto 20px'
              }}>
                <VideoIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Video Tutorials
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Step-by-step guides
              </Typography>
              <Chip label="15+ Videos" className="chip-gold" size="small" sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* FAQs */}
        <Grid item xs={12} md={6}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ContactSupportIcon /> Frequently Asked Questions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {faqs.map((faq, index) => (
                  <Accordion
                    key={index}
                    expanded={expanded === index}
                    onChange={() => setExpanded(expanded === index ? false : index)}
                    sx={{
                      background: 'rgba(26, 26, 46, 0.5)',
                      border: '1px solid rgba(138, 43, 226, 0.3)',
                      borderRadius: '10px !important',
                      mb: 1
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600 }}>{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="textSecondary">
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={6}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FeedbackIcon /> Contact Support Team
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      multiline
                      rows={4}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      className="btn-cinematic"
                      sx={{ py: 1.5 }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
              
              <Divider sx={{ my: 3 }} className="divider-purple" />
              
              <Typography variant="body2" color="textSecondary" align="center">
                Average response time: <strong>2 hours</strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Documentation & Resources */}
        <Grid item xs={12}>
          <Card className="card-cinematic">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon /> Learning Resources
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      background: 'rgba(138, 43, 226, 0.1)',
                      border: '1px solid rgba(138, 43, 226, 0.3)',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      '&:hover': { background: 'rgba(138, 43, 226, 0.2)' }
                    }}
                  >
                    <DescriptionIcon sx={{ fontSize: 40, color: '#8a2be2', mb: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      User Manual
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Complete guide
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      background: 'rgba(0, 255, 255, 0.1)',
                      border: '1px solid rgba(0, 255, 255, 0.3)',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      '&:hover': { background: 'rgba(0, 255, 255, 0.2)' }
                    }}
                  >
                    <VideoIcon sx={{ fontSize: 40, color: '#00ffff', mb: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Video Tutorials
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Watch & learn
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      background: 'rgba(255, 0, 255, 0.1)',
                      border: '1px solid rgba(255, 0, 255, 0.3)',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      '&:hover': { background: 'rgba(255, 0, 255, 0.2)' }
                    }}
                  >
                    <SecurityIcon sx={{ fontSize: 40, color: '#ff00ff', mb: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Security Guide
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Best practices
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      background: 'rgba(255, 215, 0, 0.1)',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      '&:hover': { background: 'rgba(255, 215, 0, 0.2)' }
                    }}
                  >
                    <BugReportIcon sx={{ fontSize: 40, color: '#ffd700', mb: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Bug Reporting
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Report issues
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HelpSupport;