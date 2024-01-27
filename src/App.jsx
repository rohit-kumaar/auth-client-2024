import axios from "axios";
import React, { lazy, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.scss";
import { API_URL } from "./config/config.js";
import { setUserData } from "./features/userSlice.js";
import { ROUTE_PATH } from "./routes/path.js";
import ProtectedRoute from "./routes/ProtectedRoute.js";
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Error = lazy(() => import("./pages/Error.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const SignUp = lazy(() => import("./pages/SignUp.jsx"));

function App() {
  const token = localStorage.getItem("userDataToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dashboardValid = async () => {
    axios
      .get(`${API_URL}/valid-user`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        const data = res.data;
        // console.log(data);

        if (data.status == 401 || !data) {
          navigate(ROUTE_PATH.ERROR);
        } else {
          dispatch(setUserData(data));
          navigate(ROUTE_PATH.DASHBOARD);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    token ? dashboardValid() : navigate(ROUTE_PATH.DEFAULT);
  }, []);

  return (
    <Routes>
      <Route path={ROUTE_PATH.DEFAULT} element={<SignUp />} />
      <Route path={ROUTE_PATH.LOGIN} element={<Login />} />
      <Route path={ROUTE_PATH.DASHBOARD} element={<Dashboard />} />
      <Route path={ROUTE_PATH.ERROR} element={<Error />} />
    </Routes>
  );
}

export default App;
