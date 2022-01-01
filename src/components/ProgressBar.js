import React from "react";

export default function ProgressBar(props) {
  const { bgcolor, completed } = props;
  let trans = "width 500ms ease-in-out";

  if (completed === 0) {
    trans = "";
  }

  const containerStyles = {
    position: "sticky",
    top: 88,
    zIndex: "0",
    height: 5,
    width: "100%",
    backgroundColor: "",
  };

  const fillerStyles = {
    height: "100%",
    width: `${completed}%`,
    backgroundColor: bgcolor,
    transition: trans,
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span></span>
      </div>
    </div>
  );
}
