/* 코드 문제있으면 알려주세요(김경민) */
import React, { useState, useEffect } from "react";
import "../style/ComparePage.css";
import { useLocation, useNavigate } from "react-router-dom";

const ComparePage = ({ product }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const getItems = location.state?.items || []; 

  const [products, setProducts] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("상품명");
  const [receiptImage, setReceiptImage] = useState("/sinsa.jpg"); 

  useEffect(() => {
    console.log("받아온 데이터", getItems);
    const fetchProducts = async () => {
      try {
        const data = { items: getItems }; 
        const formattedProducts = data.items.map((item, index) => {
          const rawPrice = String(item.lprice).replace(/[₩,]/g, ""); 
          const numericPrice = Number(rawPrice); 
        
          return {
            id: index + 1,
            image: item.image,
            title: item.title.replace(/<[^>]+>/g, ""), 
            lprice: `₩${numericPrice.toLocaleString()}`, 
            price: numericPrice,                         
            brand: item.brand || "브랜드 없음",
            mallName: item.mallName,
            link: item.link,
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
    setCheckedItems(
      (prevChecked) =>
        prevChecked.includes(id)
          ? prevChecked.filter((item) => item !== id) 
          : [...prevChecked, id] 
    );
  };

  const handleAddToCart = () => {
    if (checkedItems.length === 0) {
      alert("상품을 선택해주세요!");
      return;
    }

    const selectedProducts = products.filter((product) =>
      checkedItems.includes(product.id)
    );
    console.log("🛒 장바구니에 담을 상품:", selectedProducts);

    navigate("/cart", {

      state: {
        cartItems: selectedProducts,
        itemCount: selectedProducts.length,
      }, 
    });
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
          {products.map((items) => (
            <div key={items.id} className="product-item">
              <div className="product-info">
                <div className="product-image-container">
                  <img
                    src={items.image}
                    alt={items.name}
                    className="product-image"
                  />
                </div>
                {/* <span className="product-description">
                  {items.brand} / {items.title} / {items.lprice} /{" "}
                  {items.mallName}
                </span> */}
                  <a
                  href={items.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-description"
                  >
                  {items.brand} / {items.title} / {items.lprice} / {items.mallName}
                </a>
              </div>
              <input
                type="checkbox"
                checked={checkedItems.includes(items.id)}
                onChange={() => handleCheckboxChange(items.id)}
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
