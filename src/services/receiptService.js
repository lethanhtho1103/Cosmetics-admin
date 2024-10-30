import axios from "../axios";

const receiptService = {
  async createReceipt({ admin_id, supplier_id, details }) {
    try {
      const res = await axios.post("/api/receipts", {
        admin_id,
        supplier_id,
        details,
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getAllReceipts() {
    try {
      const res = await axios.get("/api/receipts");
      return res?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Thất bại");
    }
  },

  async getReceiptById(id) {
    try {
      const res = await axios.get(`/api/receipts/${id}`);
      return res?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Thất bại");
    }
  },

  async getReceiptDetailById(id) {
    try {
      const res = await axios.get(`/api/receipt-detail/${id}`);
      return res?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Thất bại");
    }
  },

  async updateReceiptDetail({ receiptDetailId, quantity, import_price }) {
    try {
      const res = await axios.put("/api/receipt-detail", {
        receiptDetailId,
        quantity,
        import_price,
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },

  async deleteReceiptDetail({ receiptDetailId }) {
    try {
      const res = await axios.delete(`/api/receipt-detail/${receiptDetailId}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export default receiptService;
