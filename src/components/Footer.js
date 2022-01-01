import React from "react";
import "./CSS/Footer.css";

export default function Footer() {
  const url = "";
  const route = {
    tracking: url + "/tracking",
    createOrder: url + "/create-order",
    login: url + "/login",
    register: url + "/register",
  };
  return (
    <div>
      <div class="footer">
        <div class="content-footer">
          <div class="col col-1">
            <h5>About</h5>
            <p>
              Trang web này là một sản phẩm demo bài web giữa kì của:
              <br /> Đặng Hoàng Nam (51900708)
              <br /> Lê Tuấn Anh (51900698)
              <br /> Nguyễn Mạnh Hải (51900736)
            </p>
          </div>
          <div class="col col-2">
            <h5>Action</h5>
            <a className="href" href={route.tracking}>
              Tra cứu
            </a>
            <a className="href" href={route.createOrder}>
              Tạo đơn
            </a>
          </div>
          <div class="col col-3">
            <h5>Links</h5>
            <a className="href" href={route.login}>
              Đăng nhập
            </a>
            <a className="href" href={route.register}>
              Đăng ký
            </a>
          </div>
          <div class="col col-4">
            <h5>Contact</h5>
            <p>
              <i class="fa fa-home" aria-hidden="true"></i> Bình Dương - Đồng
              Nai
            </p>
            <p>
              <i class="fa fa-envelope-o" aria-hidden="true"></i>
              admin@webessay.com
            </p>
            <p>
              <i class="fa fa-phone" aria-hidden="true"></i> + 123 456 789
            </p>
          </div>
        </div>
        <div class="bottom-footer">© 2021 Copyright: deliverytracking.com</div>
      </div>
    </div>
  );
}
