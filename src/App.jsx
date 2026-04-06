import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Menu from './components/Menu';
import Login from './components/Login';
import Signup from './components/Signup';
import Checkout from './components/Checkout';
import { CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6f00',
    },
    secondary: {
      main: '#ff6f00',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Navbar />
            <Box
              sx={{
                pt: 8,
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                '& .home-page': {
                  background: 'none',
                },
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu/:category" element={<Menu />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/checkout" element={<Checkout />} />
                {/* fallback route if no match */}
                <Route
                  path="*"
                  element={
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <h2>404 - Page Not Found</h2>
                    </Box>
                  }
                />
              </Routes>
            </Box>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
