import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../style/MainPage.css";
import BottomNav from "../components/BottomNav";
import ModalSearch from "./ModalSearch";
import ShoppingCalendar from "./ShoppingCalendar";

const MainPage = () => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [open, setOpen] = useState(false);

  // 더미 데이터
  const [userStats, setUserStats] = useState({
    totalSpent: 50035,
    progress: 25,
    today: "2025-04-28",
    weekTotal: 191790,
    weekSaveAmount: 27398,
  });

  // Random quotes for consumption review
  const [currentQuote, setCurrentQuote] = useState({});
  const quotes = [
    {
      text: "미래를 위해 준비할 수 있는 최고의 시간은 지금이다",
      author: "웨슬리 K. 윌콕스",
    },
    {
      text: "돈은 유일한 해답은 아니지만 치료를 만들어낸다",
      author: "머니 오쇼",
    },
    {
      text: "저축하는 습관은 번영의 첫 걸음이다",
      author: "벤자민 프랭클린",
    },
    {
      text: "성공적인 투자는 과학이 아니라 감정 관리이다",
      author: "벤저민 그레이엄",
    },
    {
      text: "돈을 모으는 것보다 더 중요한 것은 돈을 현명하게 사용하는 것이다",
      author: "로버트 기요사키",
    },
  ];

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
            Math.round((data.weekSaved / data.goalAmount) * 100)
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

    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
    fetchUserStats();
  }, []);

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const openSearchModal = () => {
    setShowSearch(true);
  };

  const closeSearchModal = () => {
    setShowSearch(false);
  };

  return (

    <div>

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
        </div>

        {/* Weekly Consumption Review Card */}
        <div className="weekly-card">
          <div className="weekly-header">
            <h2>소비 주간리뷰</h2>
            <div>＜</div>
          </div>

          <div className="date-range">＜ {userStats.today} ＞</div>

          <div className="weekly-summary-box">
            <div className="sun-icon">☀️</div>
            <div className="weekly-summary-text">오늘의 날씨</div>
          </div>

          <div className="quote-card">
            <div className="quote-tag">#소비노트</div>
            <p className="quote-text">
              {currentQuote.text}
              <br />- {currentQuote.author} -
            </p>
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
