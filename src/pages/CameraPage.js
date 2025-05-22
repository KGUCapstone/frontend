import React, { useState, useEffect } from "react";
import "../style/ComparePage.css";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";

const ComparePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { items: getItems, sourceType, searchQuery: productName, receiptImage: takenPicture, compareItemPrice } = location.state || {};

  const [products, setProducts] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(productName || ""); // 받아온 검색어 또는 초기값 설정
  const [receiptImage, setReceiptImage] = useState(takenPicture || null); // 찍은 가격표 사진

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5; // 페이지 당 들어갈 상품 갯수

  useEffect(() => {
    const initializeData = async () => {
      // 1. 상품 데이터 포맷 및 설정
      if (getItems && getItems.length > 0) {
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

        // 가장 저렴한 상품을 찾아 초기 체크 상태로 설정
        if (formattedProducts.length > 0) {
          const cheapestProduct = formattedProducts.reduce((min, p) =>
              p.price < min.price ? p : min
          );
          setCheckedItems([cheapestProduct.id]);
        }
      } else {
        setProducts([]); // items가 없으면 빈 배열로 설정
        setCheckedItems([]);
      }

      // 2. 가격표 이미지 설정
      if (sourceType === "photo" && takenPicture) {
        setReceiptImage(takenPicture);
      } else {
        setReceiptImage(null); // 검색창으로 데이터를 받을 경우 이미지 없음
      }
    };

    initializeData();
  }, [getItems, sourceType, takenPicture]); // location.state에서 직접 추출한 값들을 의존성 배열에 추가

  const totalPages = Math.ceil(products.length / productsPerPage);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const paginatedProducts = products.slice(
      indexOfFirstProduct,
      indexOfLastProduct
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pageNumbers = [];

    const displayPageCount = 3;

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + displayPageCount - 1);

    if (endPage - startPage + 1 < displayPageCount) {
      startPage = Math.max(1, endPage - displayPageCount + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return (
        <div className="pagination">
          {pageNumbers.map((number, index) =>
              number === "..." ? (
                  <span key={`ellipsis-${index}`} className="ellipsis">
              ...
            </span>
              ) : (
                  <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={`page-button ${
                          currentPage === number ? "active" : ""
                      }`}
                  >
                    {number}
                  </button>
              )
          )}
        </div>
    );
  };

  const handleCheckboxChange = (id) => {
    setCheckedItems(
        (prevChecked) =>
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

    // compareItemPrice가 undefined일 경우 0으로 처리 (기존 로직 유지)
    const finalCompareItemPrice = compareItemPrice ?? 0;

    const onlineItemDto = {
      title: selectedItem.title ?? "",
      price: selectedItem.price,
      link: selectedItem.link ?? "",
      image: selectedItem.image ?? "",
      mallName: selectedItem.mallName ?? "",
      brand: selectedItem.brand ?? "",
      volume: selectedItem.volume ?? "",
      quantity: 1,
      compareItemPrice: finalCompareItemPrice, // 넘겨받은 compareItemPrice 사용
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
          <h2 className="title">⚖️ 상품 비교하기</h2>

          {sourceType === "photo" && receiptImage && ( // receiptImage 존재 여부도 확인
              <div className="money-image-container">
                <img
                    src={receiptImage}
                    alt="내가 찍은 가격표"
                    className="money-image"
                />
              </div>
          )}

          <div className="product-list">
            {paginatedProducts.map((item) => (
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
                      <div className="item-detail">
                        <p className="item-title">{item.title}</p>
                        <p className="item-brand">
                          {item.brand !== "브랜드 없음" ? `${item.brand}` : ""}
                        </p>
                        <p className="item-price">{item.lprice}</p>
                        <p className="item-mallname"> {item.mallName}</p>
                      </div>
                    </a>
                  </div>
                  <label className="product-checkbox">
                    <input
                        type="checkbox"
                        checked={checkedItems.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                    />
                    <span>✓</span>
                  </label>
                </div>
            ))}
          </div>

          {renderPagination()}

          <button className="addToCartBtn" onClick={handleAddToCart}>
            장바구니 담기
          </button>
        </div>
      </div>
  );
};

export default ComparePage;