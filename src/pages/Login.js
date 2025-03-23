import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      navigate("/mypage");
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
  
  return (
    <>

      <div>
        <h2>로그인</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">로그인</button>
        </form>
      </div>

      <br></br>     

      <div className="oauth-buttons">
          <button 
              className="btn-naver" 
              onClick={handleNaverLogin} 
              style={{ 
                  backgroundColor: '#03C75A', 
                  color: 'white', 
                  padding: '10px 20px', 
                  margin: '5px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer' 
              }}
          >
              네이버 로그인
          </button>
      </div>
   
      <a href="/join">회원가입</a>

    </>
  );
};

export default Login;
