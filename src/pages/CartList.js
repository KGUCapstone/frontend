import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/CartList.css";
import api from "../api";
import CartItem from "../components/CartItem.js";
import { FaTrash } from "react-icons/fa";
//import BottomNav from "../components/BottomNav";

const CartList = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]); // 초기값을 빈 배열로 변경
  const [checkedItems, setCheckedItems] = useState({});

  const userName = "사용자";

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.post("/cart/show"); // 장바구니 요청
        setCartItems(res.data);
        const initCheck = {};
        // 모든 상품을 기본적으로 체크된 상태로 설정
        res.data.forEach((item) => (initCheck[item.id] = true));
        setCheckedItems(initCheck);
      } catch (err) {
        console.error(
          "장바구니 불러오기 실패:",
          err.response?.data || err.message
        );
        // 오류 발생 시에도 빈 배열로 설정하여 렌더링되도록 처리
        setCartItems([]);
        setCheckedItems({});
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

  // 전체선택/해제 토글 함수
  const handleSelectAll = () => {
    const allSelected = cartItems.every((item) => checkedItems[item.id]);
    const newCheckedItems = {};

    if (allSelected) {
      // 모든 항목이 선택된 상태라면 전체 해제
      cartItems.forEach((item) => {
        newCheckedItems[item.id] = false;
      });
    } else {
      // 일부만 선택되었거나 모두 해제된 상태라면 전체 선택
      cartItems.forEach((item) => {
        newCheckedItems[item.id] = true;
      });
    }

    setCheckedItems(newCheckedItems);
  };

  // 전체선택 상태 확인 함수
  const isAllSelected = () => {
    if (cartItems.length === 0) return false;
    return cartItems.every((item) => checkedItems[item.id]);
  };

  // 버튼의 CSS 클래스를 결정하는 함수
  const getSelectAllButtonClass = () => {
    if (isAllSelected()) {
      return "select-all-button deselect-all";
    } else {
      return "select-all-button select-all";
    }
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
      // 선택된 상품의 ID만 추출하는 대신,
      // CartItemDto와 유사한 전체 selectedItems 배열을 서버로 전송합니다.
      await api.post("/cart/removeItem", selectedItems); // 수정된 부분
      alert("선택한 상품이 삭제되었습니다.");
      // 삭제 후 장바구니 데이터를 다시 불러와 UI 업데이트
      const res = await api.post("/cart/show");
      setCartItems(res.data);
      // 삭제된 항목은 체크 해제 상태로, 남은 항목은 기존 체크 상태 유지 또는 모두 다시 체크
      const newCheckedItems = {};
      res.data.forEach((item) => {
        newCheckedItems[item.id] = checkedItems[item.id] || false; // 기존 체크 상태 유지, 없으면 false
      });
      setCheckedItems(newCheckedItems);
    } catch (err) {
      console.error("삭제 실패:", err.response?.data || err.message);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      if (checkedItems[item.id]) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const handleIncreaseQuantity = (itemId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const calculateTotalComparePrice = () => {
    return cartItems.reduce((total, item) => {
      if (checkedItems[item.id] && item.compareItemPrice > 0) {
        return total + item.compareItemPrice * item.quantity;
      }
      return total;
    }, 0);
  };

  const calculateTotalSaved = () => {
    return cartItems.reduce((total, item) => {
      if (checkedItems[item.id] && item.compareItemPrice > 0) {
        const savedPerItem = item.compareItemPrice - item.price;
        // 절약 금액이 양수일 경우에만 합산
        return total + (savedPerItem > 0 ? savedPerItem * item.quantity : 0);
      }
      return total;
    }, 0);
  };

  // 음수 절약 금액을 문자열로 반환하는 함수 (표시용)
  const getDisplaySavedAmount = () => {
    let totalSaved = 0;
    cartItems.forEach((item) => {
      if (checkedItems[item.id] && item.compareItemPrice > 0) {
        const savedPerItem = item.compareItemPrice - item.price;
        totalSaved += savedPerItem * item.quantity;
      }
    });

    if (totalSaved < 0) {
      return (
        <span style={{ color: "red" }}>
          ₩{totalSaved.toLocaleString()} (손해)
        </span>
      );
    } else {
      return `₩${totalSaved.toLocaleString()}`;
    }
  };

  return (
    <>
      <div className="cart-scrollable">
        <div className="cart-container">
          <div className="cart-header">
            <div className="back-button-container">
              <button className="back-button" onClick={goBack}>
                ←
              </button>
            </div>
            <h1 className="cart-title"> 🛒 장바구니</h1>
          </div>

          <div className="cart-middle">
            <button
              className={getSelectAllButtonClass()}
              onClick={handleSelectAll}
            >
              {isAllSelected() ? "전체해제" : "전체선택"}
            </button>
            <div className="user-message">
              <h2>
                {userName}님 {cartItems.length}개 담으셨군요!
              </h2>
            </div>
            <button className="delete-button" onClick={handleDelete}>
              <FaTrash size={23} />
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
                  절약한 금액: {getDisplaySavedAmount()}
                </div>
              </div>

              <button className="order-button" onClick={handleComplete}>
                확인하기
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartList;
