import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../style/MyPage.css";
import HomeButton from "../components/HomeButton";
import defaultProfile from '../assets/profile.svg';
import linechart from '../assets/linechart.svg';
import barchart from '../assets/barchart.svg';
import areachart from '../assets/areachart.svg';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  defs,
  Stop
} from "recharts";

// react-toastify import
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BottomNav from "../components/BottomNav";
import { CgEnter } from "react-icons/cg";

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [thisMonthSaved, setThisMonthSaved] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("line");
  const [showChartOptions, setShowChartOptions] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const dummyData = [
    { month: "2024.12", amount: 50000 },
    { month: "2025.1", amount: 10000 },
    { month: "2025.2", amount: 40000 },
    { month: "2025.3", amount: 55000 },
    { month: "2025.4", amount: thisMonthSaved },
  ];

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
        setUser(response.data.name);
        setThisMonthSaved(response.data.thisMonthSaved); // 절약 금액
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

  const handleChartTypeChange = (type) => {
    setChartType(type);
    setShowChartOptions(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
      setIsImageUploaded(true);
    }
  };

  const handleImageClick = () => {
    const confirmed = window.confirm("프로필 이미지를 등록하시겠습니까?");
    if (confirmed && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const goToSavedAmountPage = () => {
    navigate("/saved-amounts");
  };

  const goToHistoryPage = () => {
    navigate("/history");
  };
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
        }}>
          <p style={{ margin: 0 }}>{label}</p>
          <p style={{ margin: 0, color: "#8A64FF" }}>
            amount : {payload[0].value.toLocaleString()}원
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <>
      <header className="main-header">
        <div className="header-spacer" />
        <div className="logo" onClick={() => navigate("/home")}>GAVION</div>
      </header>

      <div className="mypage-container">
        <div className="mypage-card">
          <header className="mypage-header">
            <h2>MyPage</h2>
          </header>

          <div className="profile-section">
            <div className="profile-image" onClick={handleImageClick} style={{ cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img
                src={profileImage || defaultProfile} // 프로필 이미지가 없으면 기본 이미지로 대체
                alt="프로필"
                style={{
                  width: "80%",
                  height: "80%",
                  borderRadius: "50%",
                  objectFit: "contain", // 원 안에 이미지를 꽉 채우지 않고 비율을 유지하며 표시
                }}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                style={{ display: "none" }} // input은 보이지 않도록 설정
              />
            </div>

            <div className="profile-info">
              <h3>{user ?? "사용자명"}</h3>
              <p>
                이번 달에 <span className="saved-amount">{thisMonthSaved.toLocaleString()}원</span>을 아끼셨어요!
              </p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={180}>
              {chartType === "line" ? (
                <LineChart data={dummyData} margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8A64FF" stopOpacity={1} />
                      <stop offset="100%" stopColor="#CF77FF" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#555" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="url(#lineGradient)" // 그라데이션 적용
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 2, fill: "#CCC", stroke: "#8A64FF" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              ) : chartType === "bar" ? (
                <BarChart data={dummyData} margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8A64FF" stopOpacity={1} />
                      <stop offset="100%" stopColor="#CF77FF" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#555" }} />
                  <Tooltip content={<CustomTooltip />} />
                   <Bar dataKey="amount" fill="url(#barGradient)" />
                </BarChart>
              ) : (
                <AreaChart data={dummyData} margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8A64FF" stopOpacity={1} />
                      <stop offset="100%" stopColor="#CF77FF" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#555" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="amount" stroke="#8A64FF" fill="url(#areaGradient)" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="button-list">
            <div className="mypage-button" onClick={goToHistoryPage}>
              최근 본 상품
            </div>
            <div
              className="mypage-button chart-toggle-button"
              onClick={() => setShowChartOptions(!showChartOptions)}
            >
              테마 변경
            </div>
            <div className={`chart-options ${showChartOptions ? "open" : ""}`}>
              <button type="button" onClick={() => handleChartTypeChange("line")}>
                <img src={linechart} alt="선형 그래프" />
                <span>선형 그래프</span>
              </button>
              <button type="button" onClick={() => handleChartTypeChange("bar")}>
                <img src={barchart} alt="막대 그래프" />
                <span>막대 그래프</span>
              </button>
              <button type="button" onClick={() => handleChartTypeChange("area")}>
                <img src={areachart} alt="영역 그래프" />
                <span>영역 그래프</span>
              </button>
            </div>
            <div className="mypage-button" onClick={goToSavedAmountPage}>
              아낀 금액 통계
            </div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>

      <ToastContainer />
      <BottomNav />
    </>
  );
};

export default MyPage;
