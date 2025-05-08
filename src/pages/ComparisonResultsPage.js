import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomeButton from "../components/HomeButton";
import BottomNav from "../components/BottomNav";
import "../style/ComparisonResultsPage.css";

const ComparisonResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { results } = location.state || { results: null };

    const [selectedMall, setSelectedMall] = useState("");
    const [visibleCounts, setVisibleCounts] = useState({});

    const mallLabelMap = {
        "홈플러스": "홈플러스 가격 보기",
        "이마트": "이마트 가격 보기",
        "CU편의점": "CU편의점 가격 보기",
    };

    useEffect(() => {
        if (!results) {
            navigate("/checkListPage");
        }
    }, [results, navigate]);

    useEffect(() => {
        if (results?.grouped) {
            const firstMall = Object.keys(results.grouped)[0];
            setSelectedMall(firstMall);
            const initCounts = {};
            Object.keys(results.grouped).forEach(mall => {
                initCounts[mall] = 3;
            });
            setVisibleCounts(initCounts);
        }
    }, [results]);

    if (!results) return null;

    const { grouped, summary } = results;
    const formatPrice = (price) => price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";

    const handleShowMore = (mallName) => {
        setVisibleCounts((prev) => ({
            ...prev,
            [mallName]: grouped[mallName].length,
        }));
    };

    return (
        <div className="main-container">
            <HomeButton />
            <div className="comparison-container">
                <div className="comparison-card">
                    <div className="app-title">🚩결과 비교하기</div>

                    {/* 🏷️ 새 매장 선택 버튼 그룹 (스타일 반영됨) */}
                    <div className="mall-selector-text">
                        {Object.keys(grouped).map((mallName) => (
                            <div
                                key={mallName}
                                className={`mall-text-option ${selectedMall === mallName ? "selected-text" : ""}`}
                                onClick={() => setSelectedMall(mallName)}
                            >
                                <span className="icon">➡️</span> {mallLabelMap[mallName] || mallName}
                            </div>
                        ))}
                    </div>

                    {/* 📊 비교 요약 */}
                    <div className="summary-section">
                        <h2 className="section-title">🖋 요약</h2>
                        <div className="summary-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>매장명</th>
                                        <th>총 가격</th>
                                        <th>상품 포함 여부</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedMall && summary[selectedMall] && (
                                        <tr>
                                            <td>{selectedMall}</td>
                                            <td>{formatPrice(summary[selectedMall].totalPrice)}</td>
                                            <td>
                                                {Object.entries(summary[selectedMall].includes || {}).map(([query, included]) => (
                                                    <div key={query} className="includes-item">
                                                        <span className="query-name">{query}</span>
                                                        <span className={`included-status ${included === 'O' ? 'included' : 'excluded'}`}>
                                                            {included}
                                                        </span>
                                                    </div>
                                                ))}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 🛍️ 상품 리스트 */}
                    {selectedMall && grouped[selectedMall] && (
                        <div className="grouped-products-section">
                            <div className="mall-section">
                                <h2 className="mall-title">{selectedMall}</h2>
                                <div className="product-cards">
                                    {grouped[selectedMall]
                                        .slice(0, visibleCounts[selectedMall])
                                        .map((product, index) => (
                                            <div key={index} className="product-card" onClick={() => window.location.href = product.link}>
                                                <div className="product-image">
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.title} />
                                                    ) : (
                                                        <div className="no-image">이미지 없음</div>
                                                    )}
                                                </div>
                                                <div className="product-details">
                                                    <h3 className="product-title">{product.title}</h3>
                                                    <p className="product-price">{product.priceInfo || formatPrice(product.lprice)}</p>
                                                    <button className="add-to-cart-button" onClick={() => alert(`${product.title}을(를) 장바구니에 담았습니다.`)}>
                                                        장바구니 담기
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                {grouped[selectedMall].length > 3 &&
                                    visibleCounts[selectedMall] < grouped[selectedMall].length && (
                                        <div className="more-button-container">
                                            <button
                                                className="more-button"
                                                onClick={() => handleShowMore(selectedMall)}
                                            >
                                                더보기
                                            </button>
                                        </div>
                                    )}
                            </div>
                        </div>
                    )}

                    <div className="back-button-container">
                        <button className="back-button" onClick={() => navigate("/checkListPage")}>
                            체크리스트로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
};

export default ComparisonResultsPage;
