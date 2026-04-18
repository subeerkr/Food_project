import React, { useEffect, useRef } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChatBot from './ChatBot';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import '../index.css';

const featuredItems = [
  {
    id: 1,
    name: 'Butter Chicken',
    description: 'Tender chicken in rich, creamy tomato sauce',
    image: "/images/butter_chicken.jpg",
    price: '₹1200',
    category: 'main-course'
  },
  {
    id: 2,
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese marinated in spiced yogurt',
    image: "/images/paneer-tikka.jpg",
    price: '₹800',
    category: 'main-course'
  },
  {
    id: 3,
    name: 'Biryani',
    description: 'Fragrant basmati rice cooked with aromatic spices',
    image: "/images/Veg_biriyani.jpg",
    price: '₹950',
    category: 'main-course'
  }
];

const locations = [
  {
    id: 1,
    name: 'DOWNTOWN',
    address: '123 Main Street',
    city: 'City, State 12345',
    phone: '(123) 456-7890',
    hours: 'Mon-Sun 11am-10pm'
  },
  {
    id: 2,
    name: 'RIVERFRONT',
    address: '456 River Road',
    city: 'City, State 12345',
    phone: '(123) 456-7891',
    hours: 'Mon-Sun 11am-10pm'
  },
  {
    id: 3,
    name: 'HILLSIDE',
    address: '789 Mountain View',
    city: 'City, State 12345',
    phone: '(123) 456-7892',
    hours: 'Mon-Sun 11am-10pm'
  }
];

const Home = () => {
  const navigate = useNavigate();
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <Box sx={{ backgroundColor: '#000', color: '#fff', py: 1, textAlign: 'center', zIndex: 2 }}>
        <Typography variant="body2">NOW OPEN IN NEW LOCATION - COME VISIT US!</Typography>
      </Box>

      <Box className="video-container" sx={{ position: 'relative' }}>
        <Box className="video-overlay">
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src="/videos/Cinematic.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>

        <Container className="video-content" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h2" component="h1" gutterBottom className="flowing-text"
            sx={{
              color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', fontWeight: 'bold',
              fontSize: { xs: '2.5rem', md: '4rem' }, lineHeight: 1.2
            }}>
            <span>EXCEPTIONAL</span> <span>DINING</span> <span>EXPERIENCE</span>
          </Typography>
          <Typography variant="h5" gutterBottom className="flowing-text"
            sx={{
              color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.5)', mb: 4,
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}>
            <span>Discover our carefully crafted menu featuring the finest ingredients and innovative flavors</span>
          </Typography>
          <Button variant="contained" color="secondary" size="large" className="flowing-text"
            sx={{
              mt: 2, backgroundColor: '#d4af37', color: '#000',
              '&:hover': { backgroundColor: '#000', color: '#fff' },
              borderRadius: '30px', px: 4, py: 1.5, fontSize: '1.1rem', textTransform: 'none'
            }}
            onClick={() => navigate('/menu/appetizers')}>
            <span>VIEW OUR MENU</span>
          </Button>
        </Container>
      </Box>

      <Box sx={{ bgcolor: '#fff', py: 8 }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{
                position: 'relative', height: '350px', width: '80%', margin: '0 auto',
                overflow: 'hidden', borderRadius: '8px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                '&:hover img': { transform: 'scale(1.05)' }
              }}>
                <img src="/images/inside_old.jpg" alt="Restaurant Interior"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h2" gutterBottom sx={{
                fontWeight: 900, fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 3, fontFamily: "'Brush Script MT', cursive", color: '#000'
              }}>
                STEAK HAPPENS, <br /> FRITES FOLLOW
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: '#333' }}>
                Discover <strong>SWAGAT FOODS</strong>, the newest addition to the city's dining scene.
                As a <strong>premium restaurant</strong> specializing in authentic Indian cuisine, we provide a
                <strong> unique experience</strong> with an incredible ambiance.
              </Typography>
              <Typography variant="body1" sx={{ color: '#333' }}>
                Ideal for a business lunch or a casual gathering with friends and family,
                <strong> SWAGAT FOODS</strong> pairs <strong>exceptional cuisine</strong> with stunning flavors.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ bgcolor: '#fff', py: 8 }}>
        <Container>
          <Typography variant="h3" gutterBottom textAlign="center" sx={{ mb: 4, fontWeight: 'bold' }}>
            FEATURED MENU ITEMS
          </Typography>
          <Grid container spacing={3}>
            {featuredItems.map((item) => (
              <Grid item key={item.id} xs={12} sm={6} md={4}>
                <Card className="card-hover" sx={{ textAlign: 'center' }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={item.image}
                    alt={item.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>{item.description}</Typography>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#d4af37' }}>
                      {item.price}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/menu/${item.category}`)}
                      sx={{
                        backgroundColor: '#d4af37', color: '#000',
                        '&:hover': { backgroundColor: '#000', color: '#fff' },
                        py: 1, textTransform: 'none', fontSize: '1rem'
                      }}>
                      Order Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ bgcolor: '#f8f8f8', py: 8 }}>
        <Container>
          <Typography variant="h3" gutterBottom textAlign="center" sx={{ mb: 4 }}>
            OUR LOCATIONS
          </Typography>
          <Grid container spacing={4}>
            {locations.map((location) => (
              <Grid item key={location.id} xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: '#d4af37' }}>{location.name}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 1 }}>
                    <LocationOnIcon /> {location.address}
                  </Box>
                  <Typography>{location.city}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 1 }}>
                    <PhoneIcon /> {location.phone}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <AccessTimeIcon /> {location.hours}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ bgcolor: '#222', color: '#fff', py: 8 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: '#d4af37' }}>CONTACT US</Typography>
              <Typography>Email: info@restaurant.com</Typography>
              <Typography>Phone: (123) 456-7890</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: '#d4af37' }}>QUICK LINKS</Typography>
              <Typography>Careers</Typography>
              <Typography>Gift Cards</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: '#d4af37' }}>FOLLOW US</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FacebookIcon /> <InstagramIcon /> <TwitterIcon /> <YouTubeIcon />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <ChatBot />
    </Box>
  );
};

export default Home;
