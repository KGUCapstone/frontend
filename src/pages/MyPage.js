//MyPage.js

import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../style/MyPage.css";
import BottomNav from "../components/BottomNav";
import HomeButton from "../components/HomeButton";
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from "recharts";

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dummyData = [
    { month: "2024.12", amount: 50000 },
    { month: "2025.1", amount: 10000 },
    { month: "2025.2", amount: 40000 },
    { month: "2025.3", amount: 55000 },
  ];

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
    <>
      <HomeButton />
      <div className="mypage-container">
        <div className="mypage-card">
          <header className="mypage-header">
            <h2>MyPage</h2>
          </header>

          <div className="profile-section">
            <div className="profile-image" />
            <div className="profile-info">
              <h3>{user ?? "사용자명"}</h3>
              <p>이번 달 아낀 금액</p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart
                data={dummyData}
                margin={{ top: 10, right: 20, left: 30, bottom: 0 }}
                padding={{ left: 10, right: 10 }}
              >
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#555" }} />
                <Tooltip formatter={(value) => `${value.toLocaleString()}원`} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#88e2dc"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    strokeWidth: 2,
                    fill: "#fff",
                    stroke: "#88e2dc",
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="button-list">
            <div className="mypage-button">설정</div>
            <div className="mypage-button">활동 내역</div>
            <div className="mypage-button">알림</div>
            <div className="mypage-button">개인정보 수정</div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            로그아웃 / 회원탈퇴
          </button>
        </div>
      </div>
    </>
  );
};

export default MyPage;
