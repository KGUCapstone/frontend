/* 코드 문제있으면 알려주세요(김경민) */
import React, { useState, useEffect } from "react";
import "../style/ComparePage.css";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";

const ComparePage = ({ product }) => {
  const navigate = useNavigate();
  const location = useLocation();
//<<<<<<< new-kkm
  const getItems = location.state?.items || []; 

  const [products, setProducts] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("상품명");
  const [receiptImage, setReceiptImage] = useState("/sinsa.jpg"); 

//  const getItems = location.state?.items || []; //SearchPage에서 전달된 데이터
  const sourceType = location.state?.sourceType || "search"; // 데이터 출처 구분:  "photo"  또는 "검색" (추가)
  const productName = location.state?.searchQuery; // 받아온 검색어 (추가)
  const takenPicture = location.state?.receiptImage; // 찍은 가격표 사진

  //백에서 받아올 데이터??들 상태 관리
//  const [products, setProducts] = useState([]); //네이버 쇼핑 API에서 받아올 상품 리스트
//  const [checkedItems, setCheckedItems] = useState([]); //체크된 상품 저장하는 곳
//  const [searchQuery, setSearchQuery] = useState(""); //구글 비전에서 추출된 상품명 또는 직접 검색한 상품명
//  const [receiptImage, setReceiptImage] = useState(null); // 내가 찍은 가격표 이미지
//>>>>>>> main

  useEffect(() => {
    console.log("받아온 데이터", getItems);

    const fetchProducts = async () => {
      try {
//<<<<<<< new-kkm
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
//=======
//        const data = { items: getItems }; // 검색창(SearchBar)을 통해 백에서 받아온 데이터

       if (location.state?.searchQuery) {
         //상품명 저장(추가)
         setSearchQuery(productName);
       }

       //백에서 받아온 데이터 가공 (HTML 태그 제거 등)
      //  const formattedProducts = data.items.map((item, index) => ({
      //    id: index + 1,
      //    image: item.image,
      //    title: item.title.replace(/<[^>]+>/g, ""), //HTML 태그 제거
      //    lprice: `₩${item.lprice.toLocaleString()}`, //가격 포맷
      //    brand: item.brand || "브랜드 없음",
      //    mallName: item.mallName,
      //    link: item.link,
      //  }));
      // setProducts(formattedProducts); //상태에 저장
//>>>>>>> main
      } catch (error) {
        console.error("상품 데이터를 불러오는 데 실패했습니다.", error);
      }
    };

//<<<<<<< new-kkm
    fetchProducts();
    setReceiptImage("/sinsa.jpg"); 
  }, [product]);
//=======
//     const fetchReceiptImage = async () => {
//       try {
//        if (sourceType === "photo") {
//          setReceiptImage(takenPicture || null); //구글 비전 이미지 초기값 설정
//        } else {
//          setReceiptImage(null); // 검색창으로 데이터를 받을 경우 이미지
//        }
//      } catch (err) {
//        console.error("이미지 데이터를 불러오는 데 실패:", err);
//        alert("이미지 데이터를 불러오는 데 실패");
//      }
//    };

//    fetchProducts(); //컴포넌트 처음 렌더링될 때 실행
//    fetchReceiptImage();
//  }, [product, sourceType, productName]);
//>>>>>>> main

  const handleCheckboxChange = (id) => {
    setCheckedItems(
      (prevChecked) =>
        prevChecked.includes(id)
          ? prevChecked.filter((item) => item !== id) 
          : [...prevChecked, id] 
    );
  };


  //장바구니 담기 버튼 눌렀을 때 실행된다.
  const handleAddToCart = async () => {

    if (checkedItems.length === 0) {
      alert("상품을 선택해주세요!");
      return;
    }

//<<<<<<< new-kkm
    const selectedProducts = products.filter((product) =>
//=======
//    // 첫 번째 체크된 상품만 가져오기
//    const firstSelectedItem = products.find((product) =>
//>>>>>>> main
      checkedItems.includes(product.id)
    );

//<<<<<<< new-kkm
    navigate("/cart", {

      state: {
        cartItems: selectedProducts,
        itemCount: selectedProducts.length,
      }, 
    });
//=======
//    const onlineItemDto = {
//      title: firstSelectedItem.title ?? "",
//      price: parseInt(firstSelectedItem.lprice.replace(/[₩,]/g, ""), 10),
//      link: firstSelectedItem.link ?? "",
//      image: firstSelectedItem.image ?? "",
//      mallName: firstSelectedItem.mallName ?? "",
//      brand: firstSelectedItem.brand ?? "",
//      volume: firstSelectedItem.volume ?? "",
//    };

//    console.log("🛒 장바구니에 담을 상품:", onlineItemDto);

//    try {
//      const res = await api.post("/cart/add", onlineItemDto);
//      console.log("✅ 장바구니 추가 성공:", res.data);
//      navigate("/cart"); // 백에서 받은걸로 cartList 보여주기

//    } catch (err) {
//      console.error("장바구니 추가 실패:", err.response?.data || err.message);
//      alert("장바구니 추가 실패.");
//    }
//>>>>>>> main
		
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
          {searchQuery} 비교
          <br />
          온라인 최저가
        </h2>
{/* <<<<<<< new-kkm */}
        <div className="money-image-container">
          <img
            src={receiptImage}
            alt="내가 찍은 가격표"
            className="money-image"
          />
        </div>
{/* ======= */}

        {/*내가 찍은 가격표 이미지*/}
        {sourceType === "photo" && (
         <div className="money-image-container">
           <img
             src={receiptImage}
             alt="내가 찍은 가격표"
             className="money-image"
           />
         </div>
       )}

       {/*네이버 쇼핑에서 가져온 비슷한 상품 리스트 나열*/}
{/* //>>>>>>> main */}
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
