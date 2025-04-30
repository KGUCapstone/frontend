import React, { useState } from "react";
import BottomNav from "../components/BottomNav";
import HomeButton from "../components/HomeButton";
import "../style/CheckListPage.css";

const CheckListPage = () => {

  const initialStoreData = {
    homeplus: [
      { id: "hp1", title: "포카집", checked: true, price: "2,500원", brand: "오리온", quantity: "66g" },
      { id: "hp2", title: "생수", checked: false, price: "890원", brand: "삼다수", quantity: "2L" },
      { id: "hp3", title: "바나나우유", checked: false, price: "1,350원", brand: "빙그레", quantity: "240ml" },
    ],
    emart: [
      { id: "em1", title: "라면", checked: false, price: "1,250원", brand: "농심", quantity: "120g" },
      { id: "em2", title: "사과", checked: false, price: "5,900원", brand: "국내산", quantity: "1.5kg" },
    ],
    cu: [
      { id: "cu1", title: "삼각김밥", checked: false, price: "1,500원", brand: "CU", quantity: "1개" },
      { id: "cu2", title: "콜라", checked: false, price: "2,100원", brand: "코카콜라", quantity: "500ml" },
    ]
  };
  
  // 상태 관리
  const [activeStore, setActiveStore] = useState("homeplus");
  const [storeData, setStoreData] = useState(initialStoreData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    brand: "",
    quantity: ""
  });

  const hasSelectedProducts = () => {
    return storeData[activeStore].some(product => product.checked);
  };
  
  const selectedProductCount = () => {
    return storeData[activeStore].filter(product => product.checked).length;
  };
  
  const handleStoreChange = (store) => {
    setActiveStore(store);
    setShowAddForm(false);
  };

  const handleProductToggle = (id) => {
    setStoreData({
      ...storeData,
      [activeStore]: storeData[activeStore].map(product => 
        product.id === id 
          ? { ...product, checked: !product.checked }
          : product
      )
    });
  };

  const handleSelectAll = () => {
    const currentProducts = storeData[activeStore];
    const allSelected = currentProducts.every(product => product.checked);
    
    setStoreData({
      ...storeData,
      [activeStore]: currentProducts.map(product => ({
        ...product,
        checked: !allSelected
      }))
    });
  };

  const handleNewProductChange = (field, value) => {
    setNewProduct({
      ...newProduct,
      [field]: value
    });
  };

  const addNewProduct = () => {

    if (!newProduct.title.trim()) return;
    
    const newProductObj = {
      id: `${activeStore}${Date.now()}`,
      title: newProduct.title.trim(),
      price: newProduct.price.trim() || "가격 정보 없음",
      brand: newProduct.brand.trim() || "브랜드 정보 없음",
      quantity: newProduct.quantity.trim() || "용량 정보 없음",
      checked: false
    };
    
    setStoreData({
      ...storeData,
      [activeStore]: [...storeData[activeStore], newProductObj]
    });
    
    setNewProduct({ title: "", price: "", brand: "", quantity: "" });
    setShowAddForm(false);
  };
  
  const deleteSelectedProducts = () => {
    setStoreData({
      ...storeData,
      [activeStore]: storeData[activeStore].filter(product => !product.checked)
    });
  };

  return (
    <div className="main-container">
      <HomeButton />
      <div className="checklist-container">
        <div className="checklist-card">
          <div className="tab-container">
            <button 
              className={`tab-button ${activeStore === "homeplus" ? "active" : ""}`}
              onClick={() => handleStoreChange("homeplus")}
            >
              홈플러스
            </button>
            <button 
              className={`tab-button ${activeStore === "emart" ? "active" : ""}`}
              onClick={() => handleStoreChange("emart")}
            >
              이마트
            </button>
            <button 
              className={`tab-button ${activeStore === "cu" ? "active" : ""}`}
              onClick={() => handleStoreChange("cu")}
            >
              CU편의점
            </button>
          </div>
          
          <div className="store-header">
            <div 
              className="select-all"
              onClick={handleSelectAll}
            >
              <div className="checkbox">
                {storeData[activeStore].every(product => product.checked) && <span>✓</span>}
              </div>
              <div className="task-text">전체선택</div>
            </div>
            <div className="action-buttons">
              <button 
                className="add-button" 
                onClick={() => setShowAddForm(!showAddForm)}
              >
                상품추가
              </button>
              {hasSelectedProducts() && (
                <button 
                  className="delete-button" 
                  onClick={deleteSelectedProducts}
                >
                  삭제
                </button>
              )}
            </div>
          </div>
          
          {showAddForm && (
            <div className="add-product-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="상품명 (필수)"
                  value={newProduct.title}
                  onChange={(e) => handleNewProductChange("title", e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="가격"
                  value={newProduct.price}
                  onChange={(e) => handleNewProductChange("price", e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="브랜드"
                  value={newProduct.brand}
                  onChange={(e) => handleNewProductChange("brand", e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="용량"
                  value={newProduct.quantity}
                  onChange={(e) => handleNewProductChange("quantity", e.target.value)}
                  className="form-input"
                />
              </div>
              <button 
                className="save-button"
                onClick={addNewProduct}
              >
                저장하기
              </button>
            </div>
          )}
          
          <div className="checklist-items">
            {storeData[activeStore].map((product) => (
              <div 
                key={product.id} 
                className={`checklist-item ${product.checked ? "checked" : ""}`}
                onClick={() => handleProductToggle(product.id)}
              >
                <div className="checkbox">
                  {product.checked ? <span>✓</span> : <span></span>}
                </div>
                <div className="product-info">
                  <div className="product-title">{product.title}</div>
                  <div className="product-details">
                    <span className="product-price">{product.price}</span> | 
                    <span className="product-brand">{product.brand}</span> | 
                    <span className="product-quantity">{product.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="new-task-container">
            <button
              className={`compare-button ${hasSelectedProducts() ? "active" : ""}`}
              disabled={!hasSelectedProducts()}
            >
              {hasSelectedProducts() 
                ? `${selectedProductCount()}개 상품 비교하기` 
                : "비교하기"}
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default CheckListPage;