import React, { useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../style/MainPage.css";
import BottomNav from "../components/BottomNav";
import HomeButton from "../components/HomeButton";
import SearchBar from "../components/SearchBar";

const MainPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await api.get("/auth/token", {
          withCredentials: true,
        });
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

  return (
    <div className="main-container">
      <header className="main-header">
        <HomeButton />
        <button className="cart-button" onClick={() => navigate("/cart")}>
          🛒
        </button>
      </header>

      <div className="main-card">
        <SearchBar />

        <div className="main-content">
          mainPage에 검색창 넣을지 따로 할지는 원하는 대로
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MainPage;
