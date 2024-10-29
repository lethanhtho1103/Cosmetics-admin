import axios from "../axios";

const suppliersService = {
  async getAllSuppliers() {
    try {
      const res = await axios.get("/api/suppliers");
      return res?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Thất bại");
    }
  },

  async getSupplierById(orderId) {
    try {
      const res = await axios.get(`/api/suppliers/${orderId}`);
      return res?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Thất bại");
    }
  },
};

export default suppliersService;
