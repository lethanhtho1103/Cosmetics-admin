import axios from "../axios";
import { logOutSuccess } from "../redux/authSlice";

const authService = {
  async loginAdmin(email, password) {
    const res = await axios.post("/api/authentication/login-admin", {
      email,
      password,
    });
    return res.data;
  },

  async updateUser(userId, username, phone, address, province, district, ward) {
    try {
      const res = await axios.put(`/api/authentication/update-user/${userId}`, {
        username,
        phone,
        address,
        province,
        district,
        ward,
      });
      return res.data;
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      throw error;
    }
  },

  async logOut(dispatch, id, navigate, accessToken) {
    await axios.post("/api/authentication/logout", id, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(logOutSuccess());
    navigate("/login");
  },
};

export default authService;
