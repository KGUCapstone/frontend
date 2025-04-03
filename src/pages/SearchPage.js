import React, { useState } from "react";
import api from "../api";
import "../style/SearchPage.css";

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
  const [showResults, setShowResults] = useState(false);

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
    setShowResults(false); // 검색 폼 화면으로 복귀
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    const postData = {
      ...formData,
      price: formData.price ? Number(formData.price) : "",
    };

    console.log("API 요청 데이터:", postData); // 요청 데이터 확인

    try {
      const res = await api.post("/shopping/search", postData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      console.log("API 응답 데이터:", res.data); // 응답 데이터 확인용
      const items = res.data.items || [];

      if (items.length === 0) {
        setError("검색 결과가 없습니다.");
      }

      setSearchResults(items);
      setShowResults(true);
    } catch (err) {
      const msg = err.response?.data?.error || "검색 중 오류가 발생했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div>
        <h1 className="textDes">상품 검색 페이지</h1>
      </div>
      {/* 검색 폼 */}
      {!showResults && (
        <div>
          <form onSubmit={handleSubmit} className="search-container">
            <div className="input-container">
              <div>
                <label className="input-label">상품명</label>
                <div className="search-input">
                  <div className="input-box">
                    <input
                      className="input_border"
                      type="text"
                      name="title"
                      placeholder="상품명을 입력하세요"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="input-label">가격</label>
                <div className="search-input">
                  <div className="input-box">
                    <input
                      className="input_border"
                      type="number"
                      name="price"
                      placeholder="가격을 입력하세요"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="input-label">브랜드</label>
                <div className="search-input">
                  <div className="input-box">
                    <input
                      className="input_border"
                      type="text"
                      name="brand"
                      placeholder="브랜드를 입력하세요"
                      value={formData.brand}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="input-label">용량</label>
                <div className="search-input">
                  <div className="input-box">
                    <input
                      className="input_border"
                      type="text"
                      name="volume"
                      placeholder="용량을 입력하세요"
                      value={formData.volume}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 검색 버튼 */}
            <button type="submit" disabled={loading} className="button">
              {loading ? "검색 중..." : "검색하기"}
            </button>
          </form>

          {/* 초기화 버튼 */}
          <button type="button" onClick={handleCancel} className="button">
            초기화
          </button>
        </div>
      )}

      {/* 검색 결과 */}
      {showResults && (
        <div className="search-results">
          {loading ? (
            <div>로딩 중...</div>
          ) : searchResults.length > 0 ? (
            <ul>
              {searchResults.map((item, index) => (
                <li key={index}>
                  <div>
                    {item.title} {item.brand} {item.lprice}원
                  </div>
                  {item.volume && <div>{item.volume}</div>}
                </li>
              ))}
            </ul>
          ) : (
            error && <small>{error}</small>
          )}

          {/* 초기화 버튼 */}
          <button type="button" onClick={handleCancel} className="button">
            초기화
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
