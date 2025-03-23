import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from "react-router-dom";

const Join = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordCheck: '',
    email: '',
    name: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/join', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert(`회원가입 완료! 환영합니다, ${response.data.name}님`);
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('회원가입에 실패했습니다.');
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="아이디" value={formData.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required />
        <input type="password" name="passwordCheck" placeholder="비밀번호 확인" value={formData.passwordCheck} onChange={handleChange} required />
        <input type="email" name="email" placeholder="이메일" value={formData.email} onChange={handleChange} required />
        <input type="text" name="name" placeholder="이름" value={formData.name} onChange={handleChange} required />
        <button type="submit">회원가입</button>
      </form>
      {error && <p style={{ color: 'red' }}>🚫 {error}</p>}
      {success && <p style={{ color: 'green' }}>✅ {success}</p>}
    </div>
  );
};

export default Join;
