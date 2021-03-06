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
          setError("M???t kh???u m???i kh??ng kh???p");
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
                  Th??ng tin t??i kho???n
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
                  Danh s??ch v???n ????n
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
                  ?????i m???t kh???u
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
                  Xo?? t??i kho???n
                </NavLink>
              </li>
            </ul>
          </div>
          <div class="content">
            <h1>Th??ng Tin T??i Kho???n</h1>
            <div class="details">
              <div class="form-group">
                <label for="">H??? t??n: </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />
              </div>
              <div class="form-group">
                <label for="">S??? ??i???n tho???i: </label>
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
                L??u thay ?????i
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
                  Th??ng tin t??i kho???n
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
                  Danh s??ch v???n ????n
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
                  ?????i m???t kh???u
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
                  Xo?? t??i kho???n
                </NavLink>
              </li>
            </ul>
          </div>
          <div class="content">
            <h1>Danh s??ch v???n ????n</h1>
            <table>
              <thead>
                <tr>
                  <th id="vandon-stt">STT</th>
                  <th id="vandon-id">M?? v???n ????n</th>
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
                  Th??ng tin t??i kho???n
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
                  Danh s??ch v???n ????n
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
                  ?????i m???t kh???u
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
                  Xo?? t??i kho???n
                </NavLink>
              </li>
            </ul>
          </div>
          <div class="content">
            <h1>?????i M???t Kh???u</h1>
            <div class="details">
              <div class="form-group">
                <label>M???t kh???u c??: </label>
                <input
                  type="password"
                  name="old"
                  value={password.old}
                  onChange={handleChange}
                />
              </div>
              <div class="form-group">
                <label>M???t kh???u m???i: </label>
                <input
                  type="password"
                  name="new"
                  value={password.new}
                  onChange={handleChange}
                />
              </div>
              <div class="form-group">
                <label>Nh???p l???i: </label>
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
                L??u thay ?????i
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
                  Th??ng tin t??i kho???n
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
                  Danh s??ch v???n ????n
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
                  ?????i m???t kh???u
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
                  Xo?? t??i kho???n
                </NavLink>
              </li>
            </ul>
          </div>
          <div class="content">
            <h1>X??A T??I KHO???N</h1>
            <div class="details">
              <div class="form-group">
                <label for="">Nh???p m???t kh???u: </label>
                <input
                  type="password"
                  name="delete"
                  value={password.delete}
                  onChange={handleChange}
                />
              </div>
              <p style={{ margin: "20px 0" }}>
                <span style={{ color: "red", fontWeight: "bold" }}>(*)</span>{" "}
                Sau khi x??a s??? kh??ng th??? kh??i ph???c, vui l??ng ki???m tra k??
              </p>
            </div>
            <div class="block-btn">
              <button type="button" onClick={handleSubmit}>
                X??c nh???n x??a
              </button>
            </div>
            <p id="info-error">{error}</p>
          </div>
        </div>
      </div>
    );
  }
}
