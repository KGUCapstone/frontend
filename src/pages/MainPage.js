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

  const [userStats, setUserStats] = useState({
    totalSpent: 0,
    progress: 0,
    today: "",
    weekTotal: 0,
    weekSaveAmount: 0,
  });

  const getWeatherIcon = (progress) => {
    if (progress >= 80) {
      return "☀️";
    } else if (progress >= 50) {
      return "⛅";
    } else if (progress > 0) {
      return "☁️";
    } else {
      return "🌧️";
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
    } else {
      return {
        tag: "#소비주의보",
        text: "조금 더 주의가 필요해요. 다음 주에는 더 현명한 소비를 위해 함께 노력해봐요!",
      };
    }
  };

  // 기존의 세 가지 useEffect를 하나의 useEffect로 통합 및 순서 보장
  useEffect(() => {
    const initializeAppData = async () => {
      let currentAccessToken = localStorage.getItem("Authorization"); // 현재 로컬 스토리지에 있는 토큰 확인

      // 1. 쿠키에서 access_token을 읽어와 localStorage에 설정 (최초 로딩 또는 페이지 새로고침 시)
      if (!currentAccessToken || currentAccessToken === "Bearer null") { // 토큰이 없거나 유효하지 않은 경우
        try {
          const cookies = document.cookie.split("; ");
          const accessTokenCookie = cookies.find((cookie) =>
              cookie.startsWith("access_token=")
          );

          if (accessTokenCookie) {
            const accessToken = accessTokenCookie.split("=")[1];
            currentAccessToken = `Bearer ${accessToken}`; // 현재 토큰 업데이트
            localStorage.setItem("Authorization", currentAccessToken);
            console.log("access_token 쿠키에서 읽어와 설정 완료.");
          } else {
            console.warn("access_token 쿠키가 없습니다. /auth/token으로 시도합니다.");
            // 쿠키에 없으면 /auth/token 엔드포인트로 새 토큰 요청
            const response = await api.get("/auth/token", {
              withCredentials: true,
            });
            const newAccessToken = response.data.accessToken;
            if (newAccessToken) {
              currentAccessToken = `Bearer ${newAccessToken}`;
              localStorage.setItem("Authorization", currentAccessToken);
              console.log("/auth/token을 통해 새로운 액세스 토큰 발급 및 설정 완료.");
            } else {
              console.error("/auth/token 응답에 accessToken이 없습니다.");
            }
          }
        } catch (error) {
          console.error("토큰 초기 설정 실패:", error);
          // 토큰 설정 실패 시 로그인 페이지로 리다이렉트
          localStorage.removeItem("Authorization");
          alert("세션이 만료되었거나 토큰을 가져오지 못했습니다. 다시 로그인해주세요.");
          window.location.href = "/";
          return; // 이후 API 호출을 막음
        }
      }

      // 2. 액세스 토큰이 설정된 후 사용자 통계 데이터를 가져옴
      if (currentAccessToken && currentAccessToken !== "Bearer null") {
        try {
          const res = await api.get("/mainpage/stats", {
            headers: {
              Authorization: currentAccessToken, // 최신 토큰 사용
            },
          });
          const data = res.data;
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
          console.log("메인페이지 유저 통계 로딩 성공.");
        } catch (err) {
          console.error(
              "메인페이지 유저 통계 로딩 실패:",
              err.response?.data || err.message
          );
          // 통계 로딩 실패 (예: 401) 시 Axios 인터셉터가 로그인 페이지로 리다이렉트 처리할 것임.
        }
      } else {
        console.warn("Authorization 토큰이 없어 유저 통계를 가져오지 못했습니다.");
        // 토큰이 없으므로 로그인 페이지로 리다이렉트 필요 (인터셉터가 처리할 수도 있음)
        localStorage.removeItem("Authorization");
        alert("인증 정보가 없습니다. 다시 로그인해주세요.");
        window.location.href = "/";
      }
    };

    initializeAppData();
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const currentConsumptionMessage = getWeatherIcon(userStats.progress); // 메시지 미리 계산

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
            </div>

            <div className="date-range">＜ {userStats.today} ＞</div>

            <div className="weekly-summary-box">
              <div className="sun-icon">{currentConsumptionMessage}</div>
              <div className="weekly-summary-text">주간의 소비 날씨</div>
            </div>

            {/* 소비 조언 카드 */}
            <div className="quote-card">
              <div className="quote-tag">{getConsumptionMessage(userStats.progress).tag}</div>
              <p className="quote-text">{getConsumptionMessage(userStats.progress).text}</p>
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