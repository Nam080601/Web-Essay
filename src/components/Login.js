import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import "./CSS/Login.css";
import user from "../images/user.png";

export default function Login(props) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const username = localStorage.getItem("user");
    if (username) {
      navigate("/");
    }
  });

  const handleChange = (e) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    props.progress(e);

    setTimeout(() => {
      const loginData = {
        username: formData.username,
        password: formData.password,
      };
      axios
        .post("http://localhost:8000/api/login.php", JSON.stringify(loginData))
        .then((response) => {
          if (response.data.code === 0) {
            localStorage.setItem("user", response.data.name);
            navigate("/");
          } else {
            setError(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 500);
  };

  const NavTo = (to) => {
    setTimeout(() => {
      navigate(to);
    }, 500);
  };

  return (
    <div>
      <div id="login-page">
        <div className="user col-12 col-sm-10 col-md-8 col-lg-6">
          <div className="login-form">
            <div className="icon-login col-12 col-sm-10 col-md-8 col-lg-6">
              <img src={user} alt="user-icon" height={200}></img>
            </div>
            <div className="login col-12 col-sm-10 col-md-8 col-lg-6">
              <span>ĐĂNG NHẬP</span>
              <form>
                <label for="username">Tài khoản</label>
                <div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <label for="password">Mật khẩu</label>
                <div>
                  <input
                    type="password"
                    name="password"
                    password={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <button
                  id="login-button"
                  type="button"
                  onClick={(e) => handleSubmit(e)}
                >
                  ĐĂNG NHẬP
                </button>
              </form>
            </div>
          </div>
          <div id="register-link">
            <NavLink
              to="/register"
              onClick={(e) => {
                props.progress(e);
                NavTo("/register");
              }}
            >
              <span>Bạn chưa có tài khoản ? Đăng ký ngay</span>
            </NavLink>
          </div>
          <div id="login-error">{error}</div>
        </div>
      </div>
    </div>
  );
}
