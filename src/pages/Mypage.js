import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../style/MyPage.css";
import BottomNav from "../components/BottomNav";
import HomeButton from "../components/HomeButton";

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);
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
          headers: { Authorization: token || "" },
        });
        setUser(response.data.username);
        setName(response.data.name);
      } catch (error) {
        console.error("인증 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMypage();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("Authorization");
      alert("로그아웃 성공");
      navigate("/");
    } catch (error) {
      alert("로그아웃 실패");
    }
  };

  return (
    <div className="mypage-container">
      
      <div className="mypage-card">
      <header>
       <HomeButton />
      </header>
        <h2>마이 페이지</h2>

        {loading ? (
          <p>로딩 중...</p>
        ) : user ? (
          <>
            <p><strong>아이디:</strong> {user}</p>
            <p><strong>이름:</strong> {name}</p>
          </>
        ) : (
          <p>유저 정보를 불러올 수 없습니다.</p>
        )}

        <button className="logout-button" onClick={handleLogout}>로그아웃</button>
      </div>

      <BottomNav />
    </div>
  );
};

export default MyPage;
