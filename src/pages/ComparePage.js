import React, { useState, useEffect } from "react";
import "../style/ComparePage.css";
import "../style/AlertDesign.css";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import swal from "sweetalert";

const ComparePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const getItems = location.state?.items || [];
  const sourceType = location.state?.sourceType || "search";
  const productName = location.state?.searchQuery;
  const takenPicture = location.state?.receiptImage;
  const compareItemPrice = location.state?.compareItemPrice ?? 0;

  const [products, setProducts] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [receiptImage, setReceiptImage] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;
  const totalPages = Math.ceil(products.length / productsPerPage);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const paginatedProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
      if (endPage < totalPages - 1) pageNumbers.push("...");
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const formatted = getItems.map((item, index) => {
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
        setProducts(formatted);
        if (formatted.length > 0) {
          const cheapest = formatted.reduce((min, p) =>
            p.price < min.price ? p : min
          );
          setCheckedItems([cheapest.id]);
        }
      } catch (err) {
        console.error("상품 데이터 불러오기 실패:", err);
      }
    };

    const fetchImage = () => {
      if (sourceType === "photo") setReceiptImage(takenPicture || null);
      else setReceiptImage(null);
    };

    fetchProducts();
    fetchImage();
    if (productName) setSearchQuery(productName);
  }, [productName, sourceType]);

  const handleCheckboxChange = (id) => {
    setCheckedItems(
      (prev) => (prev.includes(id) ? [] : [id]) // 단일 선택
    );
  };

  const handleAddToCart = async () => {
    if (checkedItems.length === 0) {
      //alert("상품을 선택해주세요!");
      swal({
        title: "상품을 선택해주세요!",
        className: "custom-swal-warning",
      });
      return;
    }
    const selectedItem = products.find((p) => p.id === checkedItems[0]);
    const dto = {
      title: selectedItem.title ?? "",
      price: selectedItem.price,
      link: selectedItem.link ?? "",
      image: selectedItem.image ?? "",
      mallName: selectedItem.mallName ?? "",
      brand: selectedItem.brand ?? "",
      volume: selectedItem.volume ?? "",
      quantity: 1,
      compareItemPrice,
    };

    try {
      await api.post("/cart/add", dto);
      navigate("/cart");
    } catch (err) {
      console.error("장바구니 추가 실패:", err);
      //alert("장바구니 추가 실패.");
      swal({
        title: "장바구니 추가 실패.",
        icon: "warning",
        button: "확인",
        className: "custom-swal-warning",
      });
    }
  };

  return (
    <div className="compare-container">
      <div className="main-content">
        <h2 className="title">상품 비교하기</h2>

        {sourceType === "photo" && (
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
            <div
              key={item.id}
              className="product-item"
              onClick={() => handleCheckboxChange(item.id)}
            >
              <div className="product-info">
                {/* 이미지 링크 부분: 클릭 시 체크되지 않게 stopPropagation */}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="product-image-container"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="product-image"
                  />
                </a>

                <div className="product-description">
                  <div className="item-detail">
                    <p className="item-title">{item.title}</p>
                    <p className="item-brand">
                      {item.brand !== "브랜드 없음" ? item.brand : ""}
                    </p>
                    <p className="item-price">{item.lprice}</p>
                    <p className="item-mallname">{item.mallName}</p>
                  </div>
                </div>
              </div>

              {/* 시각적 체크박스 */}
              <div className="product-checkbox">
                <input
                  type="checkbox"
                  checked={checkedItems.includes(item.id)}
                  readOnly
                />
                <span
                  className={checkedItems.includes(item.id) ? "checked" : ""}
                >
                  ✓
                </span>
              </div>
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
