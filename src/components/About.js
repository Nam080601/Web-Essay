import React from "react";
import "./CSS/About.css";
import about from "../images/about.png";

export default function About() {
  return (
    <div className="about-page">
      <div className="about-content">
        <h1>Về chúng tôi</h1>
        <div className="about-text">
          <p>Trang web này là một sản phẩm demo bài web giữa kì của:</p>
          <p>
            Đặng Hoàng Nam
            <br />
            MSSV: 51900708
          </p>
          <p>
            Lê Tuấn Anh
            <br />
            MSSV: 51900698
          </p>
          <p>
            Nguyễn Mạnh Hải
            <br />
            MSSV: 51900736
          </p>
        </div>
      </div>
      <img src={about} alt="about"></img>
    </div>
  );
}
