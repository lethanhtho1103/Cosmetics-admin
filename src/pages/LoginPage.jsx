import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginAdminSuccess } from "../redux/authSlice";
import authService from "../services/authService";
import logo from "../assets/images/login.png"; // Đảm bảo đường dẫn này đúng
import { CircularProgress } from "@mui/material";
import { Mail, Eye, EyeOff } from "lucide-react"; // Sử dụng Eye và EyeOff cho biểu tượng

const LoginPage = () => {
  const emailRef = useRef();
  const passRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailInput, setEmail] = useState("");
  const [passInput, setPassInput] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Cho việc toggle hiện/ẩn mật khẩu
  const [errClass, setErrClass] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [isLoader, setIsLoader] = useState(false);

  const handleChange = (e, type) => {
    if (type === "user") {
      setEmail(e.target.value);
    } else if (type === "password") {
      setPassInput(e.target.value);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(); // Gọi hàm submit khi nhấn Enter
    }
  };

  const handleSubmit = async () => {
    // eslint-disable-next-line no-useless-escape
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailInput) {
      setErrMessage("Vui lòng nhập địa chỉ email.");
      setErrClass(true);
      emailRef.current.focus();
      return;
    } else if (!regex.test(emailInput)) {
      setErrMessage("Địa chỉ email không hợp lệ.");
      setErrClass(true);
      emailRef.current.focus();
      return;
    } else if (!passInput) {
      setErrMessage("Vui lòng nhập mật khẩu.");
      setErrClass(true);
      passRef.current.focus();
      return;
    }

    try {
      setIsLoader(true);
      const res = await authService.loginAdmin(emailInput, passInput);
      dispatch(loginAdminSuccess(res));
      setIsLoader(false);
      navigate("/admin/dashboard");
    } catch (error) {
      setIsLoader(false);
      setErrMessage("Email hoặc mật khẩu không đúng.");
      setErrClass(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 justify-center items-center relative">
      {/* Hình vuông mờ ở góc trên bên trái */}
      <div className="absolute top-16 left-1/3 w-40 h-40 bg-purple-400 opacity-10 rounded-lg"></div>

      {/* Hình vuông mờ ở góc dưới bên phải */}
      <div className="absolute bottom-16 right-1/3 w-40 h-40 bg-purple-400 opacity-10 rounded-lg"></div>

      <section className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm mx-4 relative z-10">
        <div className="text-center mb-5">
          <img src={logo} alt="Login Logo" className="mx-auto mb-2 h-14" />
          <h2 className="text-red-600 font-bold text-xl">HỆ THỐNG QUẢN TRỊ</h2>
          <p className="text-gray-500">
            Vui lòng đăng nhập vào tài khoản của bạn!
          </p>
        </div>

        {errClass && (
          <div className="bg-red-100 text-red-600 border-l-4 border-red-500 p-4 rounded-md mb-4">
            {errMessage}
          </div>
        )}

        <form className="space-y-4" onKeyPress={handleKeyPress}>
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 font-bold" htmlFor="email">
              Tài khoản
            </label>
            <div className="relative">
              <input
                id="email"
                ref={emailRef}
                type="email"
                className="form-input p-3 pl-12 border rounded-lg w-full"
                value={emailInput}
                onChange={(e) => handleChange(e, "user")}
                placeholder="Tài khoản"
                required
              />
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Mail className="text-gray-400" />
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 font-bold" htmlFor="password">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                id="password"
                ref={passRef}
                type={showPassword ? "text" : "password"}
                className="form-input p-3 pl-12 border rounded-lg w-full"
                value={passInput}
                onChange={(e) => handleChange(e, "password")}
                placeholder="Mật khẩu"
                required
              />
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                {showPassword ? (
                  <Eye
                    className="text-gray-400 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <EyeOff
                    className="text-gray-400 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-red-600 font-bold">Hotline: 097.222.1953</p>
        </div>

        {isLoader && (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50">
            <CircularProgress />
          </div>
        )}
      </section>
    </div>
  );
};

export default LoginPage;
