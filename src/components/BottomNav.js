

import React from 'react';
import {  useNavigate, useLocation } from 'react-router-dom';
import {  FaCamera ,FaUser, FaCheckSquare } from 'react-icons/fa';
import '../style/BottomNav.css';

const HomeScreen = () => <div>홈 화면</div>;
const RankingScreen = () => <div>랭킹 화면</div>;
const StatisticsScreen = () => <div>통계 화면</div>;
const MyPageScreen = () => <div>마이페이지 화면</div>;

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bottom-nav">


            <button
                className={isActive("/checkListPage") ? "active" : ""}
                onClick={() => navigate("/checkListPage")}
            >
                <FaCheckSquare size={24} />
                <span>체크리스트</span>
            </button>

            <div className="center-button">
                <button
                    className={isActive("/camera") ? "active center" : "center"}
                    onClick={() => navigate("/camera")}
                >
                    <FaCamera size={30} />
                </button>
            </div>

            <button
                className={isActive("/mypage") ? "active" : ""}
                onClick={() => navigate("/mypage")}
            >
                <FaUser size={24} />
                <span>마이페이지</span>
            </button>
        </nav>
    );
};


export default BottomNav;
