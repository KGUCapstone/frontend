import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "../style/CartList.css";
import CartItem from "../components/CartItem";

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

  const calculateTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotalComparePrice = () => {
    return items.reduce((total, item) => {
      if (item.compareItemPrice > 0) {
        return total + (item.compareItemPrice * item.quantity);
      }
      return total;
    }, 0);
  };

  const calculateTotalSaved = () => {
    return items.reduce((total, item) => {
      if (item.compareItemPrice > 0) {
        return total + ((item.compareItemPrice - item.price) * item.quantity);
      }
      return total;
    }, 0);
  };

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
            <>
              {items.map((item) => (
                  <CartItem
                      key={item.id}
                      item={item}
                      showQuantityControls={false}
                      showCheckbox={false}
                  />
              ))}

              {/* 하단 총 합계 + 비교가 + 절약금액 표시 */}
              <div className="order-footer">
                <div className="order-info">
                  <div className="order-price">
                    총 합계: ₩{calculateTotalPrice().toLocaleString()}
                  </div>
                  <div className="order-compare-price">
                    비교가: ₩{calculateTotalComparePrice().toLocaleString()}
                  </div>
                  <div className="order-saved">
                    절약한 금액: ₩{calculateTotalSaved().toLocaleString()}
                  </div>
                </div>
              </div>
            </>
        )}
      </div>
  );
};

export default CartDetailPage;
