import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from "react-router-dom";
import '../style/AuthForm.css';
import '../style/LoginForm.css';
import titleImage from '../assets/title.svg';
import naverIcon from '../assets/naver_logo.svg';
import googleIcon from '../assets/google_logo.svg';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { username, password });
      const accessToken = response.headers["authorization"];
      if (accessToken) {
        localStorage.setItem("Authorization", accessToken); // Bearer 포함됨
      }
      alert("로그인 성공");
      navigate("/home");
    } catch (error) {
      console.log(error)
      alert("로그인 실패");
    }
  };

  const handleNaverLogin = async () => {
    try {
        // 네이버 로그인 URL 가져오기
        const response = await api.get("/auth/naver");

        window.location.href = response.data; // 네이버 로그인 페이지로 이동

        const accessToken = response.headers["authorization"];
        if (accessToken) {
          localStorage.setItem("Authorization", accessToken); // Bearer 포함됨
        }
    } catch (error) {
        console.error("네이버 로그인 URL 요청 실패:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
        // 구글 로그인 URL 가져오기
        const response = await api.get("/auth/google");

        window.location.href = response.data; // 구글 로그인 페이지로 이동

        const accessToken = response.headers["authorization"];
        if (accessToken) {
          localStorage.setItem("Authorization", accessToken); // Bearer 포함됨
        }
    } catch (error) {
        console.error("구글 로그인 URL 요청 실패:", error);
    }
  };

return (
  <div className="auth-container">
    <form className="auth-form" onSubmit={handleLogin}>
    <header>
          <div className="home-title">
            <img src={titleImage} alt="title" className="title-image" />
            

          </div>
        </header>

      <h2>로그인</h2>

      <input
        type="text"
        placeholder="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="auth-button">로그인</button>


    <div className="signup-link">
      계정이 없으신가요? <a href="/join">회원가입</a>
    </div>
    </form>

      <div className="sns-login">
          <button className="naver-button" onClick={handleNaverLogin}>
              <img src={naverIcon} alt="네이버 로그인" />
          </button>

          <button className="google-button" onClick={handleGoogleLogin}>
              <img src={googleIcon} alt="구글 로그인" />
          </button>
      </div>
  </div>
  
);
};

export default LoginForm;
