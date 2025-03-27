import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/HomeButton.css";

const HomeButton = ({ label = "⬅ HOME", className = "" }) => {
  const navigate = useNavigate();

  return (
    <button className={`home-button ${className}`} onClick={() => navigate("/home")}>
      {label}
    </button>
  );
};

export default HomeButton;
