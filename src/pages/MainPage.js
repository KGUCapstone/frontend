import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../style/MainPage.css";
import BottomNav from "../components/BottomNav";
import ModalSearch from "./ModalSearch";
import ShoppingCalendar from "./ShoppingCalendar";

const MainPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // 더미 데이터
  const [userStats, setUserStats] = useState({
    totalSpent: 0,
    progress: 0,
    today: "",
    weekTotal: 0,
    weekSaveAmount: 0,
  });

  const getWeatherIcon = (progress) => {
    if (progress >= 80) {
      return "☀️"; // 맑음: 절약 목표 달성률이 높음
    } else if (progress >= 50) {
      return "⛅"; // 구름 조금: 절약 목표 달성률이 중간
    } else if (progress > 0) {
      return "☁️"; // 흐림: 절약 목표 달성률이 낮지만 긍정적
    } else {
      return "🌧️"; // 비 또는 먹구름: 절약 목표 달성률이 0이거나 마이너스 (아직 절약하지 못했거나 오히려 더 쓴 경우)
    }
  };

  const getConsumptionMessage = (progress) => {
    if (progress >= 90) {
      return {
        tag: "#소비마스터",
        text: "훌륭해요! 목표 달성에 거의 다다랐어요! 현명한 소비 습관이 빛을 발하고 있네요.",
      };
    } else if (progress >= 70) {
      return {
        tag: "#절약왕",
        text: "정말 잘하고 계세요! 꾸준함이 절약을 만듭니다. 조금만 더 힘내볼까요?",
      };
    } else if (progress >= 50) {
      return {
        tag: "#반짝성장",
        text: "절반 이상 달성! 소비를 돌아보는 작은 노력이 큰 변화를 만듭니다. 이대로 쭉!",
      };
    } else if (progress > 0) {
      return {
        tag: "#새로운시작",
        text: "차근차근 나아가고 있어요. 작은 절약도 모이면 큰 금액이 된답니다. 힘내세요!",
      };
    } else if (progress === 0) {
      return {
        tag: "#새로운도전",
        text: "아직 시작일 뿐이에요! 오늘부터라도 절약의 습관을 함께 만들어가요.",
      };
    } else { // progress < 0
      return {
        tag: "#소비주의보",
        text: "조금 더 주의가 필요해요. 다음 주에는 더 현명한 소비를 위해 함께 노력해봐요!",
      };
    }
  };

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        // access_token을 쿠키에서 직접 읽기
        const cookies = document.cookie.split("; ");
        const accessTokenCookie = cookies.find((cookie) =>
          cookie.startsWith("access_token=")
        );

        if (accessTokenCookie) {
          const accessToken = accessTokenCookie.split("=")[1];
          localStorage.setItem("Authorization", `Bearer ${accessToken}`);
        } else {
          console.error("access_token 쿠키가 없습니다.");
        }
      } catch (error) {
        console.error("access_token 쿠키 읽기 실패:", error);
      }
    };

    fetchAccessToken();
  }, []);

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
    const fetchUserStats = async () => {
      try {
        const res = await api.get("/mainpage/stats", {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        });
        const data = res.data;
        //console.log(data);

        setUserStats({
          totalSpent: data.totalSaved,
          progress: Math.min(
            100,
            Math.round((data.totalSaved / data.goalAmount) * 100)
          ),
          today: data.today,
          weekTotal: data.weekSpent,
          weekSaveAmount: data.weekSaved,
        });
      } catch (err) {
        console.error(
          "메인페이지 유저 통계 로딩 실패:",
          err.response?.data || err.message
        );
      }
    };
    fetchUserStats();
  }, []);

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };


  const currentConsumptionMessage = getConsumptionMessage(userStats.progress); // 메시지 미리 계산

  return (

      <div className="main-container">

        <header className="main-header">
        <div className="header-spacer" />
          <div className="logo">GAVION</div>
          <button className="cart-button" onClick={() => navigate("/cart")}>
            🛒
          </button>
        </header>

        <div className="scrollable-content">

          <div className="stats-card">

            <div className="total-saving-stats">
              <div className="stats-text">
                <p className="stats-label">전체 절약 금액</p>
                <p className="stats-amount">총 {formatNumber(userStats.totalSpent)}원</p>
                <p className="stats-detail">절약했어요.</p>
              </div>

              <div className="progress-circle">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#e6e6e6"
                      strokeWidth="10"
                  />
                  <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#5964FF"
                      strokeWidth="10"
                      strokeDasharray="339.3"
                      strokeDashoffset={339.3 - (339.3 * userStats.progress) / 100}
                      transform="rotate(-90 60 60)"
                  />

                  <text x="60" y="55" textAnchor="middle" className="progress-text">
                    {userStats.progress}%
                  </text>
                  <text x="60" y="75" textAnchor="middle" className="progress-label">
                    달성
                  </text>
                </svg>
              </div>
            </div>
          </div>

        {/* Weekly Consumption Review Card */}
        <div className="weekly-card">
          <div className="weekly-header">
            <h2>소비 주간리뷰</h2>
            <div>＜</div>
          </div>

          <div className="date-range">＜ {userStats.today} ＞</div>

          <div className="weekly-summary-box">
            <div className="sun-icon">{getWeatherIcon(userStats.progress)}</div>
            <div className="weekly-summary-text">주간의 소비 날씨</div>
          </div>

          {/* 소비 조언 카드 */}
          <div className="quote-card">
            <div className="quote-tag">{currentConsumptionMessage.tag}</div>
            <p className="quote-text">{currentConsumptionMessage.text}</p>
          </div>



          <div className="weekly-stats-box">
            <div className="stats-row">
              <span className="stats-label">주간 소비금액</span>
              <span className="stats-value">
                {formatNumber(userStats.weekTotal)}원
              </span>
            </div>
            <div className="stats-row highlight">
              <span className="stats-label">절약 금액</span>
              <span className="stats-value">
                {formatNumber(userStats.weekSaveAmount)}원 아꼈어요!
              </span>
            </div>
          </div>
        </div>

        <ShoppingCalendar />
        {/* Add some spacing at the bottom to ensure content is scrollable past the FAB */}
        <div className="bottom-space"></div>

        </div>
      <div className="search-fab" onClick={() => setOpen(true)}>
        <span className="search-icon">🔍</span>
        <span className="search-text">상품 검색하기</span>
      </div>
      {open && <ModalSearch onClose={() => setOpen(false)} />}

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
};

export default MainPage;
