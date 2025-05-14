import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/PicturePage.css";
import axios from "axios";
import api from "../api";

const PicturePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const photo = location.state?.photo;

  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      const blob = await fetch(photo).then((res) => res.blob());
      const formData = new FormData();
      formData.append("file", blob, "image.png");

      const response = await axios.post(
          process.env.REACT_APP_FASTAPI_URL + "/analyze/",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(response.data);

    } catch (error) {
      alert("분석 실패: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      console.log("result: ",result);

      const response = await api.post("/shopping/search", result);
      const items = response.data.items || [];
      const compareItemPrice = response.data.compareItem.price || null;

      // 검색 결과 페이지로 이동
      navigate("/compareItem", {
        state: {
          items,
          compareItemPrice,
          searchQuery: result.title
        }
      });

    } catch (error) {
      alert("검색 실패: " + (error.response?.data?.message || error.message));
    }
  };

  React.useEffect(() => {
    if (photo) {
      handleAnalyze();
    }
  }, [photo]);

  if (!photo) return <p>사진이 없습니다. 다시 촬영해주세요.</p>;

  return (
      <div className="picture-page">
        <h2>촬영한 이미지</h2>
        <img src={photo} alt="Captured" className="captured-image" />

        {loading && <p>이미지 분석 중...</p>}

        {result && (
            <div className="result-section">
              <div className="input-group">
                <label>상품명</label>
                <input
                    type="text"
                    value={result.title}
                    onChange={(e) => setResult({ ...result, title: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>브랜드</label>
                <input
                    type="text"
                    value={result.brand}
                    onChange={(e) => setResult({ ...result, brand: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>용량</label>
                <input
                    type="text"
                    value={result.volume}
                    onChange={(e) => setResult({ ...result, volume: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>가격</label>
                <input
                    type="text"
                    value={result.price}
                    onChange={(e) => setResult({ ...result, price: e.target.value })}
                />
              </div>

              <div className="button-group">
                <button className="camera-button search" onClick={handleSearch}>
                  🔍 검색하기
                </button>
                <button className="camera-button retry" onClick={() => navigate("/camera")}>
                  🔄 다시 촬영
                </button>
              </div>
            </div>
        )}

      </div>
  );
};

export default PicturePage;
