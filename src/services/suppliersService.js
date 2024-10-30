import axios from "../axios";

const suppliersService = {
  async createSupplier({ name, email, phone, address }) {
    try {
      const res = await axios.post("/api/suppliers", {
        name,
        email,
        phone,
        address,
      });
      return res?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Thất bại");
    }
  },

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

  async updateSupplier(supplierId, { name, email, phone, address }) {
    try {
      const res = await axios.put(`/api/suppliers/${supplierId}`, {
        name,
        email,
        phone,
        address,
      });
      return res?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Thất bại");
    }
  },

  async deleteSupplierById(id) {
    try {
      const res = await axios.delete(`/api/suppliers/${id}`);
      return res?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Thất bại");
    }
  },
};

export default suppliersService;
