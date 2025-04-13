/* 코드 문제있으면 알려주세요(김경민) */
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/CartList.css";

const CartList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cartItems = location.state?.cartItems || [];

  const [checkedItems, setCheckedItems] = useState({});

  //사용자이름 로그인 하면 가져올 예정
  const userName = "사용자";

  const goBack = () => {
    navigate("/compareitem", {
      state: {
        items: cartItems
      }
    });
  };

  const handleCheckboxChange = (itemId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleComplete = () => {
    const selectedItems = cartItems.filter((item) => checkedItems[item.id]);

    if (selectedItems.length === 0) {
      alert("상품을 선택해주세요!");
      return;
    }

    navigate("/cartDetailList", {
      state: { selectedItems },
    });
  };

  return (
    <div className="cart-container">
      <div className="back-button-container">
        <button className="back-button" onClick={goBack}>
          ← 다시 담기
        </button>
      </div>

      <h1 className="cart-title">CARTLIST</h1>

      <div className="user-message">
        <h2>
          {userName}님 {cartItems.length}개 담으셨군요!
        </h2>
      </div>

      <div className="cart-items-list">
        {!cartItems || cartItems.length === 0 ? (
          <div className="empty-cart">장바구니가 비어있습니다.</div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image-container">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
              </div>
              <div className="cart-item-details">
                <h3>{item.title}</h3>
                <p className="item-brand">{item.brand}</p>
                <p className="item-store">{item.mallName}</p>
                <p className="item-price">₩{item.price.toLocaleString()}</p>
                {/* <p className="item-price">{item.price.toLocaleString()}</p> */}
              </div>
              <div className="item-checkbox-container">
                <div
                  className={`check-icon ${
                    checkedItems[item.id] ? "checked" : ""
                  }`}
                  onClick={() => handleCheckboxChange(item.id)}
                >
                  {checkedItems[item.id] && <span>✓</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems && cartItems.length > 0 && (
        <button className="complete-button" onClick={handleComplete}>
          선택 완료
        </button>
      )}
    </div>
  );
};

export default CartList;
