import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../style/MainPage.css";

const MainPage = () => {
  const [name, setName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await api.get("/auth/token", { withCredentials: true });
        const accessToken = response.data.accessToken;
        if (accessToken) {
          localStorage.setItem("Authorization", `Bearer ${accessToken}`);
        }
      } catch (error) {
        console.error("토큰 요청 실패:", error);
      }
    };

    fetchAccessToken();
  }, []);

  useEffect(() => {
    const fetchMypage = async () => {
      try {
        const token = localStorage.getItem("Authorization");
        const response = await api.get("/mypage", {
          headers: { Authorization: token || "" }
        });
        setName(response.data.name);
      } catch (error) {
        console.error("인증 실패:", error);
      } finally {
      }
    };

    fetchMypage();
  }, []);

  return (
    <div className="main-container">
      <header className="main-header">
        <div className="user-name">{name ? `${name}님` : "null"}</div>
      </header>

      <main className="main-content">
        Gavion
      </main>

      <button className="cart-button" onClick={() => navigate("/cart")}>🛒</button>

      <nav className="bottom-nav">
        <button onClick={() => navigate("/checklist")}>✅ 체크리스트</button>
        <button onClick={() => navigate("/camera")}>📷 사진찍기</button>
        <button onClick={() => navigate("/mypage")}>👤 마이페이지</button>
      </nav>
    </div>
  );
};

export default MainPage;
