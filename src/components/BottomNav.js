

import React from 'react';
import {  useNavigate, useLocation } from 'react-router-dom';
import {  FaCamera ,FaUser, FaCheckSquare } from 'react-icons/fa';
import '../style/BottomNav.css';


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
                <span>매장 별 비교</span>
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
