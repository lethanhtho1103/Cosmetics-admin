import axios from "../axios";

const orderService = {
  async getAllOrder() {
    try {
      const res = await axios.get("/api/order/users");
      return res?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Thất bại");
    }
  },

  async getOrderById(userId) {
    try {
      const res = await axios.get(`/api/order/user/${userId}`);
      return res?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Thất bại");
    }
  },
  async updateStatus(orderId, status) {
    try {
      const response = await axios.put("/api/order/update/status", {
        orderId,
        status,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Cập nhật trạng thái thất bại"
      );
    }
  },
};

export default orderService;
