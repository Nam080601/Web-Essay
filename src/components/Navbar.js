import React, { useEffect } from "react";
import logo from "../images/logo.png";
import "./CSS/Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar(props) {
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("user");
    document.getElementById("user").style = `display: ${
      username ? "flex" : "none"
    }`;
    document.getElementById("logout").style = `display: ${
      username ? "flex" : "none"
    }`;
    document.getElementById("login").style = `display: ${
      username ? "none" : "flex"
    }`;
  });

  const NavTo = (to) => {
    setTimeout(() => {
      if (to === "logout") {
        localStorage.clear();
        navigate("/");
      } else {
        navigate(to);
      }
    }, 500);
  };

  return (
    <div
      id="nav-bar"
      style={{
        position: "sticky",
        top: 0,
        zIndex: "9999",
        width: "100%",
        height: 88,
      }}
    >
      <nav>
        <div className="nav-item">
          <NavLink
            to="/"
            onClick={(e) => {
              props.progress(e);
              NavTo("/");
            }}
          >
            <img src={logo} alt="Logo" height="50" />
            <span>Delivery Tracking</span>
          </NavLink>
          <ul className="list-item">
            <li>
              <button className="item">
                <NavLink
                  className="item-content"
                  to="/"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/");
                  }}
                >
                  Trang chủ
                </NavLink>
              </button>
            </li>
            <li>
              <button className="item dropdown">
                <NavLink className="item-content" to="#">
                  Dịch vụ
                </NavLink>
                <div className="dropdown-content">
                  <div>
                    <NavLink
                      className="dropdown-item"
                      to="/tracking"
                      onClick={(e) => {
                        props.progress(e);
                        NavTo("/tracking");
                      }}
                    >
                      Tra cứu
                    </NavLink>
                  </div>
                  <div>
                    <NavLink
                      className="dropdown-item"
                      to="Web-Essay/create-order"
                      onClick={(e) => {
                        props.progress(e);
                        NavTo("/create-order");
                      }}
                    >
                      Tạo đơn
                    </NavLink>
                  </div>
                </div>
              </button>
            </li>
            <li>
              <button className="item">
                <NavLink
                  className="item-content"
                  to="/about"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/about");
                  }}
                >
                  Về chúng tôi
                </NavLink>
              </button>
            </li>
            <li>
              <button className="item">
                <NavLink
                  className="item-content"
                  to="/contact"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/contact");
                  }}
                >
                  Liên hệ
                </NavLink>
              </button>
            </li>
          </ul>
        </div>
        <div>
          <div className="user-button">
            <ul className="list-item">
              <li>
                <button className="item">
                  <NavLink
                    className="item-content"
                    id="user"
                    to="/profile/info"
                    onClick={(e) => {
                      props.progress(e);
                      NavTo("/profile/info");
                    }}
                  >
                    <span>{`Xin chào, ${localStorage.getItem("user")}`}</span>
                  </NavLink>
                </button>
              </li>
              <li>
                <button className="item">
                  <NavLink
                    className="item-content"
                    id="logout"
                    to="/"
                    onClick={(e) => {
                      props.progress(e);
                      NavTo("logout");
                    }}
                  >
                    <span>Đăng xuất</span>
                  </NavLink>
                </button>
              </li>
            </ul>
            <NavLink
              id="login"
              to="/login"
              onClick={(e) => {
                props.progress(e);
                NavTo("/login");
              }}
            >
              <span>Đăng nhập</span>
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
}
