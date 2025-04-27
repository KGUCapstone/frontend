import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../style/CartList.css";
import "../style/HoverUnderline.css"; 

const HistoryPage = () => {
  const [cartList, setCartList] = useState([]);
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
    navigate(`/history/${cartId}`);
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">장바구니 기록</h1>

      {cartList.length === 0 ? (
          <div className="empty-cart">기록된 장바구니가 없습니다.</div>
      ) : (
          [...cartList]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 최신순 정렬
              .map((cart) => (
                  <div
                      key={cart.cartId}
                      className="cart-history-summary hover-underline"
                      onClick={() => goToDetailPage(cart.cartId)}
                  >
                    🛒 {cart.name} - {formatDate(cart.createdAt)}
                  </div>
              ))
      )}
    </div>
  );
};

export default HistoryPage;
