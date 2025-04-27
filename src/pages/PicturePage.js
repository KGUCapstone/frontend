import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/PicturePage.css";
import axios from "axios";

const PicturePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const photo = location.state?.photo;

  const handleUpload = async () => {
    try {
      // base64 → Blob 변환
      const blob = await fetch(photo).then((res) => res.blob());
      const formData = new FormData();
      formData.append("file", blob, "image.png");

      // FastAPI로 이미지 전송
      const response = await axios.post(
        process.env.REACT_APP_FASTAPI_URL + "/analyze/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response.data;
      console.log("Spring에서 받은 결과:", result);

      navigate("/compareItem", {
        state: {
          items: result.items,
          searchQuery: result.title,
          receiptImage: photo,
          compareItemPrice: result.compareItem.price,
        },
      });
    } catch (error) {
      console.error("에러 발생:", error);
      const message =
        error.response?.data?.message ||
        "이미지 업로드 중 오류가 발생했습니다.";
      alert("분석 실패: " + message);
    }
  };

  if (!photo) {
    return <p>사진이 없습니다. 다시 촬영해주세요.</p>;
  }

  return (
    <div className="picture-page">
      <h2>촬영한 이미지</h2>
      <img src={photo} alt="Captured" className="captured-image" />

      <button className="camera-button" onClick={() => navigate("/camera")}>
        ↩️ 다시 촬영
      </button>

      <button className="camera-button" onClick={handleUpload}>
        확인
      </button>
    </div>
  );
};

export default PicturePage;
