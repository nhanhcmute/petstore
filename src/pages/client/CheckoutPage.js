import React, { useState } from 'react';
import { Box, Typography, CardContent, Card, Button, TextField, Grid, Paper, FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import { useEffect } from 'react';
const CheckoutPage = () => {
    // Danh sách voucher có sẵn
    const availableVouchers = [
        { code: 'DISCOUNT10', discount: 0.1, description: 'Giảm 10%' },
        { code: 'DISCOUNT20', discount: 0.2, description: 'Giảm 20%' },
        { code: 'DISCOUNT30', discount: 0.3, description: 'Giảm 30%' },
    ];

    const [address, setAddress] = useState('');
    const [voucher, setVoucher] = useState('');
    const [note, setNote] = useState('');
    const [shippingMethod, setShippingMethod] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [orderAmount, setOrderAmount] = useState(100000); // Giả sử tổng tiền đơn hàng là 100,000 VND
    const [shippingFee, setShippingFee] = useState(20000); // Giả sử phí ship là 20,000 VND
    const [discount, setDiscount] = useState(0); // Voucher giảm giá
    const [voucherType, setVoucherType] = useState(''); // Loại voucher: chọn hoặc nhập
    const [voucherError, setVoucherError] = useState('');

    const handleVoucherChange = (e) => {

        setVoucher(e.target.value);
        setVoucherError('');
        // Kiểm tra mã voucher nếu nhập thủ công
        const foundVoucher = availableVouchers.find(v => v.code === e.target.value);
        if (foundVoucher) {
            setDiscount(foundVoucher.discount * orderAmount); // Giảm giá theo mã voucher
        } else if (e.target.value !== '') {
            setVoucherError('Voucher không hợp lệ');
            setDiscount(0);
        } else {
            setDiscount(0);
        }
    };

    const handleVoucherTypeChange = (e) => {
        setVoucherType(e.target.value);
        setVoucher(''); // Reset voucher khi chuyển kiểu voucher
        setDiscount(0); // Reset discount khi thay đổi loại voucher
        setVoucherError(''); // Reset lỗi voucher
    };

    const handleConfirmPayment = () => {
        const totalAmount = orderAmount + shippingFee - discount;
        alert(`Tổng số tiền cần thanh toán: ${totalAmount.toLocaleString()} VND`);
    };

    const totalAmount = orderAmount + shippingFee - discount;
    const [defaultAddress, setDefaultAddress] = useState(null);

    useEffect(() => {
        // Lấy địa chỉ mặc định từ localStorage khi trang thanh toán được tải
        const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
        const defaultAddr = addresses.find(address => address.isDefault);
        setDefaultAddress(defaultAddr);
    }, []);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Thanh Toán
            </Typography>

            {/* Địa chỉ giao hàng */}
            {defaultAddress ? (
                <Card sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Typography variant="h6">Địa chỉ giao hàng:</Typography>
                        <Typography variant="body1">
                            {defaultAddress.fullName} - {defaultAddress.phone}
                        </Typography>
                        <Typography variant="body1">
                            {defaultAddress.province}, {defaultAddress.district}, {defaultAddress.ward}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Loại địa chỉ: {defaultAddress.addressType}
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Typography variant="body1" color="error">
                    Bạn chưa có địa chỉ mặc định!
                </Typography>
            )}

            {/* Thông tin sản phẩm */}
            <Paper sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">Thông tin và số lượng sản phẩm:</Typography>
                <Typography variant="body1">Sản phẩm A - 2 x 50,000 VND</Typography>
                <Typography variant="body1">Sản phẩm B - 1 x 30,000 VND</Typography>
            </Paper>

            {/* Chọn hoặc Nhập Voucher */}
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Chọn hoặc Nhập Voucher</InputLabel>
                <Select
                    value={voucherType}
                    onChange={handleVoucherTypeChange}
                    label="Chọn hoặc Nhập Voucher"
                >
                    <MenuItem value="select">Voucher của bạn</MenuItem>
                    <MenuItem value="input">Nhập voucher</MenuItem>
                </Select>
            </FormControl>

            {/* Nếu chọn "Chọn voucher" */}
            {voucherType === 'select' && (
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel>Chọn voucher</InputLabel>
                    <Select
                        value={voucher}
                        onChange={handleVoucherChange}
                        label="Chọn voucher"
                    >
                        {availableVouchers.map((voucherItem) => (
                            <MenuItem key={voucherItem.code} value={voucherItem.code}>
                                {voucherItem.description}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            {/* Nếu chọn "Nhập voucher" */}
            {voucherType === 'input' && (
                <TextField
                    label="Nhập Voucher"
                    variant="outlined"
                    fullWidth
                    value={voucher}
                    onChange={handleVoucherChange}
                    error={!!voucherError}
                    helperText={voucherError}
                    sx={{ marginBottom: 2 }}
                />
            )}

            {/* Lời nhắc cho người bán */}
            <TextField
                label="Lời nhắc cho người bán"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                sx={{ marginBottom: 2 }}
            />

            {/* Phương thức vận chuyển */}
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Phương thức vận chuyển</InputLabel>
                <Select
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    label="Phương thức vận chuyển"
                >
                    <MenuItem value="fast">Vận chuyển nhanh</MenuItem>
                    <MenuItem value="express">Vận chuyển hỏa tốc</MenuItem>
                    <MenuItem value="standard">Vận chuyển tiêu chuẩn</MenuItem>
                </Select>
            </FormControl>

            {/* Phương thức thanh toán */}
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Phương thức thanh toán</InputLabel>
                <Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    label="Phương thức thanh toán"
                >
                    <MenuItem value="cash">Thanh toán trực tiếp</MenuItem>
                    <MenuItem value="wallet">Thanh toán qua ví điện tử</MenuItem>
                </Select>
            </FormControl>

            {/* Phí ship */}
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                Phí vận chuyển: {shippingFee.toLocaleString()} VND
            </Typography>

            {/* Tổng số tiền cần thanh toán */}
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Tổng số tiền cần thanh toán: {totalAmount.toLocaleString()} VND
            </Typography>

            {/* Xác nhận thanh toán */}
            <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmPayment}
                sx={{ marginTop: 2 }}
            >
                Xác nhận thanh toán
            </Button>
        </Box>
    );
};

export default CheckoutPage;
