/* 코드 문제있으면 알려주세요(김경민) */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../style/cartDetailList.css";

const CartDetailList = () => {
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const myProduct = {
    image: "/sinsa.jpg",
    name: "내가 찍은 상품",
    price: "₩990",
    numericPrice: 990, 
  }; //임의 데이터 넣어놨음

  const getPriceAsNumber = (priceString) => {
    if (!priceString) return 0;
    return parseInt(priceString.replace(/[^\d]/g, ""), 10);
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `₩${price.toLocaleString()}`;
    }
    const numericPrice = getPriceAsNumber(price);
    return `₩${numericPrice.toLocaleString()}`;
  };

  const getPriceComparison = () => {
    if (!onlineItem) return null;
    
    const myPrice = myProduct.numericPrice;
    const onlinePrice = getPriceAsNumber(onlineItem.lprice);
    const priceDifference = myPrice - onlinePrice;
    
    if (priceDifference > 0) {
      return {
        message: `온라인 구매 시 ${priceDifference.toLocaleString()}원 할인!`,
        isOnlineCheaper: true
      };
    } else if (priceDifference < 0) {
      return {
        message: "오프라인으로 구매하는 게 더 이득!",
        isOnlineCheaper: false
      };
    } else {
      return {
        message: "온라인과 오프라인 가격이 동일합니다.",
        isOnlineCheaper: null
      };
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : selectedItems.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % selectedItems.length);
  };

  const onlineItem = selectedItems[currentIndex];
  const priceComparison = getPriceComparison();

  return (
    <div className="cart-container">
      <div className="back-button-container">
        <button className="back-button" onClick={() => window.history.back()}>
          ← 뒤로가기
        </button>
      </div>
      <h2 className="cart-title">상품 비교</h2>

      <div className="compare-vertical-wrapper">
        <div className="compare-product-card">
          <img src={myProduct.image} alt="내 상품" className="smaller-image" />
          <h3>{myProduct.name}</h3>
          <p className="item-price">{myProduct.price}</p>
        </div>

        {onlineItem && (
          <div className="online-product-container">
            {selectedItems.length > 1 && (
              <div className="arrow-button left-arrow" onClick={handlePrev}>←</div>
            )}
            
            <div className="compare-product-card">
              <img src={onlineItem.image} alt={onlineItem.title} className="smaller-image" />
              <h3>{onlineItem.title}</h3>
              <p className="item-brand">{onlineItem.brand}</p>
              <p className="item-price">{formatPrice(onlineItem.lprice)}</p>
              <p className="item-store">{onlineItem.mallName}</p>
            </div>
            
            {selectedItems.length > 1 && (
              <div className="arrow-button right-arrow" onClick={handleNext}>→</div>
            )}
          </div>
        )}
      </div>

      {priceComparison && (
        <div className={`price-comparison-card ${priceComparison.isOnlineCheaper ? 'online-cheaper' : priceComparison.isOnlineCheaper === false ? 'offline-cheaper' : 'same-price'}`}>
          <h3 className="comparison-title">구매 추천</h3>
          <p className="comparison-message">{priceComparison.message}</p>
          {priceComparison.isOnlineCheaper && (
            <button className="buy-online-button">온라인으로 구매하기</button>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDetailList;