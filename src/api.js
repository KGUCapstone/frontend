import axios from "axios";

//const backendUrl = "http://localhost:8080/api";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// 일반 요청에 사용할 axios 인스턴스
const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true // 쿠키를 항상 전송
});

// 토큰 재발급 전용 axios 인스턴스 (인터셉터 없음)
const refreshApi = axios.create({
  baseURL: backendUrl,
  withCredentials: true
});

// 토큰 재발급이 진행 중인지 확인하는 변수
let isRefreshing = false;
// 토큰 재발급 대기 중인 요청들의 큐
let failedQueue = [];

// 큐에 있는 요청들을 처리하는 함수
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      // Bearer 접두사 일관성 있게 처리
      const tokenValue = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      config.headers.Authorization = tokenValue;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    // 로그인 응답에서 토큰 저장
    if (response.config.url === "/login" && response.headers["authorization"]) {
      localStorage.setItem("Authorization", response.headers["authorization"]);
      console.log("로그인 성공, 토큰 저장됨:", response.headers["authorization"]);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 401 에러 감지 및 재시도 방지
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 이미 재발급 중이면 큐에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = token;
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        console.log("토큰 재발급 시도...");
        const response = await refreshApi.post("/reissue");
        const newToken = response.headers["authorization"];
        
        if (newToken) {
          console.log("토큰 재발급 성공:", newToken);
          localStorage.setItem("Authorization", newToken);
          
          // 원본 요청 헤더 업데이트
          originalRequest.headers.Authorization = newToken;
          
          // 대기 중인 요청들 처리
          processQueue(null, newToken);
          
          return axios(originalRequest);
        } else {
          console.error("토큰 재발급 응답에 토큰이 없음");
          processQueue(new Error("토큰 재발급 실패"));
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error("토큰 재발급 실패:", refreshError);
        localStorage.removeItem("Authorization");
        processQueue(refreshError);
        
        // 명시적으로 상태 코드 체크
        if (refreshError.response?.status === 403) {
          console.log("리프레시 토큰 만료됨");
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          window.location.href = "/";
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);


export default api;