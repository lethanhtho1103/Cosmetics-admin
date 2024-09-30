import { useEffect, useState } from "react";
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
import orderService from "../../services/orderService";
import { baseUrl } from "../../axios";
import { toast } from "react-toastify";

function ViewOrder({ orderId, formatDate, onClose }) {
  const [order, setOrder] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("denied");

  const formatNumber = (num) =>
    num?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleGetAllOrder = async () => {
    const res = await orderService.getOrderById(orderId);
    setOrder(res?.data);
  };

  useEffect(() => {
    handleGetAllOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleCancelOrder = async () => {
    await orderService.updateStatus(orderId, selectedStatus);
    await handleGetAllOrder();
    toast.success("Cập nhật trạng thái đơn hàng thành công.");
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent>
        <Box sx={{ padding: "20px" }}>
          <Card
            variant="outlined"
            sx={{ position: "relative", marginBottom: "24px" }}
            key={order._id}
          >
            <Button
              onClick={onClose}
              sx={{
                position: "absolute",
                top: "8px",
                right: "10px",
                zIndex: 1,
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <CloseIcon />
            </Button>
            <CardContent>
              <Grid>
                <Grid
                  item
                  xs={12}
                  container
                  justifyContent="space-between"
                  sx={{
                    borderBottom: "1px solid #e0e0e0",
                    paddingBottom: "12px",
                    mb: "12px",
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
                        padding: "0px 6px",
                        backgroundColor: "#e67e23",
                      }}
                    >
                      Orange
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ ml: 2, color: "#0000008a", fontSize: "16px" }}
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
                        color: "red",
                        fontWeight: 500,
                        textTransform: "uppercase",
                      }}
                    >
                      {order?.status === "pending"
                        ? "Chờ xác nhận"
                        : order?.status === "accepted"
                        ? "Chờ giao hàng"
                        : order?.status === "delivered"
                        ? "Hoàn thành"
                        : order?.status === "denied"
                        ? "Đã hủy"
                        : ""}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sx={{ marginTop: "12px", mb: "12px" }}>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{
                      marginRight: "12px",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  >
                    {/* <option value="pending">Chờ xác nhận</option> */}
                    <option value="shipped">Đang vận chuyển</option>
                    <option value="delivered">Hoàn thành</option>
                    <option value="denied">Hủy đơn</option>
                  </select>
                  <Button
                    variant="contained"
                    onClick={handleCancelOrder}
                    sx={{ backgroundColor: "#e67e23", color: "#fff" }}
                  >
                    Cập nhật trạng thái
                  </Button>
                </Grid>

                {order?.orderDetails?.map((orderDetail, index) => (
                  <Grid
                    item
                    xs={12}
                    container
                    sx={{ marginTop: "12px", mb: "12px" }}
                    key={index}
                  >
                    <Grid item xs={12} md={2}>
                      <img
                        src={`${baseUrl}/${orderDetail?.product_image}`}
                        alt={orderDetail?.product_name}
                        style={{ width: "90%", borderRadius: "4px" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={10}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          width: "90%",
                          color: "#000 !important",
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
                            mt: "6px ",
                            color: "#0000008a !important",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Số lượng:
                          <Typography
                            sx={{
                              color: "#000 !important",
                              fontWeight: 500,
                              ml: "4px",
                            }}
                          >
                            x{orderDetail?.quantity}
                          </Typography>
                        </Typography>
                        <Typography sx={{ color: "#000 !important" }}>
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
                    textAlign: "right",
                    paddingTop: "12px",
                    marginTop: "12px",
                    borderTop: "1px solid #e0e0e0",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: "red",
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "center",
                      flex: 1,
                      justifyContent: "flex-end",
                      fontWeight: "500",
                    }}
                  >
                    <span style={{ color: "black", margin: "0 4px" }}>
                      Thành tiền:
                    </span>
                    {formatNumber(order?.total_price)}₫
                  </Typography>
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
