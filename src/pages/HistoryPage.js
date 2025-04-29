import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../style/CartList.css";
import "../style/HoverUnderline.css";
import { FaTrash } from 'react-icons/fa';


const HistoryPage = () => {
  const [cartList, setCartList] = useState([]);
  const [selectedCarts, setSelectedCarts] = useState([]); // 체크한 장바구니 id 저장
  const [deleteMode, setDeleteMode] = useState(false); // 삭제 모드 on/off
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await api.post("/cart/history");
        setCartList(response.data);
      } catch (e) {
        console.error("장바구니 기록 불러오기 실패:", e);
      }
    };
    fetchCarts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "날짜 없음";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
  };

  const goToDetailPage = (cartId) => {
    if (!deleteMode) {
      navigate(`/history/${cartId}`);
    }
  };

  const handleDeleteModeToggle = async () => {
    if (deleteMode && selectedCarts.length > 0) {
      try {
        const body = selectedCarts.map(cartId => ({ cartId }));

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


  const handleCheckboxChange = (cartId) => {
    if (selectedCarts.includes(cartId)) {
      setSelectedCarts(selectedCarts.filter((id) => id !== cartId));
    } else {
      setSelectedCarts([...selectedCarts, cartId]);
    }
  };

  const handleGoBack = () => {
    navigate("/mypage");
  };


return (
    <div className="cart-container">
      {/* 상단 버튼 영역 */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 16px 0 16px",
        marginBottom: "20px",
      }}>
        <button onClick={handleGoBack} className="back-button">← 돌아가기</button>
        <button onClick={handleDeleteModeToggle} className="delete-button">
          {deleteMode ? "삭제" : <FaTrash size={16}/>}
        </button>
      </div>

      <h1 className="cart-title">장바구니 기록</h1>

      <div className="cart-items-list">
        {cartList.length === 0 ? (
            <div className="empty-cart">기록된 장바구니가 없습니다.</div>
        ) : (
            [...cartList]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((cart) => (
                    <div
                        key={cart.cartId}
                        className="cart-history-summary hover-underline"
                        onClick={() => goToDetailPage(cart.cartId)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "12px",
                          borderBottom: "1px solid #eee",
                          position: "relative"
                        }}
                    >
                      {deleteMode && (
                          <input
                              type="checkbox"
                              checked={selectedCarts.includes(cart.cartId)}
                              onChange={() => handleCheckboxChange(cart.cartId)}
                              style={{marginRight: "8px"}}
                          />
                      )}

                      {/* 썸네일 (기본 이미지) */}
                      <img
                          src={cart.thumbnailUrl || "https://via.placeholder.com/60"}
                          alt="상품 썸네일"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginRight: "12px"
                          }}
                      />

                      {/* 상품 정보 */}
                      <div style={{flexGrow: 1}}>
                        <div style={{fontSize: "15px", fontWeight: "bold", marginBottom: "4px"}}>
                          {cart.name}
                        </div>
                        <div style={{fontSize: "12px", color: "#777"}}>
                          {formatDate(cart.createdAt)}
                        </div>
                      </div>

                      {/* 오른쪽 수량/가격 표시 */}
                      <div style={{textAlign: "right"}}>
                        <div style={{fontSize: "14px", fontWeight: "bold"}}>
                          총 {cart.totalQuantity || 1}개
                        </div>
                        <div style={{fontSize: "13px", color: "#555"}}>
                          ₩{(cart.totalPrice || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                ))
        )}
      </div>
    </div>)
};

export default HistoryPage;
