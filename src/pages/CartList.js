/* 코드 문제있으면 알려주세요(김경민) */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/CartList.css";
import api from "../api"; // axios 인스턴스
const CartList = () => {
  const navigate = useNavigate();

 // const cartItems = location.state?.cartItems || [];

//=======
  const [cartItems, setCartItems] = useState([]);
//>>>>>>> main
  const [checkedItems, setCheckedItems] = useState({});

  const userName = "사용자";


  const goBack = () => {
    navigate("/compareitem", {
      state: {
        items: cartItems
      }
    });
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.post("/cart/show"); // 장바구니 요청
        setCartItems(res.data);

        // 체크 초기화
        const initCheck = {};
        res.data.forEach((item) => (initCheck[item.id] = false));
        setCheckedItems(initCheck);
      } catch (err) {
        console.error("장바구니 불러오기 실패:", err.response?.data || err.message);
      }
    };

    fetchCart();
  }, []);


  const handleCheckboxChange = (itemId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };


  const handleComplete = async () => {

    const selectedItems = cartItems.filter((item) => checkedItems[item.id]);

    if (selectedItems.length === 0) {
      alert("상품을 선택해주세요!");
      return;
    }

    try {
      await api.post("/cart/complete", selectedItems); // 선택 상품 서버 전송
  
      // 성공 후 이동
      navigate("/home");
    } catch (err) {
      console.error("선택 완료 처리 실패:", err.response?.data || err.message);
      alert("선택 완료 중 문제가 발생했습니다.");
    }
    
    // navigate("/cartDetailList", { // 여기도 직접 넘기지 말고 벡으로 전달하는 방식으로로
    //   state: { selectedItems },
    // });

    
  };

  // const goHome = () => {
  //   navigate("/home");
  // };

  return (
    <div className="cart-container">
      <div className="back-button-container">
        <button className="back-button" onClick={goBack}>
          ← 다시 담기
        </button>
      </div>

      <h1 className="cart-title">CARTLIST</h1>

      <div className="user-message">
        <h2>{userName}님 {cartItems.length}개 담으셨군요!</h2>
      </div>

      <div className="cart-items-list">
        {cartItems.length === 0 ? (
          <div className="empty-cart">장바구니가 비어있습니다.</div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image-container">
                <img
                  src={item.image}
                  alt={item.title}
                  className="cart-item-image"
                />
              </div>
              <div className="cart-item-details">
                <h3>{item.title}</h3>
                <p className="item-brand">{item.brand}</p>
                <p className="item-store">{item.mallName}</p>
                <p className="item-price">₩{item.price.toLocaleString()}</p>

              </div>
              <div className="item-checkbox-container">
                <div
                  className={`check-icon ${checkedItems[item.id] ? "checked" : ""}`}
                  onClick={() => handleCheckboxChange(item.id)}
                >
                  {checkedItems[item.id] && <span>✓</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <button className="complete-button" onClick={handleComplete}>
          선택 완료
        </button>
      )}
    </div>
  );
};

export default CartList;
