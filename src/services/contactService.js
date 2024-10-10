import axios from "../axios";

const contactService = {
  async getAllContacts() {
    try {
      const res = await axios.get("/api/contact");
      return res?.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export default contactService;
