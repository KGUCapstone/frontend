import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../style/CameraPage.css";
import BottomNav from "../components/BottomNav";

const CameraPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("카메라 접근 실패:", err);
      }
    };
    enableCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = video.videoWidth;
    const height = video.videoHeight;

    const cropX = width * 0.05;
    const cropY = height * 0.2;
    const cropWidth = width * 0.9;
    const cropHeight = height * 0.55;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.drawImage(
        video,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
    );

    const image = canvas.toDataURL("image/png");
    navigate("/picture", { state: { photo: image } });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const image = canvas.toDataURL("image/png");
        navigate("/picture", { state: { photo: image } });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
      <>
        <header className="main-header">
          <div className="header-spacer" />
          <div className="logo" onClick={() => navigate("/home")}>GAVION</div>
        </header>

        <div className="camera-container">
          <div className="camera-card">
            <h2 className="camera-title">가격표 촬영</h2>

            <div style={{ position: "relative", width: "100%" }}>
              <video ref={videoRef} autoPlay playsInline className="camera-video" />
              <div className="camera-frame" />
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="camera-file-input"
                id="file-upload"  // id 추가
            />
            <label htmlFor="file-upload" className="camera-file-label">
              파일 선택
            </label>
            <button onClick={capture} className="camera-button">촬영하기</button>

            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        </div>

        <BottomNav />
      </>
  );
};

export default CameraPage;