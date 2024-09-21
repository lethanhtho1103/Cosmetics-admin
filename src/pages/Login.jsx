import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import logo from "../assets/images/logo.png";
import { useDispatch } from "react-redux";
import authService from "../services/authService";
import { loginAdminSuccess } from "../redux/authSlice";
import { AppBar, Toolbar, Typography, Box, Avatar } from "@mui/material";

const LoginAdmin = () => {
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
      if (error.response) {
        setErrClass(true);
        setErrClassEmail(true);
        SetErrClassPass(true);
        setEmail("");
        setPassInput("");
        setErrMessage("Email hoặc mật khẩu không đúng.");
        emailRef.current.focus();
      } else {
        console.error("Other error:", error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <AppBar position="static" color="primary" sx={{ background: "#001f3f" }}>
        <Toolbar>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar src={logo} alt="logo" sx={{ mr: "12px" }} />
            <Typography variant="h6" component="div" sx={{ color: "#fff" }}>
              Orange - Admin Login
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <main className="container-login flex justify-center items-center min-h-screen">
        <section className="page-content bg-white rounded-lg shadow-lg p-10 text-gray-800 w-full max-w-lg">
          <div className="page-title text-center">
            <h1 className="text-2xl font-bold uppercase">
              Đăng nhập quản trị viên
            </h1>
            <div className="register-link text-sm">
              Bạn chưa có tài khoản?
              <Link to="/register" className="ml-2 text-blue-600 font-semibold">
                Đăng ký ngay
              </Link>
            </div>
            {isLoader && (
              <CircularProgress className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10" />
            )}
          </div>
          {errClass && (
            <div className="notification-box invalid bg-red-100 border-l-4 border-red-500 p-4 my-4">
              <span>{errMessage}</span>
            </div>
          )}
          <div className="notification-box bg-yellow-100 border-l-4 border-yellow-500 p-4 my-4">
            <strong>
              Chào mừng quản trị viên! Hãy đăng nhập để truy cập bảng điều khiển
              và quản lý hệ thống.
            </strong>
          </div>
          <form onKeyDown={handleKeyDown} className="space-y-4">
            <FormControl fullWidth margin="normal">
              <TextField
                label="Email"
                value={emailInput}
                inputRef={emailRef}
                error={errClassEmail}
                onChange={(e) => handleChange(e, "user")}
                required
                autoComplete="off"
                variant="outlined"
                fullWidth
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Mật khẩu"
                type="password"
                value={passInput}
                inputRef={passRef}
                error={errClassPass}
                onChange={(e) => handleChange(e, "password")}
                required
                variant="outlined"
                fullWidth
              />
            </FormControl>
            <div className="remember-forgot flex justify-end text-sm">
              <Link to="/" className="text-blue-600">
                Quên mật khẩu?
              </Link>
            </div>
            <Button
              ref={btnSubmitRef}
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              fullWidth
              className="submit-login text-white bg-blue-800 hover:bg-blue-900"
            >
              Đăng nhập
            </Button>
          </form>
        </section>
      </main>
    </>
  );
};

export default LoginAdmin;
