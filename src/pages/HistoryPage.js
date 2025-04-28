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
          <button
              onClick={handleGoBack}
              className="back-button"
              style={{ backgroundColor: "transparent", border: "none", fontSize: "14px", cursor: "pointer" }}
          >
            돌아가기
          </button>

          <button
              onClick={handleDeleteModeToggle}
              className="delete-button"
              style={{
                backgroundColor: "#ff4d4f",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "6px 10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer"
              }}
          >
            {deleteMode ? "삭제" : <FaTrash size={16} />}
          </button>
        </div>

        <h1 className="cart-title">장바구니 기록</h1>

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
                        style={{ display: "flex", alignItems: "center" }}
                    >
                      {deleteMode && (
                          <input
                              type="checkbox"
                              checked={selectedCarts.includes(cart.cartId)}
                              onChange={() => handleCheckboxChange(cart.cartId)}
                              style={{ marginRight: "8px" }}
                          />
                      )}
                      🛒 {cart.name} - {formatDate(cart.createdAt)}
                    </div>
                ))
        )}
      </div>
  );
};

export default HistoryPage;
