import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/PicturePage.css";

const PicturePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const photo = location.state?.photo;

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

      {/* 백으로 이미지 보내기 */}
      <button  className="camera-button" >확인</button>
    </div>
  );
};

export default PicturePage;
