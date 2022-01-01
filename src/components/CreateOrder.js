import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CSS/CreateOrder.css";

export default function CreateOrder(props) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fromName: "",
    fromPhone: "",
    fromAddress: "",
    toName: "",
    toPhone: "",
    toAddress: "",
    goodsName: "",
    weight: "",
    size: "",
    cod: "",
  });

  useEffect(() => {
    const username = localStorage.getItem("user");
    if (!username) {
      navigate("/login");
    } else {
      axios
        .post(
          "http://localhost:8000/api/get_profile.php",
          JSON.stringify({ user: localStorage.getItem("user") })
        )
        .then((response) => {
          const profile = response.data.profile;
          setFormData({
            fromName: profile.name,
            fromPhone: profile.phone,
            fromAddress: "",
            toName: "",
            toPhone: "",
            toAddress: "",
            goodsName: "",
            weight: "",
            size: "",
            cod: "",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    if (
      !formData.fromName ||
      !formData.fromPhone ||
      !formData.fromAddress ||
      !formData.toName ||
      !formData.toPhone ||
      !formData.toAddress ||
      !formData.goodsName ||
      !formData.weight ||
      !formData.size ||
      !formData.cod
    ) {
      setError("Xin điền đầy đủ thông tin");
      return;
    }
    props.progress(e);

    setTimeout(() => {
      const date = new Date().toJSON().slice(0, 10).replace(/-/g, "");
      const creData = {
        id: date,
        fromName: formData.fromName,
        fromPhone: formData.fromPhone,
        fromAddress: formData.fromAddress,
        toName: formData.toName,
        toPhone: formData.toPhone,
        toAddress: formData.toAddress,
        goodsName: formData.goodsName,
        weight: formData.weight,
        size: formData.size,
        cod: formData.cod,
      };
      axios
        .post(
          "http://localhost:8000/api/create_order.php",
          JSON.stringify(creData)
        )
        .then((response) => {
          if (response.data.code === 0) {
            navigate("/tracking/" + response.data.id);
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
      <div id="create-order-page">
        <div className="cre col-10 col-sm-8">
          <span>TẠO ĐƠN HÀNG</span>
          <form>
            <div className="form-row">
              <div className="form-col">
                <label className="label-from-to">Bên gừi</label>
                <div className="from-to">
                  <label>Họ tên người gửi</label>
                  <input
                    readOnly="readonly"
                    type="text"
                    value={formData.fromName}
                  />
                  <label>Số điện thoại người gửi</label>
                  <input
                    readOnly="readonly"
                    type="number"
                    value={formData.fromPhone}
                  />
                  <label>Địa chỉ người gửi</label>
                  <input
                    name="fromAddress"
                    type="text"
                    value={formData.fromAddress}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-col">
                <label className="label-from-to">Bên nhận</label>
                <div className="from-to">
                  <label>Họ tên người nhận</label>
                  <input
                    name="toName"
                    type="text"
                    value={formData.toName}
                    onChange={handleChange}
                  />
                  <label>Số điện thoại người nhận</label>
                  <input
                    name="toPhone"
                    type="number"
                    value={formData.toPhone}
                    onChange={handleChange}
                  />
                  <label>Địa chỉ người nhận</label>
                  <input
                    name="toAddress"
                    type="text"
                    value={formData.toAddress}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-col">
                <label className="label-from-to">Hàng hoá</label>
                <div className="from-to">
                  <label>Tên hàng</label>
                  <input
                    name="goodsName"
                    type="text"
                    value={formData.goodsName}
                    onChange={handleChange}
                  />
                  <label>Khối lượng (kg)</label>
                  <input
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                  <label>Kích thước (cm x cm x cm)</label>
                  <input
                    name="size"
                    type="text"
                    value={formData.size}
                    onChange={handleChange}
                  />
                  <label>C.O.D (vnd)</label>
                  <input
                    name="cod"
                    type="number"
                    value={formData.cod}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button
              id="cre-button"
              type="button"
              onClick={(e) => handleSubmit(e)}
            >
              TẠO ĐƠN
            </button>
          </form>
        </div>
        <div id="cre-error">{error}</div>
      </div>
    </div>
  );
}
