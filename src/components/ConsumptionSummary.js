import React, { useState } from "react";
import "../style/ConsumptionSummary.css";

const getWeatherIcon = (progress) => {
    if (progress >= 90) return "☀️";
    if (progress >= 70) return "🌤️";
    if (progress >= 50) return "⛅";
    if (progress >= 30) return "🌥️";
    if (progress >= 10) return "☁️";
    return "🌧️";
};

const getConsumptionMessage = (progress) => {
    if (progress >= 90) return { tag: "#소비마스터", text: "훌륭해요! 목표 달성에 거의 다다랐어요! 현명한 소비 습관이 빛을 발하고 있어요." };
    if (progress >= 70) return { tag: "#절약왕", text: "정말 잘하고 계세요! 꾸준한 절약 습관이 멋져요. 조금만 더 힘내요!" };
    if (progress >= 50) return { tag: "#반짝성장", text: "절반 이상 달성! 작지만 의미 있는 변화가 시작되고 있어요." };
    if (progress >= 30) return { tag: "#조금씩절약", text: "천천히 가도 괜찮아요. 지금처럼만 꾸준히 이어간다면 좋은 결과가 있을 거예요!" };
    if (progress >= 10) return { tag: "#첫걸음", text: "작은 발걸음이 큰 도약으로 이어져요. 계속 함께 걸어가봐요!" };
    if (progress === 0) return { tag: "#새로운도전", text: "아직 시작일 뿐이에요! 오늘부터 함께 절약 습관을 만들어볼까요?" };
    return { tag: "#소비주의보", text: "소비에 조금 더 주의가 필요해요. 다음 주엔 더 현명하게 도전해봐요!" };
};

const ConsumptionSummary = ({ userStats }) => {
    const [showModal, setShowModal] = useState(false);
    const handleBoxClick = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const { progress } = userStats;
    const weatherIcon = getWeatherIcon(progress);
    const { tag, text } = getConsumptionMessage(progress);

    return (
        <div className="consumption-summary" onClick={handleBoxClick}>
            <div className="weekly-summary-box">
                <div className="sun-icon">{weatherIcon}</div>
                <div className="weekly-summary-text">소비의 날씨</div>
            </div>

            <div className="quote-card">
                <div className="quote-tag">{tag}</div>
                <p className="quote-text">{text}</p>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">소비 수준별 태그 안내</h2>
                        <ul className="tag-guide-list">
                            <li><span>🌧️ <strong>0 이하:</strong></span> #소비주의보</li>
                            <li><span>☁️ <strong>0:</strong></span> #새로운도전</li>
                            <li><span>🌥️ <strong>10 이상:</strong></span> #첫걸음</li>
                            <li><span>🌥️ <strong>30 이상:</strong></span> #조금씩절약</li>
                            <li><span>⛅ <strong>50 이상:</strong></span> #반짝성장</li>
                            <li><span>🌤️ <strong>70 이상:</strong></span> #절약왕</li>
                            <li><span>☀️ <strong>90 이상:</strong></span> #소비마스터</li>
                        </ul>
                        <button className="close-btn" onClick={closeModal}>닫기</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ConsumptionSummary;
