import api from "../api";
import titleImage from '../assets/title.svg';
import "../style/AuthForm.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Join = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordCheck: "",
    email: "",
    name: "",
  });


  const [error, setError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/join", formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      alert(`회원가입 완료! 환영합니다, ${res.data.name}님`);
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.error || "회원가입에 실패했습니다.";
      setError(msg);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
      <header>
      <div className="home-title">
            <img src={titleImage} alt="title" className="title-image" />
            

          </div>
        </header>
        <h2>회원가입</h2>

        <input
          type="text"
          name="username"
          placeholder="아이디"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <small>※ 영문 + 숫자 조합, 4~20자</small>

        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <small>※ 영문, 숫자, 특수문자 포함 8자 이상</small>

        <input
          type="password"
          name="passwordCheck"
          placeholder="비밀번호 확인"
          value={formData.passwordCheck}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <small>※ 이메일 형식</small>

        <input
          type="text"
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <small>※ 특수문자 없이 한글/영문만</small>

        <button type="submit" className="auth-button">
          회원가입
        </button>

        {error && <p className="error-msg">🚫 {error}</p>}
      </form>
    </div>
  );
};

export default Join;
