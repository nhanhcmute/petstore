import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, CircularProgress, TextField, Button, Box, Card, CardContent, CardActions, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { CSVLink } from 'react-csv';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  // Lấy dữ liệu đơn hàng
  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('http://localhost:5000/orders');
        const data = await response.json();
        if (Array.isArray(data)) {
          setOrders(data);
          setFilteredOrders(data); // Khởi tạo filteredOrders bằng dữ liệu ban đầu
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
      setLoading(false);
    }

    fetchOrders();
  }, []);

  // Hàm tìm kiếm đơn hàng
  const handleSearch = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = orders.filter(order =>
      (order.id && order.id.toString().includes(lowercasedQuery)) ||
      (order.productName && order.productName.toLowerCase().includes(lowercasedQuery)) ||
      (order.customerName && order.customerName.toLowerCase().includes(lowercasedQuery))
    );
    setFilteredOrders(filtered);
  };

  // Hàm mở Dialog và chọn trạng thái mới
  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.shippingStatus); // Khởi tạo trạng thái mới bằng trạng thái hiện tại của đơn hàng
    setOpenDialog(true);
  };

  // Hàm mở Dialog chi tiết đơn hàng
  const handleOpenDetailDialog = (order) => {
    setSelectedOrder(order);
    setOpenDetailDialog(true);
  };

  // Hàm đóng Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenDetailDialog(false);
    setSelectedOrder(null);
    setNewStatus('');
  };

  // Hàm thay đổi trạng thái đơn hàng
  const handleChangeStatus = () => {
    if (selectedOrder && newStatus) {
      const validTransitions = {
        Pending: ['Shipped', 'Cancelled'], // Chờ xử lý có thể sang Đang giao hoặc Hủy
        Shipped: ['Completed', 'Cancelled'], // Đang giao có thể sang Hoàn thành hoặc Hủy
        Completed: [], // Hoàn thành không thể đổi trạng thái
        Cancelled: [] // Hủy không thể đổi trạng thái
      };
  
      // Kiểm tra xem trạng thái hiện tại có trong validTransitions không
      if (!validTransitions[selectedOrder.shippingStatus]) {
        alert('Trạng thái hiện tại không hợp lệ.');
        return;
      }
  
      // Kiểm tra xem trạng thái mới có hợp lệ hay không
      if (!validTransitions[selectedOrder.shippingStatus].includes(newStatus)) {
        alert('Không thể thay đổi trạng thái theo cách này. Vui lòng kiểm tra thứ tự chuyển trạng thái.');
        return;
      }
  
      // Cập nhật trạng thái đơn hàng trong state
      const updatedOrders = orders.map(order =>
        order.id === selectedOrder.id ? { ...order, shippingStatus: newStatus } : order
      );
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders); // Cập nhật danh sách lọc lại sau khi thay đổi
  
      // Đóng Dialog
      handleCloseDialog();
    }
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>Quản lý đơn hàng</Typography>

      {/* Tìm kiếm đơn hàng */}
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Tìm kiếm theo mã đơn hàng, tên khách hàng"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'primary.main' },
                '&:hover fieldset': { borderColor: 'primary.dark' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSearch}
            sx={{
              height: "56px",
              '&:hover': { backgroundColor: 'primary.dark' },
              padding: '10px 0'
            }}
          >
            Tìm kiếm
          </Button>
        </Grid>
      </Grid>

      {/* Danh sách đơn hàng */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main' }}>Danh sách đơn hàng</Typography>

            {/* Hiển thị bảng đơn hàng */}
            {filteredOrders.length > 0 ? (
              <Grid container spacing={3}>
                {filteredOrders.map(order => (
                  <Grid item xs={12} sm={6} md={4} key={order.id}>
                    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          Mã đơn hàng: {order.id}
                        </Typography>
                        <Typography variant="body1">Tên khách hàng: {order.customerName}</Typography>
                        <Typography variant="body1">Sản phẩm: {order.productName}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Tổng giá trị: {order.totalAmount} VNĐ</Typography>
                        <Typography variant="body2">Trạng thái: <span style={{ color: getStatusColor(order.shippingStatus) }}>{order.shippingStatus}</span></Typography>
                        <Typography variant="body2">Phương thức thanh toán: {order.paymentStatus}</Typography>
                      </CardContent>

                      <CardActions sx={{ justifyContent: 'space-between', padding: '10px' }}>
                        <Grid container spacing={2} sx={{ width: '100%' }}>
                          <Grid item xs={6}>
                            <Button
                              variant="contained"
                              color="info"
                              fullWidth
                              onClick={() => handleOpenDialog(order)}
                            >
                              Trạng thái
                            </Button>
                          </Grid>
                          <Grid item xs={6}>
                            <Button
                              variant="contained"
                              color="secondary"
                              fullWidth
                              onClick={() => handleOpenDetailDialog(order)}
                            >
                              Chi tiết
                            </Button>
                          </Grid>
                        </Grid>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" sx={{ color: 'error.main' }}>Không có đơn hàng nào phù hợp với tìm kiếm của bạn.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Xuất dữ liệu CSV */}
      <Grid container spacing={2} sx={{ marginTop: 4 }}>
        <Grid item xs={12}>
          <CSVLink
            data={filteredOrders}
            filename="orders.csv"
            className="btn btn-primary"
            style={{ textDecoration: 'none' }}
          >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ padding: '10px 0', backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}
            >
              Xuất CSV
            </Button>
          </CSVLink>
        </Grid>
      </Grid>

      {/* Dialog đổi trạng thái đơn hàng */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Đổi trạng thái đơn hàng</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Trạng thái đơn hàng</InputLabel>
            <Select
              labelId="status-select-label"
              value={newStatus}
              label="Trạng thái đơn hàng"
              onChange={e => setNewStatus(e.target.value)}
            >
              {selectedOrder && ['Pending', 'Shipped', 'Completed', 'Cancelled'].map(status => (
                <MenuItem key={status} value={status} disabled={!isStatusValid(selectedOrder.shippingStatus, status)}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">Hủy</Button>
          <Button onClick={handleChangeStatus} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog chi tiết đơn hàng */}
      <Dialog open={openDetailDialog} onClose={handleCloseDialog}>
        <DialogTitle>Chi tiết đơn hàng</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Mã đơn hàng: {selectedOrder?.id}</Typography>
          <Typography variant="body1">Tên khách hàng: {selectedOrder?.customerName}</Typography>
          <Typography variant="body1">Sản phẩm: {selectedOrder?.productName}</Typography>
          <Typography variant="body1">Tổng giá trị: {selectedOrder?.totalAmount} VNĐ</Typography>
          <Typography variant="body1">Trạng thái đơn hàng: {selectedOrder?.shippingStatus}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );

  // Kiểm tra trạng thái hợp lệ
  function isStatusValid(currentStatus, newStatus) {
    const validTransitions = {
      Pending: ['Shipped', 'Cancelled'],
      Shipped: ['Completed', 'Cancelled'],
      Completed: [],
      Cancelled: []
    };

    return validTransitions[currentStatus]?.includes(newStatus);
  }

  // Màu sắc theo trạng thái
  function getStatusColor(status) {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Shipped':
        return 'blue';
      case 'Completed':
        return 'green';
      case 'Cancelled':
        return 'red';
      default:
        return 'gray';
    }
  }
}

export default Orders;
