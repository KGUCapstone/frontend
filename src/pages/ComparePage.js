/* 코드 문제있으면 알려주세요(김경민) */
import React, { useState, useEffect } from "react";
import "../style/ComparePage.css";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";

const ComparePage = ({ product }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const getItems = location.state?.items || [];

  const [products, setProducts] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("상품명");
  const [receiptImage, setReceiptImage] = useState("/sinsa.jpg");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const formattedProducts = getItems.map((item, index) => {
          const numericPrice = Number(String(item.lprice).replace(/[₩,]/g, ""));
          return {
            id: index + 1,
            image: item.image,
            title: item.title.replace(/<[^>]+>/g, ""),
            lprice: `₩${numericPrice.toLocaleString()}`,
            price: numericPrice,
            brand: item.brand || "브랜드 없음",
            mallName: item.mallName,
            link: item.link,
            volume: item.volume || "",
          };
        });
        setProducts(formattedProducts);
      } catch (error) {
        console.error("상품 데이터를 불러오는 데 실패했습니다.", error);
      }
    };

    fetchProducts();
    setReceiptImage("/sinsa.jpg");
  }, [product]);

  const handleCheckboxChange = (id) => {
    setCheckedItems((prevChecked) =>
      prevChecked.includes(id)
        ? prevChecked.filter((item) => item !== id)
        : [id] // 하나만 선택하도록 제한
    );
  };

  const handleAddToCart = async () => {
    if (checkedItems.length === 0) {
      alert("상품을 선택해주세요!");
      return;
    }

    const selectedItem = products.find((product) =>
      checkedItems.includes(product.id)
    );

    const onlineItemDto = {
      title: selectedItem.title ?? "",
      price: selectedItem.price,
      link: selectedItem.link ?? "",
      image: selectedItem.image ?? "",
      mallName: selectedItem.mallName ?? "",
      brand: selectedItem.brand ?? "",
      volume: selectedItem.volume ?? "",
    };

    console.log("🛒 장바구니에 담을 상품:", onlineItemDto);

    try {
      const res = await api.post("/cart/add", onlineItemDto);
      console.log("장바구니 추가 성공:", res.data);
      navigate("/cart"); // 장바구니 화면으로 이동
    } catch (err) {
      console.error("장바구니 추가 실패:", err.response?.data || err.message);
      alert("장바구니 추가 실패.");
    }
  };

  return (
    <div className="compare-container">
      <div className="home-icon-container">
        <a href="/home" className="home-link">
          <div className="home-icon">
            <span>⌂</span>
          </div>
        </a>
      </div>

      <div className="main-content">
        <h2 className="title">
          해당 "{searchQuery}" 상품
          <br />
          온라인 비교
        </h2>

        <div className="money-image-container">
          <img
            src={receiptImage}
            alt="내가 찍은 가격표"
            className="money-image"
          />
        </div>

        <div className="product-list">
          {products.map((item) => (
            <div key={item.id} className="product-item">
              <div className="product-info">
                <div className="product-image-container">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="product-image"
                  />
                </div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-description"
                >
                  {item.brand} / {item.title} / {item.lprice} / {item.mallName}
                </a>
              </div>
              <input
                type="checkbox"
                checked={checkedItems.includes(item.id)}
                onChange={() => handleCheckboxChange(item.id)}
                className="product-checkbox"
              />
            </div>
          ))}
        </div>

        <button className="add-to-cart-button" onClick={handleAddToCart}>
          장바구니 담기
        </button>
      </div>
    </div>
  );
};

export default ComparePage;
