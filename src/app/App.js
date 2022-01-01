import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "../components/CSS/Responsive.css";
import Navbar from "../components/Navbar";
import Home from "../components/Home";
import Tracking from "../components/Tracking";
import CreateOrder from "../components/CreateOrder";
import Register from "../components/Register";
import Login from "../components/Login";
import Profile from "../components/Profile";
import Footer from "../components/Footer";
import About from "../components/About";
import Contact from "../components/Contact";
import Error from "../components/Error";
import ProgressBar from "../components/ProgressBar";

export default function App() {
  const [completed, setCompleted] = useState(0);
  const [bgcolor, setBgcolor] = useState("");

  const handleProgress = (e) => {
    e.preventDefault();
    setBgcolor("red");
    setCompleted(100);

    setTimeout(() => {
      setBgcolor("");
      setCompleted(0);
    }, 500);
  };

  return (
    <BrowserRouter>
      <Navbar progress={handleProgress} />
      <ProgressBar bgcolor={bgcolor} completed={completed} />
      <Routes>
        <Route path="/" element={<Home progress={handleProgress} />}></Route>
        <Route
          path="/create-order"
          element={<CreateOrder progress={handleProgress} />}
        ></Route>
        <Route
          path="/tracking"
          element={<Tracking progress={handleProgress} />}
        ></Route>
        <Route
          path="/tracking/:id"
          element={<Tracking progress={handleProgress} />}
        ></Route>
        <Route path="/about" element={<About />}></Route>
        {<Route path="/contact" element={<Contact />}></Route>}
        <Route
          path="/register"
          element={<Register progress={handleProgress} />}
        ></Route>
        <Route
          path={"/login"}
          element={<Login progress={handleProgress} />}
        ></Route>
        <Route
          path={"/profile/:action"}
          element={<Profile progress={handleProgress} />}
        ></Route>
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
