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
  const [chartData, setChartData] = useState([]);
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [goalAmount, setGoalAmount] = useState("");


  const toggleGoalInput = () => {
    setShowGoalInput((prev) => !prev);
  };

  const saveGoalAmount = async () => {
    if (!goalAmount || Number(goalAmount) <= 0) { // goalAmount가 비어있거나 0 이하인 경우
      toast.error("유효한 목표 금액을 입력해주세요. (0보다 큰 값)");
      return; // 함수 실행 중단
    }

    try {
      const token = localStorage.getItem("Authorization");

      await api.post("/mypage/goal", { goalAmount: goalAmount }, {
        headers: { Authorization: token || "" }
      });

      toast.success("목표 금액이 저장되었습니다.");
      setShowGoalInput(false);  // 입력창 닫기
      setGoalAmount("");        // 입력값 초기화
    } catch (error) {
      console.error("저장 실패 에러:", error.response?.data || error.message);
      toast.error("저장에 실패했습니다.");
    }
  };


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

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const token = localStorage.getItem("Authorization");
        const response = await api.get("/mypage/monthly", {
          headers: { Authorization: token || "" },
        });
        console.log("월별 데이터 응답:", response.data); // 확인용
        setChartData(response.data.reverse());
      } catch (error) {
        console.error("❌");
      }
    };
    fetchMonthlyData();
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


  const goToSavedAmountPage = () => {
    navigate("/saved-amounts");
  };

  const goToSavedAmountEditPage = () => {
    navigate("/saved-amount-edit");
  }

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
            <div className="profile-image" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img src={defaultProfile} // 프로필 이미지가 없으면 기본 이미지로 대체
                alt="프로필"
                style={{
                  width: "80%",
                  height: "80%",
                  borderRadius: "50%",
                  objectFit: "contain", // 원 안에 이미지를 꽉 채우지 않고 비율을 유지하며 표시
                }}
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
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: 30, bottom: 20 }}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8A64FF" stopOpacity={1} />
                        <stop offset="100%" stopColor="#CF77FF" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#555" }}
                        interval={0}
                        angle={-30}
                        textAnchor="end"
                        tickLine={{ stroke: "#ccc" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="url(#lineGradient)"
                        strokeWidth={3}
                        dot={{ r: 5, strokeWidth: 2, fill: "#CCC", stroke: "#8A64FF" }}
                        activeDot={{ r: 6 }}
                    />
                  </LineChart>
              ) : chartType === "bar" ? (
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: 30, bottom: 20 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8A64FF" stopOpacity={1} />
                        <stop offset="100%" stopColor="#CF77FF" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#555" }}
                        interval={0}
                        angle={-30}
                        textAnchor="end"
                        tickLine={{ stroke: "#ccc" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="amount" fill="url(#barGradient)" />
                  </BarChart>
              ) : (
                  <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 30, bottom: 20 }}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8A64FF" stopOpacity={1} />
                        <stop offset="100%" stopColor="#CF77FF" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#555" }}
                        interval={0}
                        angle={-30}
                        textAnchor="end"
                        tickLine={{ stroke: "#ccc" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="amount" stroke="#8A64FF" fill="url(#areaGradient)" />
                  </AreaChart>
              )}
            </ResponsiveContainer>
          </div>


          <div className="button-list">
            <div className="mypage-button" onClick={goToHistoryPage}>
              이전 장바구니 기록
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

            <div className="mypage-button" onClick={toggleGoalInput}>
              목표 절약 금액 설정
            </div>

            {showGoalInput && (
                <div style={{ marginTop: "10px", display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                      type="number"
                      value={goalAmount}
                      onChange={(e) => setGoalAmount(e.target.value)}
                      placeholder="목표 금액 입력 (예: 100000)"
                      style={{ padding: "8px", width: "60%" }}
                  />
                  <button onClick={saveGoalAmount} style={{ padding: "8px 12px" }}>
                    확인
                  </button>
                </div>
            )}



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
