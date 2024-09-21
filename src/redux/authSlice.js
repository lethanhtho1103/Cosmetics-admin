import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      currentAdmin: null,
      accessToken_admin: null,
      isFetching: false,
      error: false,
    },
    register: {
      isFetching: false,
      accessToken_admin: "",
      error: false,
      success: false,
    },
  },
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginAdminSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentAdmin = action.payload?.data_admin;
      if (action.payload?.data_admin && action.payload?.accessToke) {
        state.login.accessToken_admin = action.payload?.accessToken;
      }
      state.login.error = false;
    },
    loginFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
      state.login.isLogin = false;
    },
    registerStart: (state) => {
      state.register.isFetching = true;
    },
    registerSuccess: (state) => {
      state.register.isFetching = false;
      state.register.error = false;
      state.register.success = true;
    },
    registerFailed: (state) => {
      state.register.isFetching = false;
      state.register.error = true;
      state.register.success = false;
    },
    logOutAdminSuccess: (state) => {
      state.login.isFetching = false;
      state.login.currentAdmin = null;
      state.login.accessToken_admin = "";
      state.login.error = false;
    },
    logOutFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
    logOutStart: (state) => {
      state.login.isFetching = true;
    },
  },
});

export const {
  loginStart,
  loginFailed,
  loginSuccess,
  loginAdminSuccess,
  registerStart,
  registerSuccess,
  registerFailed,
  logOutStart,
  logOutSuccess,
  logOutAdminSuccess,

  logOutFailed,
} = authSlice.actions;

export default authSlice.reducer;
