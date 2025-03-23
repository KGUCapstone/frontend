import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Mainpage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await api.get("/auth/token", {
          withCredentials: true, 
        });

        const accessToken = response.data.accessToken;
        if (accessToken) {
          localStorage.setItem("Authorization", `Bearer ${accessToken}`);
          console.log("토큰 저장 완료:", accessToken);
        } else {
          console.error("Authorization 헤더 없음");
        }
      } catch (error) {
        console.error("토큰 요청 실패:", error);
      }
    };

    fetchAccessToken();
  }, []);

  useEffect(() => {
    const fetchMypage = async () => {
      try {
        const token = localStorage.getItem("Authorization");
        const response = await api.get("/mypage", {
          headers: {
            Authorization: token ? token : "",
          },
        });

        setUser(response.data.username);
        setName(response.data.name);
        console.log("마이페이지 로드 성공");
      } catch (error) {
        console.error("인증 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMypage();
  }, []);



  return (
    <div>
      <h2>메인 페이지</h2>
      {loading ? (
        <p>로딩 중...</p>
      ) : user ? (
        <p>안녕하세요, {user}님, {name}</p>
      ) : (
        <p>유저 정보를 불러올 수 없습니다.</p>
      )}

      <a href="/mypage">마이페이지</a>
    </div>
  );
};

export default Mainpage;
