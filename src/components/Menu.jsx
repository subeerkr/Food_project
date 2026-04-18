import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useCart } from "../context/CartContext";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const Menu = () => {
  const { category } = useParams();
  const validCategory = category || "starters";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, "foodItems"),
      where("category", "==", validCategory),
    );

    const unsubscribe = onSnapshot(
      q,
      querySnapshot => {
        const foodData = [];
        querySnapshot.forEach(doc => {
          foodData.push({ id: doc.id, ...doc.data() });
        });
        setItems(foodData);
        setLoading(false);
      },
      error => {
        console.error("Error fetching menu:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [validCategory]);

  const handleAddToCart = item => {
    addToCart(item);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ textTransform: "capitalize", mb: 4 }}
      >
        {validCategory.replace("-", " ")}
      </Typography>

      <Grid container spacing={4}>
        {items.map(item => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {item.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Typography variant="h6" color="primary">
                    ₹{item.price}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {items.length === 0 && (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          No items available in this category.
        </Typography>
      )}
    </Container>
  );
};

export default Menu;
