import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import logo from "../assets/images/logo.png";
import authService from "../services/authService";
import { useDispatch } from "react-redux";
import { loginAdminSuccess } from "../redux/authSlice";
import { CircularProgress } from "@mui/material";

const LoginPage = () => {
  const btnSubmitRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailInput, setEmail] = useState("");
  const [passInput, setPassInput] = useState("");
  const [errClass, setErrClass] = useState(false);
  const [errClassEmail, setErrClassEmail] = useState(false);
  const [errClassPass, SetErrClassPass] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [isLoader, setIsLoader] = useState(false);

  const handleChange = (e, type) => {
    if (type === "user") {
      setEmail(e.target.value);
      setErrClassEmail(false);
    } else if (type === "password") {
      setPassInput(e.target.value);
      SetErrClassPass(false);
    }
  };

  const handleSubmit = async () => {
    // eslint-disable-next-line
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailInput) {
      setErrMessage("Vui lòng nhập địa chỉ email.");
      setErrClass(true);
      setErrClassEmail(true);
      emailRef.current.focus();
      return;
    } else if (!regex.test(emailInput)) {
      setErrMessage("Địa chỉ email không hợp lệ. Vui lòng nhập lại.");
      setErrClass(true);
      setErrClassEmail(true);
      emailRef.current.focus();
      return;
    } else if (!passInput) {
      setErrMessage("Vui lòng nhập mật khẩu.");
      setErrClass(true);
      SetErrClassPass(true);
      passRef.current.focus();
      return;
    }

    try {
      setIsLoader(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const res = await authService.loginAdmin(emailInput, passInput);
      dispatch(loginAdminSuccess(res));
      setIsLoader(false);
      navigate("/admin/dashboard");
    } catch (error) {
      setIsLoader(false);
      setErrClass(true);
      setErrClassEmail(true);
      SetErrClassPass(true);
      setEmail("");
      setPassInput("");
      setErrMessage("Email hoặc mật khẩu không đúng.");
      emailRef.current.focus();
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen relative">
        <header className="bg-blue-900 py-4 shadow-lg">
          <div className="flex justify-center items-center">
            <img src={logo} alt="logo" className="h-10 mr-2" />
            <h1 className="text-white text-xl font-semibold">Orange</h1>
          </div>
        </header>

        <main className="flex-grow flex justify-center items-center bg-gray-100">
          <section className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mx-4">
            <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">
              Đăng nhập quản trị viên
            </h2>
            <div className="text-sm text-center mb-4">
              Bạn chưa có tài khoản?{" "}
              <Link to="/register" className="text-blue-600 font-medium">
                Đăng ký ngay
              </Link>
            </div>

            {errClass && (
              <div className="bg-red-100 text-red-600 border-l-4 border-red-500 p-4 rounded-md mb-4">
                {errMessage}
              </div>
            )}

            <form className="space-y-4">
              <div className="flex flex-col">
                <label className="text-gray-600 mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  ref={emailRef}
                  type="email"
                  className={`form-input p-2 border rounded-lg ${
                    errClassEmail ? "border-red-500" : "border-gray-300"
                  }`}
                  value={emailInput}
                  onChange={(e) => handleChange(e, "user")}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 mb-1" htmlFor="password">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  ref={passRef}
                  type="password"
                  className={`form-input p-2 border rounded-lg ${
                    errClassPass ? "border-red-500" : "border-gray-300"
                  }`}
                  value={passInput}
                  onChange={(e) => handleChange(e, "password")}
                  required
                />
              </div>

              <div className="text-right">
                <Link to="/" className="text-blue-600 text-sm">
                  Quên mật khẩu?
                </Link>
              </div>

              <button
                ref={btnSubmitRef}
                type="button"
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Đăng nhập
              </button>
            </form>
          </section>

          {isLoader && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50">
              <CircularProgress />
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default LoginPage;
