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
        setError('회원가입에 실패했습니다.11');
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
    <h2>회원가입</h2>
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
      
      <div>
        <input type="text" name="username" placeholder="아이디" value={formData.username} onChange={handleChange} required />
        <small style={{ color: 'gray' }}>※ 영문 + 숫자 조합, 8자 이상</small>
      </div>

      <div>
        <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required />
        <small style={{ color: 'gray' }}>※ 영문, 숫자, 특수문자 포함 8자 이상</small>
      </div>

      <div>
        <input type="password" name="passwordCheck" placeholder="비밀번호 확인" value={formData.passwordCheck} onChange={handleChange} required />
        
      </div>

      <div>
        <input type="email" name="email" placeholder="이메일" value={formData.email} onChange={handleChange} required />
        <small style={{ color: 'gray' }}>※ 이메일 형식</small>
      </div>

      <div>
        <input type="text" name="name" placeholder="이름" value={formData.name} onChange={handleChange} required />
        
      </div>

      <button type="submit">회원가입</button>
    </form>

    {error && <p style={{ color: 'red', marginTop: 10 }}>🚫 {error}</p>}
    {success && <p style={{ color: 'green', marginTop: 10 }}>✅ {success}</p>}
  </div>
  );
};

export default Join;
