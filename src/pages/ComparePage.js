//ComparePage.js
import React, { useState, useEffect } from "react";
import "../style/ComparePage.css";
import { useLocation, useNavigate } from "react-router-dom";

const ComparePage = ({ product }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const getItems = location.state?.items || []; //SearchPage에서 전달된 데이터

  //백에서 받아올 데이터??들 상태 관리
  const [products, setProducts] = useState([]); //네이버 쇼핑 API에서 받아올 상품 리스트
  const [checkedItems, setCheckedItems] = useState([]); //체크된 상품 저장하는 곳
  const [searchQuery, setSearchQuery] = useState("상품명"); //구글 비전에서 추출된 상품명 또는 직접 검색한 상품명
  const [receiptImage, setReceiptImage] = useState("/sinsa.jpg"); //구글 비전으로 추출된 가격표 이미지

  useEffect(() => {
    //백에서 받아올 곳
    console.log("받아온 데이터", getItems);
    const fetchProducts = async () => {
      try {
        const data = { items: getItems }; // 검색창(SearchBar)을 통해 백에서 받아온 데이터

        //백에서 받아온 데이터 가공 (HTML 태그 제거 등)
        const formattedProducts = data.items.map((item, index) => ({
          id: index + 1,
          image: item.image,
          title: item.title.replace(/<[^>]+>/g, ""), //HTML 태그 제거
          lprice: `₩${item.lprice.toLocaleString()}`, //가격 포맷
          brand: item.brand || "브랜드 없음",
          mallName: item.mallName,
          link: item.link,
        }));
        setProducts(formattedProducts); //상태에 저장
      } catch (error) {
        console.error("상품 데이터를 불러오는 데 실패했습니다.", error);
      }
    };

    fetchProducts(); //컴포넌트 처음 렌더링될 때 실행
    setReceiptImage("/sinsa.jpg"); //구글 비전 이미지 초기값 설정
  }, [product]);

  //체크박스 클릭할 때 실행됨
  const handleCheckboxChange = (id) => {
    setCheckedItems(
      (prevChecked) =>
        prevChecked.includes(id)
          ? prevChecked.filter((item) => item !== id) //체크 해제
          : [...prevChecked, id] //체크 추가
    );
  };

  //장바구니 담기 버튼 눌렀을 때 실행된다.
  const handleAddToCart = () => {
    if (checkedItems.length === 0) {
      alert("상품을 선택해주세요!"); //체크된 상품 없으면 알림 띄우도록 해놨슴다
      return;
    }
    //체크된 상품들만 필터링해서 가져온다
    const selectedProducts = products.filter((product) =>
      checkedItems.includes(product.id)
    );
    console.log("🛒 장바구니에 담을 상품:", selectedProducts);

    //나중에 백엔드에 장바구니 추가하는 API 호출하면 되겠죠?

    navigate("/cart", {
      //장바구니 페이지로 이동!
      state: {
        cartItems: selectedProducts,
        itemCount: selectedProducts.length,
      }, //몇 개 담았는지랑 어떤 상품이 셀렉되었는지 전달
    });
  };

  return (
    <div className="compare-container">
      {/*홈으로*/}
      <div className="home-icon-container">
        <a href="/home" className="home-link">
          <div className="home-icon">
            <span>⌂</span>
          </div>
        </a>
      </div>

      <div className="main-content">
        {/*구글 비전으로 추출된 검색어 아님 받아온 검색어*/}
        <h2 className="title">
          해당 "{searchQuery}" 상품
          <br />
          온라인 비교
        </h2>

        {/*내가 찍은 가격표 이미지*/}
        <div className="money-image-container">
          <img
            src={receiptImage}
            alt="내가 찍은 가격표"
            className="money-image"
          />
        </div>

        {/*네이버 쇼핑에서 가져온 비슷한 상품 리스트 나열*/}
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
                <span className="product-description">
                  {items.brand} / {items.title} / {items.lprice} /{" "}
                  {items.mallName}
                </span>
              </div>
              {/*체크박스*/}
              <input
                type="checkbox"
                checked={checkedItems.includes(items.id)}
                onChange={() => handleCheckboxChange(items.id)}
                className="product-checkbox"
              />
            </div>
          ))}
        </div>
        {/*장바구니 담기 버튼*/}
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          장바구니 담기
        </button>
      </div>
    </div>
  );
};

export default ComparePage;
