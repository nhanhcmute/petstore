import React from 'react';
import { Container, Grid, Typography, Card, CardContent, Button, IconButton, Box, TextField } from '@mui/material';
import { useCart } from '../../function/CartContext'; 
import DeleteIcon from '@mui/icons-material/Delete';

const CartPage = () => {
  const { cart, addToCart, updateCartQuantity, removeFromCart } = useCart(); // Truy cập giỏ hàng và các hàm từ CartContext

  const handleQuantityChange = (product, quantity) => {
    if (quantity > 0) {
      updateCartQuantity(product, quantity); // Cập nhật số lượng trong giỏ hàng
    }
  };

  const handleRemoveFromCart = (product) => {
    removeFromCart(product); // Xóa sản phẩm khỏi giỏ hàng
  };

  const calculateTotal = () => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  if (cart.length === 0) {
    return (
      <Container>
        <Typography variant="h6" align="center" sx={{ marginTop: '20px' }}>
          Giỏ hàng của bạn đang trống.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ paddingTop: '20px' }}>
      <Typography variant="h4" align="center" sx={{ margin: '20px 0', color: '#001f3d' }}>
        Giỏ hàng
      </Typography>
      <Grid container spacing={2}>
        {cart.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ boxShadow: 3, borderRadius: '8px', overflow: 'hidden' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{product.name}</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: '10px' }}>
                  {product.description}
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
                  <TextField
                    label="Số lượng"
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleQuantityChange(product, parseInt(e.target.value))}
                    sx={{ maxWidth: '100px', width: '100%' }}
                    InputProps={{ inputProps: { min: 1 } }}
                    variant="outlined"
                  />
                  <Typography variant="h6" color="primary" sx={{ ml: 2 }}>
                    {product.price * product.quantity} VND
                  </Typography>
                  <IconButton color="error" onClick={() => handleRemoveFromCart(product)} sx={{ ml: 2 }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Typography variant="h6" sx={{ mr: 2, fontWeight: 'bold', color: '#333' }}>
          Tổng cộng: {calculateTotal()} VND
        </Typography>
        <Button variant="contained" color="primary" sx={{ padding: '10px 20px', fontWeight: 'bold' }}>
          Thanh toán
        </Button>
      </Box>
    </Container>
  );
};

export default CartPage;
