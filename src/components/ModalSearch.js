import React, { useState } from "react";
import "../style/ModalSearch.css";
import "../style/AlertDesign.css";
import { useNavigate } from "react-router-dom";
import api from "../api";
import swal from "sweetalert";

const ModalSearch = ({ onClose }) => {
  const navigate = useNavigate();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    brand: "",
    volume: "",
    volumeUnit: "ml",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      price: "",
      brand: "",
      volume: "",
      volumeUnit: "ml",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.title.trim()) {
      //alert("상품명을 입력해주세요.(필수)");
      swal({
        title: "상품명을 입력해주세요. (필수)",
        icon: "warning",
        button: "확인",
        className: "custom-swal-warning",
      });
      return;
    } else if (!formData.price.trim()) {
      //alert("가격을 입력해주세요.(필수)");
      swal({
        title: "가격을 입력해주세요. (필수)",
        icon: "warning",
        button: "확인",
        className: "custom-swal-warning",
      });
      return;
    }

    if (formData.price && isNaN(Number(formData.price))) {
      //alert("가격은 숫자로 입력해주세요.");
      swal({
        title: "가격은 숫자로 입력해주세요.",
        icon: "warning",
        button: "확인",
        className: "custom-swal-warning",
      });
      return;
    }

    // 볼륨 단위가 있는 경우 합치기
    const volumeWithUnit = formData.volume
      ? `${formData.volume}${formData.volumeUnit}`
      : "";

    // API 요청 데이터 구성
    const postData = {
      title: formData.title,
      price: formData.price ? Number(formData.price) : "",
      brand: formData.brand,
      volume: volumeWithUnit,
    };

    console.log("API 요청 데이터:", postData);

    try {
      const res = await api.post("/shopping/search", postData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      console.log("API 응답 데이터:", res.data);
      const items = res.data.items || [];
      const compareItemPrice = res.data.compareItem.price || null;

      // 검색 결과 페이지로 이동
      navigate("/compareItem", {
        state: {
          items,
          compareItemPrice,
          searchQuery: formData.title,
        },
      });

      // 모달 닫기
      onClose();
    } catch (err) {
      console.log("오류가 발생");
      console.error("API 요청 실패:", err.response?.data || err.message);
      //alert("상품 검색에 실패했습니다. 다시 시도해주세요.");
      swal({
        title: "상품 검색에 실패했습니다.",
        text: "다시 시도해주세요.",
        icon: "warning",
        button: "확인",
        className: "custom-swal-warning",
      });
    }
  };

  const volumeUnits = [
    "ml",
    "L",
    "g",
    "kg",
    "oz",
    "개",
    "팩",
    "통",
    "박스",
    "세트",
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="greeting-text">
            <h2>어떤 상품을 찾으세요?</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="search-field">
            <label>상품명 *</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="title"
                placeholder="상품명 입력"
                value={formData.title}
                onChange={handleChange}
                autoFocus
              />
            </div>
          </div>

          <div className="search-field">
            <label>가격 *</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="price"
                placeholder="가격 입력 (60%~130% 범위로 검색)"
                value={formData.price}
                onChange={handleChange}
              />
              <span className="unit">원</span>
            </div>
          </div>

          <button
            type="button"
            className="toggle-advanced"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? "기본 검색으로 돌아가기" : "상세 검색 옵션 보기"}
          </button>

          {showAdvanced && (
            <>
              <div className="search-field">
                <label>용량 (선택)</label>
                <div className="volume-input">
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="volume"
                      placeholder="용량을 입력하세요"
                      value={formData.volume}
                      onChange={handleChange}
                    />
                  </div>
                  <select
                    name="volumeUnit"
                    value={formData.volumeUnit}
                    onChange={handleChange}
                    className="unit-select"
                  >
                    {volumeUnits.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="search-field">
                <label>브랜드명 (선택)</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="brand"
                    placeholder="브랜드명을 입력하세요"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                초기화
              </button>
            </>
          )}

          <button type="submit" className="search-button">
            <span>검색하기</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalSearch;
