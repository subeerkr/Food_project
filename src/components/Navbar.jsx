import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  ListItemSecondaryAction,
  IconButton as MuiIconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    handleMobileMenuClose();
  };

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleCartClose = () => {
    setCartOpen(false);
  };

  const handleMobileMenuOpen = () => {
    setMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { name: 'Appetizers', category: 'appetizers' },
    { name: 'Main Course', category: 'main-course' },
    { name: 'Desserts', category: 'desserts' },
    { name: 'Beverages', category: 'beverages' },
  ];

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'rgba(255, 111, 0, 0.95)' }}>
        <Toolbar>
          {/* Mobile Menu Button */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { sm: 'none' } }}
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <RestaurantIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              Swagat Foods
            </Typography>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Button color="inherit" onClick={() => navigate('/')}>
              Home
            </Button>
            <Button
              color="inherit"
              onClick={handleMenuClick}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Menu
            </Button>
            
            {user ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                  <AccountCircleIcon sx={{ mr: 0.5 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {user.displayName}
                  </Typography>
                </Box>
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button color="inherit" onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </>
            )}
          </Box>

          {/* Cart Icon */}
          <IconButton color="inherit" onClick={handleCartOpen}>
            <Badge badgeContent={cartItems.length} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            '& .MuiMenuItem-root': {
              px: 3,
              py: 1.5,
            },
          },
        }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.category}
            onClick={() => {
              handleMenuClose();
              navigate(`/menu/${item.category}`);
            }}
          >
            {item.name}
          </MenuItem>
        ))}
      </Menu>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: {
            width: 240,
            backgroundColor: 'rgba(255, 111, 0, 0.95)',
            color: 'white',
          },
        }}
      >
        <List>
          {user && (
            <ListItem sx={{ py: 3, backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <ListItemIcon>
                <AccountCircleIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText 
                primary={user.displayName} 
                secondary={user.email} 
                secondaryTypographyProps={{ style: { color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' } }}
              />
            </ListItem>
          )}
          <ListItem button onClick={() => { navigate('/'); handleMobileMenuClose(); }}>
            <ListItemIcon>
              <HomeIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={handleMenuClick}>
            <ListItemIcon>
              <MenuIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Menu" />
            <KeyboardArrowDownIcon sx={{ color: 'white' }} />
          </ListItem>
          
          {!user ? (
            <>
              <ListItem button onClick={() => { navigate('/login'); handleMobileMenuClose(); }}>
                <ListItemIcon>
                  <LoginIcon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem button onClick={() => { navigate('/signup'); handleMobileMenuClose(); }}>
                <ListItemIcon>
                  <PersonAddIcon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Sign Up" />
              </ListItem>
            </>
          ) : (
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          )}
        </List>
      </Drawer>

      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={handleCartClose}
        PaperProps={{
          sx: {
            width: 350,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your Cart
          </Typography>
          <Divider />
          {cartItems.length === 0 ? (
            <Typography sx={{ mt: 2, textAlign: 'center' }}>
              Your cart is empty
            </Typography>
          ) : (
            <List>
              {cartItems.map((item) => (
                <ListItem key={item.id}>
                  <ListItemText
                    primary={item.name}
                    secondary={`$${item.price} x ${item.quantity}`}
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MuiIconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <RemoveIcon />
                      </MuiIconButton>
                      <Typography>{item.quantity}</Typography>
                      <MuiIconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <AddIcon />
                      </MuiIconButton>
                      <MuiIconButton
                        size="small"
                        color="error"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <DeleteIcon />
                      </MuiIconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              Total: ${getCartTotal().toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              disabled={cartItems.length === 0}
              onClick={() => navigate('/checkout')}
            >
              Checkout
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar; 