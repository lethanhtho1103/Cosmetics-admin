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

  async getSupplierById(id) {
    try {
      const res = await axios.get(`/api/suppliers/${id}`);
      return res?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Thất bại");
    }
  },
};

export default suppliersService;
