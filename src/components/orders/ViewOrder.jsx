import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import orderService from "../../services/orderService";
import { baseUrl } from "../../axios";
import { toast } from "react-toastify";
import OrderContext from "../../contexts/OrderContext";

function ViewOrder({ orderId, formatDate, onClose }) {
  const { handleGetAllOrders } = useContext(OrderContext);
  const [order, setOrder] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");

  const formatNumber = (num) =>
    num?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleGetOrderById = async () => {
    const res = await orderService.getOrderById(orderId);
    setOrder(res?.data);
    setSelectedStatus(res?.data?.status || "");
  };

  useEffect(() => {
    handleGetOrderById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleUpdateStatusOrder = async () => {
    await orderService.updateStatus(orderId, selectedStatus);
    await handleGetOrderById();
    toast.success("Cập nhật trạng thái đơn hàng thành công.");
    handleGetAllOrders();
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent sx={{ padding: "28px" }}>
        <Box>
          <Box
            onClick={onClose}
            size="small"
            sx={{
              position: "absolute",
              padding: "2px 4px",
              top: "2px",
              right: "2px",
              zIndex: 10,
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              },
            }}
          >
            <CloseIcon />
          </Box>
          <Card
            variant="outlined"
            sx={{
              position: "relative",
              boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
              borderRadius: "8px",
            }}
          >
            <CardContent>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  container
                  justifyContent="space-between"
                  sx={{
                    borderBottom: "1px solid #e0e0e0",
                    paddingBottom: "12px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "4px",
                        backgroundColor: "#FF8C00",
                      }}
                    >
                      Orange
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ ml: 2, color: "#555", fontSize: "16px" }}
                    >
                      Ngày đặt: {formatDate(order?.order_date)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {order?.status === "delivered" && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#26aa99",
                          mr: "4px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <LocalShippingOutlinedIcon sx={{ mr: "4px" }} />
                        Giao hàng thành công |
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          order?.status === "delivered"
                            ? "#26aa99"
                            : order?.status === "denied"
                            ? "red"
                            : order?.status === "shipped"
                            ? "blue"
                            : "#FFA500",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      {order?.status === "pending"
                        ? "Chờ xác nhận"
                        : order?.status === "shipped"
                        ? "Đang vận chuyển"
                        : order?.status === "delivered"
                        ? "Hoàn thành"
                        : order?.status === "denied"
                        ? "Đã hủy"
                        : ""}
                    </Typography>
                  </Box>
                </Grid>

                {order?.orderDetails?.map((orderDetail, index) => (
                  <Grid item xs={12} container key={index} spacing={2}>
                    <Grid item xs={12} md={2}>
                      <img
                        src={`${baseUrl}/${orderDetail?.product_image}`}
                        alt={orderDetail?.product_name}
                        style={{
                          width: "100%",
                          borderRadius: "8px",
                          border: "1px solid #c0c0c0",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={10}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          color: "#000",
                        }}
                      >
                        {orderDetail?.product_name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            mt: "6px",
                            color: "#555",
                          }}
                        >
                          Số lượng:
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: 500,
                              ml: 1,
                            }}
                          >
                            x{orderDetail?.quantity}
                          </Typography>
                        </Typography>
                        <Typography sx={{ fontWeight: 500 }}>
                          {formatNumber(orderDetail?.unit_price)}₫
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                ))}
                <Grid
                  item
                  xs={12}
                  sx={{
                    paddingTop: "12px",
                    borderTop: "1px solid #e0e0e0",
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: "red",
                      fontWeight: "500",
                    }}
                  >
                    <span style={{ color: "#000", marginRight: "8px" }}>
                      Thành tiền:
                    </span>
                    {formatNumber(order?.total_price)}₫
                  </Typography>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={{ mr: 1, fontWeight: "500" }}>
                        Trạng thái:
                      </Typography>
                      <Select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        size="small"
                        sx={{
                          marginRight: "12px",
                          borderRadius: "4px",
                          padding: "0 4px",
                        }}
                      >
                        <MenuItem value="shipped">Đang vận chuyển</MenuItem>
                        <MenuItem value="delivered">Hoàn thành</MenuItem>
                        <MenuItem value="denied">Hủy đơn</MenuItem>
                      </Select>
                    </Typography>

                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleUpdateStatusOrder}
                      sx={{
                        backgroundColor: "#FF8C00",
                        color: "#fff",
                        padding: "8px 16px",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "#FF7F00" },
                      }}
                    >
                      Cập nhật
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default ViewOrder;
