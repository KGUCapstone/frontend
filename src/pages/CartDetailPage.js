import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "../style/CartList.css";

const CartDetailPage = () => {
  const { cartId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await api.get(`/cart/history/${cartId}`);
        setItems(response.data);
      } catch (err) {
        console.error("장바구니 상세 불러오기 실패:", err);
      }
    };

    fetchCartItems();
  }, [cartId]);

  const goBack = () => {
    navigate("/history");
  };

  return (
    <div className="cart-container">
      <div className="back-button-container">
        <button className="back-button" onClick={goBack}>
          ← 장바구니 기록으로
        </button>
      </div>

      <h1 className="cart-title">장바구니 상세</h1>

      {items.length === 0 ? (
        <div className="empty-cart">해당 장바구니에는 상품이 없습니다.</div>
      ) : (
        items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image-container">
              <img src={item.image} alt={item.title} className="cart-item-image" />
            </div>
            <div className="cart-item-details">
              <h3>{item.title}</h3>
              <p className="item-brand">{item.brand}</p>
              <p className="item-store">{item.mallName}</p>
              <p className="item-price">₩{item.price.toLocaleString()}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CartDetailPage;
