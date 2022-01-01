import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./CSS/Profile.css";
import user from "../images/user.png";

export default function Profile(props) {
  const navigate = useNavigate();
  const { action } = useParams();
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [password, setPassword] = useState({
    old: "",
    new: "",
    new2: "",
    delete: "",
  });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    } else {
      axios
        .post(
          "http://localhost:8000/api/get_profile.php",
          JSON.stringify({ user: localStorage.getItem("user") })
        )
        .then((response) => {
          const profile = response.data.profile;
          setProfile({
            name: profile.name,
            phone: profile.phone,
            email: profile.email,
          });
          if (action === "list-order") {
            axios
              .get("http://localhost:8000/api/get_order_by_user.php", {
                params: { user: profile.phone },
              })
              .then((response) => {
                setOrders(response.data.data);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [action, navigate]);

  const handleChange = (e) => {
    document.getElementById("info-error").style.display = "none";
    if (action === "info") {
      setProfile({
        ...profile,
        [e.target.name]: e.target.value,
      });
    }
    if (action === "password") {
      setPassword({
        ...password,
        [e.target.name]: e.target.value,
      });
    }
    if (action === "delete") {
      setPassword({
        ...password,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    props.progress(e);

    setTimeout(() => {
      if (action === "info") {
        const data = {
          name: profile.name,
          email: profile.email,
        };
        axios
          .put(
            "http://localhost:8000/api/change_info.php",
            JSON.stringify(data),
            {
              params: {
                username: profile.phone,
              },
            }
          )
          .then((response) => {
            console.log(response.data);
            const profile = response.data.profile;
            localStorage.setItem("user", profile.name);
            setProfile({
              name: profile.name,
              phone: profile.phone,
              email: profile.email,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
      if (action === "password") {
        if (password.new !== password.new2) {
          setError("Mật khẩu mới không khớp");
          document.getElementById("info-error").style.display = "block";
          return;
        }
        const data = {
          old: password.old,
          new: password.new,
        };
        axios
          .put(
            "http://localhost:8000/api/change_password.php",
            JSON.stringify(data),
            {
              params: {
                username: profile.phone,
              },
            }
          )
          .then((response) => {
            console.log(response.data);
            localStorage.clear();
            navigate("/");
          })
          .catch((err) => {
            console.log(err);
          });
      }
      if (action === "delete") {
        axios
          .post(
            "http://localhost:8000/api/delete_profile.php",
            JSON.stringify({
              username: profile.phone,
              password: password.delete,
            })
          )
          .then((response) => {
            if (response.data.code === 0) {
              localStorage.clear();
              navigate("/");
            } else {
              setError(response.data.message);
              document.getElementById("info-error").style.display = "block";
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, 500);
  };

  const handleDelete = (id) => {
    setTimeout(() => {
      axios
        .delete("http://localhost:8000/api/delete_order.php", {
          params: {
            id: id,
          },
        })
        .then((response) => {
          console.log(response);
          document.getElementById(id).remove();
        })
        .catch((err) => {
          console.log(err);
        });
    }, 500);
  };

  const NavTo = (to) => {
    setTimeout(() => {
      if (to === "logout") {
        localStorage.clear();
      } else {
        navigate(to);
      }
    }, 500);
  };

  const ListOrder = [];
  if (orders) {
    for (let i = 0; i < orders.length; i++) {
      ListOrder.push(
        <tr id={orders[i].id}>
          <td>{i}</td>
          <td>{orders[i].id}</td>
          <td>
            <button
              type="button"
              class="btn-view"
              onClick={(e) => {
                props.progress(e);
                NavTo("/tracking/" + orders[i].id);
              }}
            >
              <i class="fas fa-info"></i>
            </button>
            <button
              type="button"
              class="btn-delete"
              onClick={(e) => {
                props.progress(e);
                handleDelete(orders[i].id);
              }}
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      );
    }
  }

  if (action === "info") {
    return (
      <div>
        <div class="block-profile">
          <div class="dashboard">
            <div class="img">
              <img src={user} alt="avatar" />
            </div>
            <ul class="menu">
              <li>
                <NavLink
                  to="/profile/info"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/profile/info");
                  }}
                >
                  Thông tin tài khoản
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile/list-order"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/profile/list-order");
                  }}
                >
                  Danh sách vận đơn
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile/password"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/profile/password");
                  }}
                >
                  Đổi mật khẩu
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile/delete"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/profile/delete");
                  }}
                >
                  Xoá tài khoản
                </NavLink>
              </li>
            </ul>
          </div>
          <div class="content">
            <h1>Thông Tin Tài Khoản</h1>
            <div class="details">
              <div class="form-group">
                <label for="">Họ tên: </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />
              </div>
              <div class="form-group">
                <label for="">Số điện thoại: </label>
                <input
                  readonly="readonly"
                  type="number"
                  value={profile.phone}
                />
              </div>
              <div class="form-group">
                <label for="">Email: </label>
                <input
                  type="text"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div class="block-btn">
              <button type="button" onClick={handleSubmit}>
                Lưu thay đổi
              </button>
            </div>
            <p id="info-error">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  if (action === "list-order") {
    return (
      <div>
        <div class="block-profile">
          <div class="dashboard">
            <div class="img">
              <img src={user} alt="avatar" />
            </div>
            <ul class="menu">
              <li>
                <NavLink
                  to="/profile/info"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/profile/info");
                  }}
                >
                  Thông tin tài khoản
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile/list-order"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/profile/list-order");
                  }}
                >
                  Danh sách vận đơn
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile/password"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/profile/password");
                  }}
                >
                  Đổi mật khẩu
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile/delete"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/profile/delete");
                  }}
                >
                  Xoá tài khoản
                </NavLink>
              </li>
            </ul>
          </div>
          <div class="content">
            <h1>Danh sách vận đơn</h1>
            <table>
              <thead>
                <tr>
                  <th id="vandon-stt">STT</th>
                  <th id="vandon-id">Mã vận đơn</th>
                  <th id="vandon-action">Action</th>
                </tr>
              </thead>
              <tbody>{ListOrder}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  if (action === "password") {
    return (
      <div>
        <div class="block-profile">
          <div class="dashboard">
            <div class="img">
              <img src={user} alt="avatar" />
            </div>
            <ul class="menu">
              <li>
                <NavLink
                  to="/profile/info"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/profile/info");
                  }}
                >
                  Thông tin tài khoản
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile/list-order"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/profile/list-order");
                  }}
                >
                  Danh sách vận đơn
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile/password"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/profile/password");
                  }}
                >
                  Đổi mật khẩu
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile/delete"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/profile/delete");
                  }}
                >
                  Xoá tài khoản
                </NavLink>
              </li>
            </ul>
          </div>
          <div class="content">
            <h1>Đổi Mật Khẩu</h1>
            <div class="details">
              <div class="form-group">
                <label>Mật khẩu cũ: </label>
                <input
                  type="password"
                  name="old"
                  value={password.old}
                  onChange={handleChange}
                />
              </div>
              <div class="form-group">
                <label>Mật khẩu mới: </label>
                <input
                  type="password"
                  name="new"
                  value={password.new}
                  onChange={handleChange}
                />
              </div>
              <div class="form-group">
                <label>Nhập lại: </label>
                <input
                  type="password"
                  name="new2"
                  value={password.new2}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div class="block-btn">
              <button type="button" onClick={handleSubmit}>
                Lưu thay đổi
              </button>
            </div>
            <p id="info-error">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  if (action === "delete") {
    return (
      <div>
        <div class="block-profile">
          <div class="dashboard">
            <div class="img">
              <img src={user} alt="avatar" />
            </div>
            <ul class="menu">
              <li>
                <NavLink
                  to="/profile/info"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/profile/info");
                  }}
                >
                  Thông tin tài khoản
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile/list-order"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/profile/list-order");
                  }}
                >
                  Danh sách vận đơn
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile/password"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/profile/password");
                  }}
                >
                  Đổi mật khẩu
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile/delete"
                  onClick={(e) => {
                    props.progress(e);
                    NavTo("/profile/delete");
                  }}
                >
                  Xoá tài khoản
                </NavLink>
              </li>
            </ul>
          </div>
          <div class="content">
            <h1>XÓA TÀI KHOẢN</h1>
            <div class="details">
              <div class="form-group">
                <label for="">Nhập mật khẩu: </label>
                <input
                  type="password"
                  name="delete"
                  value={password.delete}
                  onChange={handleChange}
                />
              </div>
              <p style={{ margin: "20px 0" }}>
                <span style={{ color: "red", fontWeight: "bold" }}>(*)</span>{" "}
                Sau khi xóa sẽ không thể khôi phục, vui lòng kiểm tra kĩ
              </p>
            </div>
            <div class="block-btn">
              <button type="button" onClick={handleSubmit}>
                Xác nhận xóa
              </button>
            </div>
            <p id="info-error">{error}</p>
          </div>
        </div>
      </div>
    );
  }
}
