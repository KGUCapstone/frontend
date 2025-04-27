import React, { useState } from "react";
import "../style/SearchBar.css";
import { useNavigate } from "react-router-dom";
import api from "../api";

const SearchBar = () => {
  const navigate = useNavigate();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    brand: "",
    volume: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCancel = () => {
    // 취소 버튼
    setFormData({
      title: "",
      price: "",
      brand: "",
      volume: "",
    });
  };

  const postData = {
    ...formData,
    price: formData.price ? Number(formData.price) : "",
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    // 유효성 검사 (추가)
    if (!formData.title.trim()) {
      alert("상품명을 입력해주세요.(필수)");
      return;
    } else if (!formData.price.trim()) {
      alert("가격을 입력해주세요.(필수)");
      return;
    }

    if (formData.price && isNaN(Number(formData.price))) {
      alert("가격은 숫자로 입력해주세요.");
      return;
    }

    console.log("API 요청 데이터:", postData); // 요청 데이터 확인

    try {
      const res = await api.post("/shopping/search", postData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      console.log("API 응답 데이터:", res.data); // 응답 데이터 확인용
      const items = res.data.items || [];
      const compareItemPrice = res.data.compareItem.price || null;

      //compareItem 페이지로 백에서 api 로 받아온 items을 props로 넘기기
      navigate("/compareItem", {
        state: { items, compareItemPrice, searchQuery: formData.title },
      });
    } catch (err) {
      console.log("오류가 발생");
      console.error("API 요청 실패:", err.response?.data || err.message);
      alert("상품 검색에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          name="title"
          placeholder="상품명 입력"
          value={formData.title}
          onChange={handleChange}
        />
        {/* 🔍 아이콘 클릭 시 handleSubmit 실행 (검색 기능 연동) */}
        <button type="button" className="search-icon" onClick={handleSubmit}>
          🔍
        </button>
        <button
          type="button"
          className="toggle-advanced"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          ▼
        </button>
      </div>

      {/* 상세 검색 (가격, 용량) */}
      {showAdvanced && (
        <form className="advanced-search" onSubmit={handleSubmit}>
          <input
            type="text"
            name="price"
            placeholder="가격"
            value={formData.price}
            onChange={handleChange}
          />
          <input
            type="text"
            name="volume"
            placeholder="용량 (선택)"
            value={formData.volume}
            onChange={handleChange}
          />
          <input
            type="text"
            name="brand"
            placeholder="브랜드 (선택)"
            value={formData.brand}
            onChange={handleChange}
          />
          <button type="submit">검색</button>
        </form>
      )}
    </div>
  );
};

export default SearchBar;
