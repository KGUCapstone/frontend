import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../style/MonthHistoryPage.css";
import "../style/HoverUnderline.css";
import { FaTrash } from "react-icons/fa";

const MonthHistoryPage = () => {
    const navigate = useNavigate();
    const [cartList, setCartList] = useState([]);
    const [savedAmounts, setSavedAmounts] = useState([]);
    const [expandedMonths, setExpandedMonths] = useState({});
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedCarts, setSelectedCarts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cartRes = await api.post("/cart/history");
                const savedRes = await api.get("/mypage/saved-amounts", {
                    headers: { Authorization: localStorage.getItem("Authorization") || "" },
                });

                setCartList(cartRes.data);
                setSavedAmounts(savedRes.data);
            } catch (error) {
                console.error("데이터 불러오기 실패:", error);
            }
        };
        fetchData();
    }, []);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return isNaN(d)
            ? "날짜 없음"
            : `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d
                .getDate()
                .toString()
                .padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;
    };

    const groupByMonth = () => {
        const grouped = {};
        cartList.forEach((cart) => {
            const d = new Date(cart.createdAt);
            const key = `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, "0")}`;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(cart);
        });
        return grouped;
    };

    const savedMap = savedAmounts.reduce((map, entry) => {
        map[entry.month] = entry.amount;
        return map;
    }, {});

    const toggleMonth = (monthKey) => {
        setExpandedMonths((prev) => ({
            ...prev,
            [monthKey]: !prev[monthKey],
        }));
    };

    const handleCheckboxChange = (cartId) => {
        setSelectedCarts((prev) =>
            prev.includes(cartId) ? prev.filter((id) => id !== cartId) : [...prev, cartId]
        );
    };

    const handleDeleteModeToggle = async () => {
        if (deleteMode && selectedCarts.length > 0) {
            try {
                const body = selectedCarts.map((cartId) => ({ cartId }));

                await api.post("/cart/removeHistory", body, {
                    headers: { Authorization: localStorage.getItem("Authorization") },
                });

                alert("삭제가 완료되었습니다.");
                window.location.reload();
            } catch (error) {
                console.error("삭제 실패:", error);
                alert("삭제에 실패했습니다.");
            }
        }
        setDeleteMode(!deleteMode);
        setSelectedCarts([]);
    };

    const handleGoBack = () => {
        navigate("/mypage");
    };

    const grouped = groupByMonth();
    const sortedMonths = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

    const getSavedAmount = (monthKey) => {
        const [year, month] = monthKey.split(".");
        return savedMap[`${year}.${parseInt(month, 10)}`];
    };

    return (
        <div className="cart-container"
             style={{
                 marginTop: "70px",

             }}
        >
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    width: 100 + "%",

                }}
            >

                <div className="month-history-header-fixed">
                    <button onClick={handleGoBack} className="back-button">
                        ← 돌아가기
                    </button>
                    <button onClick={handleDeleteModeToggle} className="delete-button">
                        {deleteMode ? "삭제" : <FaTrash size={16} />}
                    </button>
                </div>
            </div>



            <h1 className="month-history-title">월별 장바구니 기록</h1>

            {sortedMonths.map((monthKey) => {
                let items = grouped[monthKey];

                items.sort((a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return dateB.getTime() - dateA.getTime(); // 최신순 정렬
                });

                const isExpanded = expandedMonths[monthKey];
                const visibleItems = isExpanded ? items : items.slice(0, 3);
                const savedAmount = getSavedAmount(monthKey);

                return (
                    <div key={monthKey} style={{ marginBottom: "30px" }}>
                        <h2 className="month-group-title">
                            <span>📅 {monthKey.replace(".", "년 ")}월</span>
                            {savedAmount != null && (
                                <span
                                    style={{
                                        color: "#2b8a3e",
                                        fontSize: "15px",
                                        fontWeight: "500",
                                    }}
                                >
                                  💰 절약: {savedAmount.toLocaleString()}원
                                </span>
                            )}
                        </h2>

                        {visibleItems.map((cart) => (
                            <div
                                key={cart.cartId}
                                className="cart-history-summary hover-underline"
                                onClick={() => !deleteMode && navigate(`/history/${cart.cartId}`)}
                            >
                                {deleteMode && (
                                    <input
                                        type="checkbox"
                                        checked={selectedCarts.includes(cart.cartId)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleCheckboxChange(cart.cartId);
                                        }}
                                        style={{
                                            marginRight: "15px" ,
                                            transform: "scale(2)",
                                        }}
                                    />
                                )}
                                <img
                                    src={cart.thumbnailUrl || "https://via.placeholder.com/60"}
                                    alt="썸네일"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        marginRight: "12px",
                                    }}
                                />
                                <div style={{ flexGrow: 1 }}>
                                    <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{cart.name}</div>
                                    <div style={{ fontSize: "12px", color: "#777" }}>{formatDate(cart.createdAt)}</div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontWeight: "bold" }}>총 {cart.totalQuantity || 1}개</div>
                                    <div style={{ color: "#555" }}>₩{(cart.totalPrice || 0).toLocaleString()}</div>
                                </div>
                            </div>
                        ))}

                        {items.length > 3 && (
                            <button
                                onClick={() => toggleMonth(monthKey)}
                                className="more-toggle-btn"
                            >
                                {isExpanded ? "접기 ▲" : "더 보기 ▼"}
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default MonthHistoryPage;
