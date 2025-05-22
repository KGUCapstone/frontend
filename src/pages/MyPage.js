import React, { useEffect, useState, useRef, useCallback } from "react"; // useCallback 추가
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../style/MyPage.css";
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
} from "recharts";

// react-toastify import
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BottomNav from "../components/BottomNav";

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [thisMonthSaved, setThisMonthSaved] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("line");
  const [showChartOptions, setShowChartOptions] = useState(false);
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [goalAmount, setGoalAmount] = useState("");


  const toggleGoalInput = () => {
    setShowGoalInput((prev) => !prev);
  };

  const saveGoalAmount = async () => {
    if (!goalAmount || Number(goalAmount) <= 0) {
      toast.error("유효한 목표 금액을 입력해주세요. (0보다 큰 값)");
      return;
    }

    try {
      await api.post("/mypage/goal", { goalAmount: Number(goalAmount) }); // Number로 변환

      toast.success("목표 금액이 저장되었습니다.");
      setShowGoalInput(false);
      setGoalAmount("");

    } catch (error) {
      console.error("목표 금액 저장 실패 에러:", error.response?.data || error.message);
      // 401/403 에러는 api.js 인터셉터에서 처리됨
      toast.error("저장에 실패했습니다.");
    }
  };


  // 모든 API 호출 로직을 하나의 useEffect로 통합
  useEffect(() => {
    const fetchAllMypageData = async () => {
      setLoading(true); // 로딩 시작


      // 마이페이지 기본 데이터 (사용자 이름, 이번 달 절약 금액)
      try {
        const userResponse = await api.get("/mypage"); // Axios 인터셉터가 Authorization 헤더를 자동으로 추가
        setUser(userResponse.data.name);
        setThisMonthSaved(userResponse.data.thisMonthSaved);
        console.log("마이페이지 기본 데이터 로딩 성공");
      } catch (error) {
        console.error("마이페이지 기본 데이터 로딩 실패:", error.response?.data || error.message);
        // 401/403 에러는 api.js 인터셉터에서 처리됨
        toast.error("사용자 정보를 가져오는 데 실패했습니다.");
        // 실패 시 로그인 페이지로 리다이렉트 (인터셉터에서 처리하겠지만, 명시적으로 처리할 수도 있음)
        // navigate("/");
        setLoading(false); // 로딩 종료
        return; // 실패 시 이후 API 호출 중단
      }

      //  월별 절약 금액 데이터
      try {
        const monthlyResponse = await api.get("/mypage/monthly");
        console.log("월별 데이터 응답:", monthlyResponse.data);
        setChartData(monthlyResponse.data.reverse()); // 월별 데이터 설정
        console.log("월별 절약 금액 로딩 성공");
      } catch (error) {
        console.error("월별 절약 금액 로딩 실패:", error.response?.data || error.message);
        // 401/403 에러는 api.js 인터셉터에서 처리됨
        toast.error("월별 절약 금액 데이터를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchAllMypageData();
  }, []); // 빈 의존성 배열: 컴포넌트 마운트 시 한 번만 실행

  const handleLogout = async () => {
    try {
      await api.post("/logout"); // Axios 인터셉터가 토큰 삭제 등 후처리 담당
      localStorage.removeItem("Authorization"); // 로컬 스토리지 토큰 삭제
      alert("로그아웃 성공");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error.response?.data || error.message);
      alert("로그아웃 실패: " + (error.response?.data?.message || error.message));
    }
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
    setShowChartOptions(false);
  };


  const goToSavedAmountPage = useCallback(() => {
    navigate("/saved-amounts");
  }, [navigate]);


  const goToHistoryPage = useCallback(() => {
    navigate("/history");
  }, [navigate]);

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
                <img src={defaultProfile}
                     alt="프로필"
                     style={{
                       width: "80%",
                       height: "80%",
                       borderRadius: "50%",
                       objectFit: "contain",
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
              {loading ? (
                  <div style={{ textAlign: 'center', padding: '50px' }}>차트 데이터를 로딩 중입니다...</div>
              ) : (
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
              )}
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

              <div className="mypage-button" onClick={toggleGoalInput}>
                목표 절약 금액 설정
              </div>

              {showGoalInput && (
                  <div className="goal-input-container">
                    <input
                        type="number"
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(e.target.value)}
                        placeholder="목표 금액 입력 (예: 100000)"
                        className="goal-input-field"
                    />
                    <button onClick={saveGoalAmount} className="goal-save-button">
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