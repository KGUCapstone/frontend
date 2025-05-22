import React, { useState, useEffect, useCallback } from "react"; // useCallback 추가
import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "../style/ComparisonResultsPage.css";
import CartItem from "../components/CartItem2";
import api from "../api";

const ComparisonResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { results } = location.state || { results: null };

    const [selectedMall, setSelectedMall] = useState("");
    const [visibleCounts, setVisibleCounts] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const mallLabelMap = {
        "홈플러스": "홈플러스 가격 보기",
        "이마트": "이마트 가격 보기",
        "트레이더스": "트레이더스 가격 보기",
    };

    // handleAddToCart에서 직접 토큰 검사를 제거하고, api 인터셉터에 의존.
    const handleAddToCart = async (e, product) => {
        e.stopPropagation();

        const newItem = {

            id: product.productId || Date.now(), // product.id가 없으면 Date.now() 사용
            title: product.title,
            brand: product.brand || "",
            mallName: selectedMall,
            price: product.lprice, // lprice는 이미 숫자로 변환된 값이어야 함. 아니면 여기서 변환 필요.
            quantity: 1,
            image: product.image || "https://via.placeholder.com/80",
            compareItemPrice: 0 // 이 값은 CheckListPage에서 넘어오는 것이므로, 여기서는 0으로 설정
        };

        try {
            setIsLoading(true);
            const response = await api.post("/cart/add", newItem);

            if (response.status === 201 || response.status === 200) {
                alert(`${product.title}을(를) 장바구니에 담았습니다.`);
            }
        } catch (error) {
            console.error("장바구니 추가 실패:", error);

            if (error.response) {
                // Axios 인터셉터에서 이미 401/403을 처리하므로, 여기서는 일반적인 오류 메시지 처리
                alert("장바구니에 담는 중 오류가 발생했습니다: " + (error.response.data?.message || "알 수 없는 오류가 발생했습니다."));
            } else if (error.request) {
                alert("서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.");
            } else {
                alert("장바구니에 담는 중 오류가 발생했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // navigate 함수가 리렌더링될 때마다 새로운 함수를 생성하지 않도록 useCallback 사용
    const memoizedNavigate = useCallback((path) => {
        navigate(path);
    }, [navigate]);

    // results가 변경될 때만 실행
    useEffect(() => {
        if (!results) {
            memoizedNavigate("/checkListPage"); // useCallback으로 감싼 navigate 사용
        }
    }, [results, memoizedNavigate]); // memoizedNavigate를 의존성 배열에 추가

    // results.grouped가 변경될 때만 실행
    useEffect(() => {
        if (results?.grouped) {
            const firstMall = Object.keys(results.grouped)[0];
            setSelectedMall(firstMall);
            const initCounts = {};
            Object.keys(results.grouped).forEach(mall => {
                initCounts[mall] = 3; // 초기 3개만 보이도록 설정
            });
            setVisibleCounts(initCounts);
        }
    }, [results]);

    if (!results) return null;

    const { grouped, summary } = results;

    const formatPrice = (price) => {
        if (typeof price === 'number') {
            return price.toLocaleString() + "원";
        }
        // 문자열일 경우, 숫자 부분만 추출하여 포맷
        const numericPrice = parseInt(String(price).replace(/[^\d]/g, ''), 10);
        return numericPrice.toLocaleString() + "원";
    };

    const handleShowMore = (mallName) => {
        setVisibleCounts((prev) => ({
            ...prev,
            [mallName]: grouped[mallName].length,
        }));
    };

    const calculateUnitPrice = (product) => {
        const unitCount = (() => {
            const match = product.title.match(/(\d+)[\s]*[개|병|캔|봉|입|팩]/);
            return match ? parseInt(match[1], 10) : 1;
        })();

        // lprice가 문자열 '₩1,000' 형태일 수 있으므로 숫자로 변환
        const numericLprice = parseInt(String(product.lprice).replace(/[₩,]/g, ''), 10);

        return {
            unitCount,
            unitPrice: Math.round(numericLprice / unitCount)
        };
    };

    return (
        <div className="main-container">
            <header className="main-header">
                <div className="header-spacer" />
                <div className="logo" onClick={() => memoizedNavigate("/home")}>GAVION</div> {/* memoizedNavigate 사용 */}
            </header>

            <div className="scrollable-content">
                <div className="comparison-container">
                    <div className="comparison-card">
                        <div className="app-title">📌 결과 비교하기</div>

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

                        {selectedMall && grouped[selectedMall] && (
                            <div className="grouped-products-section">
                                <div className="mall-section">
                                    <h2 className="mall-title">{selectedMall}</h2>
                                    <div className="product-cards">
                                        {grouped[selectedMall]
                                            .slice(0, visibleCounts[selectedMall])
                                            .map((product, index) => {

                                                const { unitCount, unitPrice } = calculateUnitPrice(product);

                                                const enhancedProduct = {
                                                    id: index,
                                                    title: product.title,
                                                    image: product.image || "https://via.placeholder.com/80",
                                                    price: product.lprice, // 이 값은 숫자로 가정하거나 CartItem2에서 변환
                                                    quantity: 1,
                                                    brand: product.brand || "",
                                                    mallName: selectedMall,
                                                    compareItemPrice: 0, // 여기서는 비교가로 사용되지 않음
                                                    unitCount: unitCount,
                                                    unitPrice: unitPrice
                                                };

                                                return (
                                                    <div key={index} className="cart-item wrapper" onClick={() => window.location.href = product.link}>
                                                        <CartItem
                                                            item={enhancedProduct}
                                                            checked={false}
                                                            onCheckboxChange={() => { }}
                                                            onIncrease={() => { }}
                                                            onDecrease={() => { }}
                                                            showCheckbox={false}
                                                            showQuantityControls={false}
                                                        />

                                                        <div className="add-to-cart-wrapper">
                                                            <button
                                                                className="add-to-cart-button"
                                                                onClick={(e) => handleAddToCart(e, product)}
                                                                disabled={isLoading}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2">
                                                                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 13.26l.94-1.69h7.45l2.83-5H6.53l-.94-2H1v2h3l3.6 7.59-1.35 2.44c-.16.28-.25.61-.25.97 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.96-1.73h6.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49a.996.996 0 00-.89-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.45 2.6c-.16.28-.25.61-.25.97 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.96-1.73h6.45z" />
                                                                </svg>
                                                            </button>
                                                        </div>

                                                    </div>
                                                );
                                            })}
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
                            <button className="back-button" onClick={() => memoizedNavigate("/checkListPage")}> {/* memoizedNavigate 사용 */}
                                체크리스트로 돌아가기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
};

export default ComparisonResultsPage;