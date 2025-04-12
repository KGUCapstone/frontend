import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../style/BottomNav.css';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-nav">
      <button
        className={isActive("/history") ? "active" : ""}
        onClick={() => navigate("/history")}
      >
        ✅<br />기록
      </button>
      <button
        className={isActive("/camera") ? "active" : ""}
        onClick={() => navigate("/camera")}
      >
        📷<br />사진찍기
      </button>
      <button
        className={isActive("/mypage") ? "active" : ""}
        onClick={() => navigate("/mypage")}
      >
        👤<br />마이페이지
      </button>
    </nav>
  );
};

export default BottomNav;
