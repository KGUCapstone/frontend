import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomeButton from "../components/HomeButton";
import BottomNav from "../components/BottomNav";
import "../style/ComparisonResultsPage.css";

const ComparisonResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { results } = location.state || { results: null };

    // Redirect if no results available
    if (!results) {
        navigate("/checkListPage");
        return null;
    }

    const { grouped, summary } = results;

    const formatPrice = (price) => {
        return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
    };

    return (
        <div className="main-container">
            <HomeButton />

            <div className="comparison-container">
                <div className="comparison-card">
                    <div className="app-title">상품 비교 결과</div>

                    {/* Summary Section */}
                    <div className="summary-section">
                        <h2 className="section-title">비교 요약</h2>
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
                                {Object.entries(summary || {}).map(([mallName, data]) => (
                                    <tr key={mallName}>
                                        <td>{mallName}</td>
                                        <td>{formatPrice(data.totalPrice)}</td>
                                        <td>
                                            {Object.entries(data.includes || {}).map(([query, included]) => (
                                                <div key={query} className="includes-item">
                                                    <span className="query-name">{query}</span>
                                                    <span className={`included-status ${included === 'O' ? 'included' : 'excluded'}`}>
                              {included}
                            </span>
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Grouped Products Section */}
                    {Object.entries(grouped || {}).map(([mallName, products]) => (
                        <div key={mallName} className="mall-section">
                            <h2 className="mall-title">{mallName}</h2>
                            <div className="product-cards">
                                {products.map((product, index) => (
                                    <div key={index} className="product-card">
                                        <div className="product-image">
                                            {product.image && (
                                                <img src={product.image} alt={product.title} />
                                            )}
                                        </div>
                                        <div className="product-details">
                                            <h3 className="product-title">{product.title}</h3>
                                            <p className="product-query">검색어: {product.query}</p>
                                            <p className="product-price">{product.priceInfo || formatPrice(product.lprice)}</p>
                                            <p className="product-brand">{product.brand || product.maker}</p>
                                            <a
                                                href={product.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="product-link"
                                            >
                                                상품 보기
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="back-button-container">
                        <button
                            className="back-button"
                            onClick={() => navigate("/checkListPage")}
                        >
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