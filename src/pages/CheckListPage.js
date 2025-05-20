import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
// import HomeButton from "../components/HomeButton";
import "../style/CheckListPage.css";
import api from "../api";

const CheckListPage = () => {
  const navigate = useNavigate();

  const initialProducts = [
    { id: "p1", title: "포카칩", checked: false, price: "2,500원", brand: "오리온", quantity: "66g" },
    { id: "p2", title: "생수", checked: false, price: "890원", brand: "삼다수", quantity: "2L" },
  ];

  const [selectedStores, setSelectedStores] = useState(["homeplus"]);
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    brand: "",
    quantity: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products"));
    if (storedProducts && storedProducts.length > 0) {
      setProducts(storedProducts);
    } else {
      setProducts(initialProducts);
      localStorage.setItem("products", JSON.stringify(initialProducts));
    }
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  const getSelectedProducts = () => products.filter(product => product.checked);
  const selectedProductCount = () => getSelectedProducts().length;
  const hasSelectedProducts = () => selectedProductCount() > 0;

  const handleProductToggle = (id) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, checked: !product.checked } : product
    ));
  };

  const handleSelectAll = () => {
    const allSelected = products.every(product => product.checked);
    setProducts(products.map(product => ({ ...product, checked: !allSelected })));
  };

  const handleNewProductChange = (field, value) => {
    setNewProduct({ ...newProduct, [field]: value });
  };

  const addNewProduct = () => {
    if (!newProduct.title.trim()) return;
    const newProductObj = {
      id: `p${Date.now()}`,
      title: newProduct.title.trim(),
      price: newProduct.price.trim() || null,
      brand: newProduct.brand.trim() || "",
      quantity: newProduct.quantity.trim() || "",
      checked: false
    };
    setProducts([...products, newProductObj]);
    setNewProduct({ title: "", price: "", brand: "", quantity: "" });
    setShowAddForm(false);
  };

  const deleteSelectedProducts = () => {
    const updatedProducts = products.filter(product => !product.checked);
    setProducts(updatedProducts);
  };

  const extractPriceNumber = (priceStr) => {
    if (!priceStr) return 0;
    const numericValue = priceStr.replace(/[^0-9]/g, '');
    return numericValue ? parseInt(numericValue, 10) : 0;
  };

  const toggleStoreSelection = (store) => {
    setSelectedStores(prev =>
      prev.includes(store)
        ? prev.filter(s => s !== store)
        : [...prev, store]
    );
  };

  const prepareCompareData = () => {
    const mallNames = selectedStores.map(getKoreanStoreName);
    const conditions = getSelectedProducts().map(product => ({
      title: product.title,
      price: extractPriceNumber(product.price),
      brand: product.brand,
      volume: product.quantity
    }));
    return {
      conditions,
      mallNames
    };
  };

  const handleCompare = async () => {
    if (!hasSelectedProducts()) return;

    try {
      setIsLoading(true);
      const compareRequestDto = prepareCompareData();
      const response = await api.post("/shopping/compare/grouped", compareRequestDto);
      const result = response.data;
      navigate("/comparison-results", { state: { results: result } });
      alert("비교 결과가 준비되었습니다. 결과 페이지로 이동합니다.");
    } catch (error) {
      alert("상품 비교 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const getKoreanStoreName = (store) => {
    if (store === "homeplus") return "홈플러스";
    if (store === "emart") return "이마트";
    if (store === "트레이더스") return "트레이더스";
    return false;
    //return "CU편의점";
  };

  return (
    <div className="main-container">
      <header className="main-header">
        <div className="header-spacer" />
        <div className="logo" onClick={() => navigate("/home")}>GAVION</div>
      </header>

      <div className="scrollable-content">
        {/* <div className="main-container"> */}
          <div className="checklist-container">
            <div className="checklist-card">
              <header className="checklist-header">
                <h2>📍체크리스트</h2>
              </header>
              <div className="store-selection-container">
                {["homeplus", "emart", "트레이더스"].map(store => (
                  <div
                    key={`store-${store}`}
                    className={`store-radio-button ${selectedStores.includes(store) ? "selected" : ""}`}
                    onClick={() => toggleStoreSelection(store)}
                  >
                    <input
                      type="checkbox"
                      id={`store-${store}`}
                      name="store"
                      value={store}
                      checked={selectedStores.includes(store)}
                      onChange={() => { }}
                      className="store-radio-input"
                    />
                    <span className="store-name">{getKoreanStoreName(store)}</span>
                  </div>
                ))}
              </div>

              <div className="store-header">
                <div className="select-all" onClick={handleSelectAll}>
                  <div className="checkbox">
                    {products.every(product => product.checked) && <span>✓</span>}
                  </div>
                  <div className="task-text">전체선택</div>
                </div>
                <div className="action-buttons">
                  <button className="add-button" onClick={() => setShowAddForm(!showAddForm)}>
                    상품추가
                  </button>
                  {products.some(product => product.checked) && (
                    <button className="delete-button" onClick={deleteSelectedProducts}>
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
                  <button className="save-button" onClick={addNewProduct}>
                    저장하기
                  </button>
                </div>
              )}

              <div className="checklist-items">
                {products.map((product) => (
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

              <div className="compare-button-container">
                <button
                  className={`compare-button ${hasSelectedProducts() ? "active" : ""}`}
                  disabled={!hasSelectedProducts() || isLoading}
                  onClick={hasSelectedProducts() && !isLoading ? handleCompare : undefined}
                >
                  {isLoading
                    ? "비교 중..."
                    : hasSelectedProducts()
                      ? `${selectedProductCount()}개 상품 비교하러 가기`
                      : "비교하러 가기"}
                </button>
              </div>
            </div>
          </div>
        {/* </div> */}
        <BottomNav />
      </div>
    </div>
  );
};

export default CheckListPage;
