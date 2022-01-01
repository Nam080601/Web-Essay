import React from "react";
import { useNavigate } from "react-router-dom";
import user from "../images/user.png";
import "./CSS/Home.css";

export default function Home(props) {
  const navigate = useNavigate();
  const createOrderText = localStorage.getItem("user") ? "Tạo đơn" : "Đăng ký";

  const NavTo = (to) => {
    setTimeout(() => {
      navigate(to);
    }, 500);
  };

  return (
    <div>
      <div className="home">
        <p className="app-name">DELIVERY TRACKING</p>
        <div className="action">
          <div className="tracking">
            <p>BẠN MUỐN TÌM ĐƠN</p>
            <button
              id="btn-tracking"
              onClick={(e) => {
                props.progress(e);
                NavTo("/tracking");
              }}
            >
              Tra cứu
            </button>
          </div>
          <div className="register">
            <p>BẠN MUỐN TẠO ĐƠN</p>
            <button
              id="btn-register"
              onClick={(e) => {
                props.progress(e);
                if (!localStorage.getItem("user")) {
                  NavTo("/register");
                } else {
                  NavTo("/create-order");
                }
              }}
            >
              {createOrderText}
            </button>
          </div>
        </div>
        <p className="team">THÀNH VIÊN PHÁT TRIỂN APP</p>
        <div className="developers">
          <div className="card">
            <img src={user} alt="dev1"></img>
            <p className="dev-name">
              Đặng Hoàng Nam
              <span className="position">Fullstack</span>
            </p>
            <p className="dev-say">No more deadline</p>
          </div>
          <div className="card">
            <img src={user} alt="dev1"></img>
            <p className="dev-name">
              Lê Tuấn Anh
              <span className="position">Supporter</span>
            </p>
            <p className="dev-say">I am an master of API</p>
          </div>
          <div className="card">
            <img src={user} alt="dev1"></img>
            <p className="dev-name">
              Nguyễn Mạnh Hải
              <span className="position">Reporter</span>
            </p>
            <p className="dev-say">I am a master of report</p>
          </div>
        </div>
      </div>
    </div>
  );
}
