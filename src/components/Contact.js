import React from "react";
import "./CSS/Contact.css";
import tdtu from "../images/tdtu.png";

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-content">
        <h1>Liên hệ</h1>
        <div className="member">
          <p>Đặng Hoàng Nam : 51900708@student.tdtu.edu.vn</p>
          <p>Lê Tuấn Anh : 51900698@student.tdtu.edu.vn</p>
          <p>Nguyễn Mạnh Hải : 51900736@student.tdtu.edu.vn</p>
        </div>
      </div>
      <img src={tdtu} alt="tdtu"></img>
    </div>
  );
}
