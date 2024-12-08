import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Header from '../Header'; // Import Header
import Footer from '../Footer'; // Import Footer
import { Outlet } from 'react-router-dom'; // Để render các Route con

const Layout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Đảm bảo chiều cao 100vh của toàn bộ màn hình
        backgroundColor: '#f9f9f9', // Màu nền tổng thể
      }}
    >
      <CssBaseline />

      <Header />

      <Box
        component="main"
        sx={{
          flex: 1, 
          p: 3, 
          maxWidth: 'auto', 
          margin: '0 auto',
          width: '100%', 
          minHeight: 'calc(100vh - 128px)', 
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
