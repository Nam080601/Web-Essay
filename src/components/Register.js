import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import "./CSS/Register.css";

export default function Register(props) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    password2: "",
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
    if (
      !formData.name ||
      !formData.phone ||
      !formData.password ||
      !formData.password2
    ) {
      setError("Xin điền đầy đủ thông tin");
      return;
    }
    if (formData.password.length < 6) {
      setError("Mật khẩu quá ngắn (tối thiểu 6 kí tự)");
      return;
    }
    if (formData.password !== formData.password2) {
      setError("Mật khẩu không khớp");
      return;
    }
    props.progress(e);

    setTimeout(() => {
      const regData = {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
      };
      axios
        .post("http://localhost:8000/api/register.php", JSON.stringify(regData))
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

  return (
    <div>
      <div id="reg-page">
        <div className="reg col-10 col-sm-8 col-md-6 col-lg-4">
          <span>ĐĂNG KÝ</span>
          <form>
            <label for="username">Họ và tên</label>
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <label for="username">Số điện thoại</label>
            <div>
              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <label for="password">Mật khẩu</label>
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <label for="password">Nhập lại mật khẩu</label>
            <div>
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
              />
            </div>
            <button
              id="reg-button"
              type="button"
              onClick={(e) => handleSubmit(e)}
            >
              ĐĂNG KÝ
            </button>
          </form>
          <div id="reg-error">{error}</div>
        </div>
      </div>
    </div>
  );
}
