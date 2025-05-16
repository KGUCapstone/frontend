import React from "react";
import "../style/CartItem.css";

const CartItem = ({
  item,
  checked,
  onCheckboxChange,
  onIncrease,
  onDecrease,
  showQuantityControls = true,
  showCheckbox = true,
}) => {
  const savedAmount =
    item.compareItemPrice > 0
      ? (item.compareItemPrice - item.price) * item.quantity
      : 0;

  const noBrandName = item.title.replace("브랜드 없음", "").trim();

  return (
    <div key={item.id} className="cart-item">
      {/* 이미지 */}
      <div className="cart-item-image-container">
        <img src={item.image} alt={item.title} className="cart-item-image" />
      </div>

      {/* 상세 */}
      <div className="cart-item-details">
        <h3 className="item-title">{noBrandName}</h3>
        <p className="item-brand">
          {item.brand !== "브랜드 없음" ? `${item.brand}` : ""}
        </p>
        <p className="item-store">{item.mallName}</p>

        {/* 수량 + 가격 */}
        {showQuantityControls && (
          <div className="item-bottom">
            <div className="quantity-control">
              <button
                className="quantity-btn"
                onClick={() => onDecrease(item.id)}
              >
                -
              </button>
              <span className="quantity-number">{item.quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => onIncrease(item.id)}
              >
                +
              </button>
            </div>
            <div>
              <p className="item-price">
                ₩{(item.price * item.quantity).toLocaleString()}
                <span className="item-unit-price">
                  {" "}
                  ({item.price.toLocaleString()}원 × {item.quantity})
                </span>
              </p>
              {/* 비교가 표시 */}
              {item.compareItemPrice > 0 && (
                <p className="compare-price">
                  비교가 ₩
                  {(item.compareItemPrice * item.quantity).toLocaleString()}
                </p>
              )}
              {/* 절약금액 표시 */}
              {savedAmount > 0 && (
                <p className="saved-amount">
                  💸 {savedAmount.toLocaleString()}원 절약했어요!
                </p>
              )}
            </div>
          </div>
        )}

        {!showQuantityControls && (
          <div>
            <p className="item-price">
              ₩{(item.price * item.quantity).toLocaleString()}
              <span className="item-unit-price">
                {" "}
                ({item.price.toLocaleString()}원 × {item.quantity})
              </span>
            </p>
            <div className="compare-saved-row">
              {item.compareItemPrice > 0 && (
                <span className="compare-price">
                  비교가 ₩
                  {(item.compareItemPrice * item.quantity).toLocaleString()}
                </span>
              )}
              {savedAmount > 0 && (
                <span className="saved-amount">
                  💸 {savedAmount.toLocaleString()}원 절약했어요!
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 체크박스 */}
      {showCheckbox && (
        <div className="item-actions">
          <div
            className={`check-icon ${checked ? "checked" : ""}`}
            onClick={() => onCheckboxChange(item.id)}
          >
            {checked && <span>✓</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;
