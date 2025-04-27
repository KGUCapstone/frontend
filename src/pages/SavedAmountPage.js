import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../style/SavedAmountPage.css";

const SavedAmountPage = () => {
    const navigate = useNavigate();
    const [savedAmounts, setSavedAmounts] = useState([]);

    useEffect(() => {
        const fetchSavedAmounts = async () => {
            try {
                const token = localStorage.getItem("Authorization");
                const response = await api.get("/mypage/saved-amounts", {
                    headers: { Authorization: token || "" },
                });
                setSavedAmounts(response.data);
            } catch (error) {
                console.error("절약 금액 통계 불러오기 실패:", error);
            }
        };

        fetchSavedAmounts();
    }, []);

    const goBack = () => {
        navigate("/mypage");
    };

    return (
        <div className="saved-page-container">
            <h1>월별 절약 금액</h1>
            <div className="saved-list">
                {savedAmounts.length === 0 ? (
                    <p>아직 절약한 기록이 없습니다.</p>
                ) : (
                    savedAmounts.map((item, index) => (
                        <div key={index} className="saved-list-item">
                            {item.month} : {item.amount.toLocaleString()}원
                        </div>
                    ))
                )}
            </div>

            <button className="saved-back-button" onClick={goBack}>
                돌아가기
            </button>
        </div>
    );
};

export default SavedAmountPage;
