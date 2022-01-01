import React from "react";
import "./CSS/Error.css";
import logo from "../images/logo.png";

export default function Error() {
  return (
    <div id="page-error">
      <div id="img-error">
        <img id="logo" src={logo} alt="logo"></img>
        <p>Delivery Tracking</p>
      </div>
      <h1>
        ERROR 404 <br />
        PAGE NOT FOUND
      </h1>
    </div>
  );
}
