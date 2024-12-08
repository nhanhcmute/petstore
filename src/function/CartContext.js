import React, { createContext, useState, useContext } from 'react';

// Tạo context cho giỏ hàng
const CartContext = createContext();

// Hook để truy cập giỏ hàng
export const useCart = () => {
  return useContext(CartContext);
};

// Provider để cung cấp giỏ hàng và các hàm cho các component khác
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Lấy giỏ hàng từ localStorage nếu có
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingProduct = prevCart.find(item => item.id === product.id);

      if (existingProduct) {
        // Nếu có rồi, tăng số lượng sản phẩm lên 1
        const updatedCart = prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart)); // Lưu giỏ hàng vào localStorage
        return updatedCart;
      } else {
        // Nếu chưa có, thêm sản phẩm vào giỏ hàng
        const updatedCart = [...prevCart, { ...product, quantity: 1 }];
        localStorage.setItem('cart', JSON.stringify(updatedCart)); // Lưu giỏ hàng vào localStorage
        return updatedCart;
      }
    });
  };

  // Hàm cập nhật số lượng sản phẩm trong giỏ
  const updateCartQuantity = (product, quantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map(item =>
        item.id === product.id ? { ...item, quantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (product) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(item => item.id !== product.id);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };


  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};