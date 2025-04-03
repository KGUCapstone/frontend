//ComparePage.js
import React, { useState, useEffect } from 'react';
import '../style/ComparePage.css';
import { useNavigate } from "react-router-dom";

const ComparePage = () => {
    const navigate = useNavigate();

    //백에서 받아올 데이터??들 상태 관리
    const [products, setProducts] = useState([]); //네이버 쇼핑 API에서 받아올 상품 리스트
    const [checkedItems, setCheckedItems] = useState([]); //체크된 상품 저장하는 곳
    const [searchQuery, setSearchQuery] = useState("상품명"); //구글 비전에서 추출된 상품명 또는 직접 검색한 상품명명
    const [receiptImage, setReceiptImage] = useState("/sinsa.jpg"); //구글 비전으로 추출된 가격표 이미지

    useEffect(() => {
        //백에서 받아올 곳 (현재는 그냥 아무 데이터 집어넣음)
        setProducts([
            { id: 1, image: "/malatang.jpg", name: "마라샹궈", price: "₩20,000", brand: "A 브랜드", store: "네이버 쇼핑" },
            { id: 2, image: "/malatang.jpg", name: "마라탕", price: "₩12,000", brand: "B 브랜드", store: "쿠팡" },
            { id: 3, image: "/malatang.jpg", name: "사천 마라탕", price: "₩15,000", brand: "C 브랜드", store: "11번가" },
            { id: 4, image: "/malatang.jpg", name: "핫 마라탕", price: "₩9,500", brand: "D 브랜드", store: "G마켓" }
        ]);
        setReceiptImage("/sinsa.jpg"); //나중에 백에서 이미지 받아오면 변경할 수 있도록..
    }, []);

    //체크박스 클릭할 때 실행됨
    const handleCheckboxChange = (id) => {
        setCheckedItems((prevChecked) =>
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
        const selectedProducts = products.filter((product) => checkedItems.includes(product.id));
        console.log("🛒 장바구니에 담을 상품:", selectedProducts);

        //나중에 백엔드에 장바구니 추가하는 API 호출하면 되겠죠?
        navigate("/cart"); //장바구니 페이지로 이동!
    };

    return (
        <div className="compare-container">
            {/*홈으로*/}
            <div className="home-icon-container">
                <a href="/home" className="home-link">
                    <div className="home-icon"><span>⌂</span></div>
                </a>
            </div>

            <div className="main-content">
                {/*구글 비전으로 추출된 검색어 아님 받아온 검색어*/}
                <h2 className="title">해당 "{searchQuery}" 상품<br />온라인 비교</h2>

                {/*내가 찍은 가격표 이미지*/}
                <div className="money-image-container">
                    <img src={receiptImage} alt="내가 찍은 가격표" className="money-image" />
                </div>

                {/*네이버 쇼핑에서 가져온 비슷한 상품 리스트 나열*/}
                <div className="product-list">
                    {products.map((product) => (
                        <div key={product.id} className="product-item">
                            <div className="product-info">
                                <div className="product-image-container">
                                    <img src={product.image} alt={product.name} className="product-image" />
                                </div>
                                <span className="product-description">
                                    {product.brand} / {product.name} / {product.price} / {product.store}
                                </span>
                            </div>
                            {/*체크박스*/}
                            <input
                                type="checkbox"
                                checked={checkedItems.includes(product.id)}
                                onChange={() => handleCheckboxChange(product.id)}
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