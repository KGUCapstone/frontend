import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCamera, FaUser, FaCheckSquare, FaHome } from 'react-icons/fa';
import '../style/BottomNav.css';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;
    const isHomePage = location.pathname === '/home';

    return (
        <nav className="bottom-nav">
            <div className="nav-left">
                {isHomePage ? (
                    <button
                        className={isActive("/checkListPage") ? "active" : ""}
                        onClick={() => navigate("/checkListPage")}
                    >
                        <FaCheckSquare size={24} />
                        <span>매장별 비교</span>
                    </button>
                ) : (
                    <button
                        className={isActive("/home") ? "active" : ""}
                        onClick={() => navigate("/home")}
                    >
                        <FaHome size={28} />
                        <span>홈</span>
                    </button>
                )}
            </div>

            <div className="center-button">
                <button
                    className={isActive("/camera") ? "active center" : "center"}
                    onClick={() => navigate("/camera")}
                >
                    <FaCamera size={30} />
                </button>
            </div>

            <div className="nav-right">
                <button
                    className={isActive("/mypage") ? "active" : ""}
                    onClick={() => navigate("/mypage")}
                >
                    <FaUser size={24} />
                    <span>마이페이지</span>
                </button>
            </div>
        </nav>
    );
};

export default BottomNav;