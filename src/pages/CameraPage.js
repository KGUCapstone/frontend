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
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("카메라 접근 실패:", err);
      }
    };
    enableCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    ctx.drawImage(video, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    const image = canvas.toDataURL("image/png");
    navigate("/picture", { state: { photo: image } });
  };

  return (
    <div className="camera-wrapper">
      <h2>가격표 촬영</h2>
      <div className="camera-container">
        <video ref={videoRef} autoPlay playsInline className="camera-video" />
        <div className="camera-frame" />
      </div>

      <button onClick={capture} className="camera-button">촬영하기</button>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <BottomNav/>
    </div>
  );
};

export default CameraPage;
