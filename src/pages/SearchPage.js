import React, { useState } from "react";
import api from "../api";

const SearchPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    brand: "",
    volume: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      price: "",
      brand: "",
      volume: "",
    });
    setSearchResults([]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    const postData = {
      ...formData,
      price: formData.price ? Number(formData.price) : "",
    };

    console.log("API 요청 데이터:", postData);

    try {
      const res = await api.post("/shopping/search", postData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      console.log("API 응답 데이터:", res.data);
      const items = res.data.items || [];

      if (items.length === 0) {
        setError("검색 결과가 없습니다.");
      }

      setSearchResults(items);
    } catch (err) {
      const msg = err.response?.data?.error || "검색 중 오류가 발생했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ios-search-page">
      <h1>SearchPage</h1>

      {/* 고급 검색 필드 */}
      <form onSubmit={handleSubmit} className="search-container">
        <div>
          <label>상품명</label>
          <input
            type="text"
            name="title"
            placeholder="상품명을 입력하세요"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>가격</label>
          <input
            type="number"
            name="price"
            placeholder="가격을 입력하세요"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>브랜드</label>
          <input
            type="text"
            name="brand"
            placeholder="브랜드를 입력하세요"
            value={formData.brand}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>용량</label>
          <input
            type="text"
            name="volume"
            placeholder="용량을 입력하세요"
            value={formData.volume}
            onChange={handleChange}
          />
        </div>

        {/* 검색 버튼 */}
        <button type="submit" disabled={loading}>
          {loading ? "검색 중..." : "검색하기"}
        </button>
        <button type="button" onClick={handleCancel}>
          취소
        </button>
      </form>

      {/* 검색 결과 */}
      <div className="search-results">
        {loading ? (
          <div>로딩 중...</div>
        ) : searchResults.length > 0 ? (
          <ul>
            {searchResults.map((item, index) => (
              <li key={index}>
                <div>{item.title}</div>
                <div>{item.brand}</div>
                <div>{item.lprice}원</div>
                {item.volume && <div>{item.volume}</div>}
              </li>
            ))}
          </ul>
        ) : (
          error && <small>{error}</small>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
