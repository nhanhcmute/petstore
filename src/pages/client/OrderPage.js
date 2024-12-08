import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';
import Sidebar from '../../function/Sidebar';

const OrderPage = () => {
  const orderStatuses = [
    { id: 1, status: 'Tất Cả' },
    { id: 2, status: 'Chờ thanh toán' },
    { id: 3, status: 'Vận chuyển' },
    { id: 4, status: 'Chờ giao hàng' },
    { id: 5, status: 'Hoàn thành' },
    { id: 6, status: 'Đã Hủy' },
    { id: 7, status: 'Trả hàng/Hoàn tiền' },
  ];

  const [selectedStatus, setSelectedStatus] = useState('Tất Cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Số lượng đơn hàng trên mỗi trang

  const orders = [
    { id: 1, status: 'Chờ thanh toán', details: 'Đơn hàng #1 - 2 món hàng' },
    { id: 2, status: 'Vận chuyển', details: 'Đơn hàng #2 - 1 món hàng' },
    { id: 3, status: 'Chờ giao hàng', details: 'Đơn hàng #3 - 3 món hàng' },
    { id: 4, status: 'Hoàn thành', details: 'Đơn hàng #4 - 5 món hàng' },
    { id: 5, status: 'Đã Hủy', details: 'Đơn hàng #5 - 4 món hàng' },
    { id: 6, status: 'Trả hàng/Hoàn tiền', details: 'Đơn hàng #6 - 2 món hàng' },
    { id: 7, status: 'Chờ thanh toán', details: 'Đơn hàng #7 - 1 món hàng' },
  ];

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const filteredOrders = orders
    .filter((order) => selectedStatus === 'Tất Cả' || order.status === selectedStatus)
    .filter((order) => order.details.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box
      display="flex"
      sx={{
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Sidebar />
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Quản lý Đơn Hàng
        </Typography>

        <Box display="flex" justifyContent="center" mb={3}>
          <TextField
            label="Tìm kiếm đơn hàng"
            placeholder="Bạn có thể tìm kiếm theo ID đơn hàng hoặc tên sản phẩm..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: '100%', marginRight: '20px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box display="flex" justifyContent="center" mb={3}>
          {orderStatuses.map((status) => (
            <Button
              key={status.id}
              variant={selectedStatus === status.status ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => handleStatusChange(status.status)}
              sx={{ margin: '0 10px' }}
            >
              {status.status}
            </Button>
          ))}
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Paper sx={{ padding: '20px', boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>
                Đơn hàng của bạn:
              </Typography>
              <List>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <ListItem key={order.id}>
                      <ListItemText
                        primary={order.details}
                        secondary={`Trạng thái: ${order.status}`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body1" style={{ color: '#757575' }}>
                    Không có đơn hàng nào với trạng thái này hoặc từ khóa tìm kiếm.
                  </Typography>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages || 1} // Luôn có ít nhất 1 trang
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            disabled={totalPages <= 1} // Vô hiệu hóa nếu chỉ có 1 trang
          />
        </Box>
      </Container>
    </Box>
  );
};

export default OrderPage;
