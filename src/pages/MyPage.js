import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../style/MyPage.css";
import HomeButton from "../components/HomeButton";
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
} from "recharts";

// react-toastify import
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    { month: "2025.4", amount: thisMonthSaved.toLocaleString()},
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
  
  return (
    <>
      <HomeButton />
      <div className="mypage-container">
        <div className="mypage-card">
          <header className="mypage-header">
            <h2>MyPage</h2>
          </header>

          <div className="profile-section">
          <div className="profile-image"onClick={handleImageClick}style={{ cursor: "pointer" }}>
            {profileImage && (
              <img
               src={profileImage}
              alt="프로필"
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
          )}
          <input type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          </div>


            <div className="profile-info">
              <h3>{user ?? "사용자명"}</h3>
              <p>이번 달 아낀 금액: {thisMonthSaved.toLocaleString()}원</p>
            </div>
          </div>

          {/* 차트 컨테이너 */}
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={180}>
              {chartType === "line" ? (
                <LineChart data={dummyData} margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#555" }} />
                  <Tooltip formatter={(value) => `${value.toLocaleString()}원`} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#88e2dc"
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "#88e2dc" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              ) : chartType === "bar" ? (
                <BarChart data={dummyData} margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#555" }} />
                  <Tooltip formatter={(value) => `${value.toLocaleString()}원`} />
                  <Bar dataKey="amount" fill="#88e2dc" />
                </BarChart>
              ) : (
                <AreaChart data={dummyData} margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#555" }} />
                  <Tooltip formatter={(value) => `${value.toLocaleString()}원`} />
                  <Area type="monotone" dataKey="amount" stroke="#88e2dc" fill="#e8f8f5" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* 차트 변경 버튼 */}
          <div className="button-list">
            <div className="mypage-button" onClick={goToHistoryPage} >최근 본 상품</div>
            <div className="mypage-button chart-toggle-button" onClick={() => setShowChartOptions(!showChartOptions)}>
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
            <div className="mypage-button">비밀번호 변경</div>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            로그아웃 / 회원탈퇴
          </button>
        </div>
      </div>

      {/* ToastContainer 추가 */}
      <ToastContainer />
    </>
  );
};

export default MyPage;
