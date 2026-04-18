import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { db } from '../firebase';
import imagekit from '../imagekit';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

const CATEGORIES = ['appetizers', 'main-course', 'desserts', 'beverages'];

const OrderRow = ({ order }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{order.customerDetails?.name}</TableCell>
        <TableCell>{order.customerDetails?.email}</TableCell>
        <TableCell>₹{order.totalAmount}</TableCell>
        <TableCell>{order.paymentMethod?.toUpperCase()}</TableCell>
        <TableCell>
          <Chip 
            label={order.status} 
            color={order.status === 'Pending' ? 'warning' : 'success'} 
            size="small" 
          />
        </TableCell>
        <TableCell>
          {order.createdAt?.toDate().toLocaleString() || 'N/A'}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Address:</strong> {order.customerDetails?.address}, {order.customerDetails?.city}, {order.customerDetails?.state} - {order.customerDetails?.zipCode}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Phone:</strong> {order.customerDetails?.phone}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <List size="small">
                {order.items?.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={item.name} 
                      secondary={`Quantity: ${item.quantity} | Price: ₹${item.price}`} 
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const AdminPanel = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // Food Item Form State
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main-course',
    image: '',
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@food.com' && password === 'admin@test') {
      setIsAdmin(true);
      setError('');
    } else {
      setError('Invalid admin credentials');
    }
  };

  useEffect(() => {
    if (isAdmin) {
      // Listen for orders
      const ordersQ = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const unsubscribeOrders = onSnapshot(ordersQ, (querySnapshot) => {
        const ordersData = [];
        querySnapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() });
        });
        setOrders(ordersData);
      });

      // Listen for food items
      const foodQ = query(collection(db, 'foodItems'), orderBy('category'));
      const unsubscribeFood = onSnapshot(foodQ, (querySnapshot) => {
        const foodData = [];
        querySnapshot.forEach((doc) => {
          foodData.push({ id: doc.id, ...doc.data() });
        });
        setFoodItems(foodData);
      });

      return () => {
        unsubscribeOrders();
        unsubscribeFood();
      };
    }
  }, [isAdmin]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'main-course',
        image: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'main-course',
      image: '',
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    
    // Creating FormData for ImageKit API
    const formDataAPI = new FormData();
    formDataAPI.append('file', file);
    formDataAPI.append('fileName', `${Date.now()}_${file.name}`);
    formDataAPI.append('useUniqueFileName', 'true');

    try {
      // NOTE: Using private key on frontend is NOT recommended for production.
      // ImageKit recommends using an authentication endpoint.
      const privateKey = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY;
      const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(privateKey + ':')
        },
        body: formDataAPI
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setFormData(prev => ({ ...prev, image: result.url }));
    } catch (err) {
      console.error("Error uploading to ImageKit:", err);
      alert("Failed to upload image to ImageKit. Check your credentials in .env");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitFood = async (e) => {
    e.preventDefault();
    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        updatedAt: serverTimestamp(),
      };

      if (editingItem) {
        await updateDoc(doc(db, 'foodItems', editingItem.id), itemData);
      } else {
        await addDoc(collection(db, 'foodItems'), {
          ...itemData,
          createdAt: serverTimestamp(),
        });
      }
      handleCloseDialog();
    } catch (err) {
      console.error("Error saving food item:", err);
      alert("Failed to save food item");
    }
  };

  const handleDeleteFood = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, 'foodItems', id));
      } catch (err) {
        console.error("Error deleting food item:", err);
      }
    }
  };

  if (!isAdmin) {
    return (
      <Container maxWidth="xs" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Admin Login</Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Admin Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
            >
              Login as Admin
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button variant="outlined" onClick={() => setIsAdmin(false)}>Logout</Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Orders" />
          <Tab label="Manage Menu" />
        </Tabs>
      </Paper>

      {tabValue === 0 ? (
        <TableContainer component={Paper} elevation={3}>
          <Table aria-label="collapsible table">
            <TableHead sx={{ bgcolor: 'orange' }}>
              <TableRow>
                <TableCell />
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customer</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Payment</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography sx={{ py: 3 }}>No orders found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
              Add New Food Item
            </Button>
          </Box>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ bgcolor: 'orange' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Image</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {foodItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <img src={item.image} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{item.category}</TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(item)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteFood(item.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Food Item Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? 'Edit Food Item' : 'Add New Food Item'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Item Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Price (₹)"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              <TextField
                fullWidth
                select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat.replace('-', ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="raised-button-file">
                <Button variant="outlined" component="span" fullWidth disabled={uploading}>
                  {uploading ? <CircularProgress size={24} /> : 'Upload Image'}
                </Button>
              </label>
              {formData.image && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img src={formData.image} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitFood} variant="contained" disabled={uploading || !formData.image}>
            {editingItem ? 'Update' : 'Add'} Item
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPanel;
