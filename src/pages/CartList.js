import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/CartList.css";
import BottomNav from "../components/BottomNav";
import api from "../api"; 
import CartItem from "../components/CartItem.js";
import {FaTrash} from "react-icons/fa";

const CartList = () => {
  const navigate = useNavigate();
  //const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  const userName = "사용자";

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "빙그레 저지방 바나나맛 우유 240ML",
      brand: "빙그레",
      mallName: "홈플러스",
      price: 1690,
      quantity: 1,
      image: "https://shopping-phinf.pstatic.net/main_8245883/82458839420.1.jpg"
    },
    {
      id: 2,
      title: "오산 붕어빵 직접굽는 미니붕어빵 (60마리)",
      brand: "오산 붕어빵",
      mallName: "쿠팡",
      price: 3500,
      quantity: 1,
      image: "https://img-cf.kurly.com/shop/data/goods/1636095741587l0.jpg"
    }
  ]);


  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.post("/cart/show"); // 장바구니 요청
        setCartItems(res.data);
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

    const payload = {
      selectedItems: selectedItems,
      totalSavedAmount: calculateTotalSaved(),
    };

    try {
      await api.post("/cart/complete", payload);
      navigate("/home");
    } catch (err) {
      console.error("선택 완료 처리 실패:", err.response?.data || err.message);
      alert("선택 완료 중 문제가 발생했습니다.");
    }
  };

  const goBack = () => {
    navigate("/home");
  };


  const handleDelete = async () => {
    const selectedItems = cartItems.filter((item) => checkedItems[item.id]);

    if (selectedItems.length === 0) {
      alert("삭제할 상품을 선택해주세요!");
      return;
    }

    try {
      await api.post("/cart/removeItem", selectedItems);
      alert("선택한 상품이 삭제되었습니다.");
      const res = await api.post("/cart/show");
      setCartItems(res.data);


    } catch (err) {
      console.error("삭제 실패:", err.response?.data || err.message);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      if (checkedItems[item.id]) {
        return total + (item.price * item.quantity);
      }
      return total;
    }, 0);
  };


  const handleIncreaseQuantity = (itemId) => {
    setCartItems((prev) =>
      prev.map((item) => item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item)
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
    );
  };
  const calculateTotalComparePrice = () => {
    return cartItems.reduce((total, item) => {
      if (checkedItems[item.id] && item.compareItemPrice > 0) {
        return total + (item.compareItemPrice * item.quantity);
      }
      return total;
    }, 0);
  };
  const calculateTotalSaved = () => {
    return cartItems.reduce((total, item) => {
      if (checkedItems[item.id] && item.compareItemPrice > 0) {
        return total + ((item.compareItemPrice - item.price) * item.quantity);
      }
      return total;
    }, 0);
  };


  return (
      <>
        <header className="main-header">
          <div className="header-spacer" />
          <div className="logo" onClick={() => navigate("/home")}>GAVION</div>
        </header>

      <div className="header-container-spacer"></div>

      <div className="cart-container">
        <h1 className="cart-title">🛒 장바구니</h1>

        <div className="user-message">
          <h2>{userName}님 {cartItems.length}개 담으셨군요!</h2>
        </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 16px 0 16px",
            marginBottom: "20px",
          }}>
            <button className="back-button" onClick={goBack}>
              ← 다시 담기
            </button>
            <button className="delete-button" onClick={handleDelete}>
              <FaTrash size={23}/>
            </button>
        </div>

        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div className="empty-cart">장바구니가 비어있습니다.</div>
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                checked={checkedItems[item.id]}
                onCheckboxChange={handleCheckboxChange}
                onIncrease={handleIncreaseQuantity}
                onDecrease={handleDecreaseQuantity}
              />

            ))
          )}
        </div>

        {cartItems.length > 0 && (
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

            <button className="order-button" onClick={handleComplete}>
              확인하기
            </button>
          </div>

        )}
        <BottomNav />
      </div>
      </>
    );


};

export default CartList;