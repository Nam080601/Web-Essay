import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./CSS/Tracking.css";

export default function Tracking(props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState("");
  const [orderID, setOrderID] = useState({
    id: "",
  });
  const [data, setData] = useState({
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

  const getData = useCallback(() => {
    axios
      .get("http://localhost:8000/api/get_order.php", {
        params: {
          id: id,
        },
      })
      .then((response) => {
        if (response.data.code === 0) setData(response.data.data);
        else navigate("/Error");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [navigate, id]);

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [getData, id]);

  const ShowError = (err) => {
    const e = document.getElementById("tracking-error");
    e.style = "display: flex";
    e.innerHTML = err;
  };

  const HideError = () => {
    const e = document.getElementById("tracking-error");
    e.style = "display: none";
    e.innerHTML = "";
  };

  const handleChange = (e) => {
    setError("");
    HideError();
    setOrderID({
      ...orderID,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderID.id) {
      ShowError("Chưa nhập mã vận đơn");
      return;
    }
    props.progress(e);

    setTimeout(() => {
      axios
        .get("http://localhost:8000/api/get_order.php", {
          params: {
            id: orderID.id,
          },
        })
        .then((response) => {
          if (response.data.code === 0) {
            setOrderID({
              id: "",
            });
            navigate(orderID.id);
          } else {
            ShowError(response.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, 500);
  };

  const renderData = [];
  if (data) {
    renderData.push(
      <div className="info-order">
        <h2 class="idOrder">Mã vận đơn : {data.id}</h2>
        <div class="people">
          <div id="receiver">
            <h2>Bên gửi</h2>
            <p>Họ tên : {data.fromName}</p>
            <p>SDT : {data.fromPhone}</p>
            <p>Địa chỉ : {data.fromAddress}</p>
          </div>
          <div id="sender">
            <h2>Bên Nhận</h2>
            <p>Họ tên : {data.toName}</p>
            <p>SDT : {data.toPhone}</p>
            <p>Địa chỉ : {data.toAddress}</p>
          </div>
        </div>
        <div id="order">
          <h2>Hàng hoá</h2>
          <p>Tên hàng : {data.goodsName}</p>
          <p>Khối lượng (kg) : {data.weight}</p>
          <p>Kích thước (cm) : {data.size}</p>
          <p>Thu hộ (vnd) : {data.cod}</p>
        </div>
      </div>
    );
  }

  if (!id) {
    return (
      <div>
        <div className="tracking-page">
          <div className="block-search">
            <input
              type="text"
              name="id"
              value={orderID.id}
              onChange={handleChange}
            />
            <p>Nhập mã vận đơn để tra cứu ( VD: 12345678900 )</p>
            <button onClick={(e) => handleSubmit(e)}>TRA CỨU VẬN ĐƠN</button>
            <p id="tracking-error">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  if (id) {
    return <div className="tracking-page">{renderData}</div>;
  }
}
