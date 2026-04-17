import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import QrCodeIcon from '@mui/icons-material/QrCode';

const steps = ['Order Summary', 'Delivery Details', 'Payment'];

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);
    console.log("Step 1: Preparing order data...");
    
    try {
      const orderData = {
        customerDetails: formData,
        paymentMethod: paymentMethod,
        items: cartItems.map(item => ({
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity || 1
        })),
        totalAmount: (getCartTotal() + 2.99 + getCartTotal() * 0.1).toFixed(2),
        status: 'Pending',
        createdAt: serverTimestamp()
      };

      console.log("Step 2: Attempting to save to Firestore...", orderData);
      
      // Attempting to write to the 'orders' collection
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      console.log("Step 3: Order successfully saved with ID:", docRef.id);
      
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error("FIREBASE ERROR:", error);
      alert(`Order Failed! Technical details: ${error.message}. 
      
Please make sure you have "Created a Firestore Database" in your Firebase console!`);
    } finally {
      setLoading(false);
      console.log("Step 4: Cleanup completed.");
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <List>
              {cartItems.map((item) => (
                <ListItem key={item.id}>
                  <ListItemText
                    primary={item.name}
                    secondary={`$${item.price} x ${item.quantity || 1}`}
                  />
                  <Typography>
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Subtotal</Typography>
              <Typography>${getCartTotal().toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Delivery Fee</Typography>
              <Typography>$2.99</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Tax (10%)</Typography>
              <Typography>${(getCartTotal() * 0.1).toFixed(2)}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5">Total</Typography>
              <Typography variant="h5">
                ${(getCartTotal() + 2.99 + getCartTotal() * 0.1).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Delivery Details
            </Typography>
            <Grid container spacing={2}>
              {['name', 'email', 'phone', 'address', 'city', 'state', 'zipCode'].map((field) => (
                <Grid item xs={12} sm={field === 'city' || field === 'state' ? 6 : 12} key={field}>
                  <TextField
                    required
                    fullWidth
                    label={field.replace(/^\w/, (c) => c.toUpperCase())}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    multiline={field === 'address'}
                    rows={field === 'address' ? 3 : 1}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CreditCardIcon /> Credit/Debit Card
                    </Box>
                  }
                />
                <FormControlLabel
                  value="upi"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <QrCodeIcon /> UPI
                    </Box>
                  }
                />
                <FormControlLabel
                  value="netbanking"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountBalanceIcon /> Net Banking
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  if (orderPlaced) {
    return (
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom color="primary">
            Order Placed Successfully!
          </Typography>
          <Typography variant="body1" paragraph>
            Thank you for your order. We'll send you a confirmation email shortly.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handlePlaceOrder}
              disabled={!paymentMethod || loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Checkout;
