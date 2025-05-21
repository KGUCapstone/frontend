import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true // 쿠키를 항상 전송
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
        // localStorage에 "Bearer " 접두사가 이미 붙어있을 것이므로, 다시 붙이지 않도록 수정
        // 만약 과거에 "Bearer " 없이 저장했다면 이 부분을 `token.startsWith("Bearer ") ? token : `Bearer ${token}`` 로 유지할 수 있습니다.
        // 현재는 로그인 응답에서 "Bearer "를 붙여서 저장하도록 수정했으므로, 이렇게 단순화합니다.
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
    (response) => {
      // 로그인 또는 토큰 발급 응답에서 토큰 저장
      // /auth/token 엔드포인트는 OAuth2 로그인 후 access_token 쿠키를 읽어오는 용도로 보이므로,
      // 해당 응답에서 access_token을 가져와 저장합니다.
      if (response.config.url === "/api/login" && response.headers["authorization"]) {
        const token = response.headers["authorization"];
        localStorage.setItem("Authorization", token);
        console.log("일반 로그인 토큰 저장됨:", token);
      } else if (response.config.url === "/api/auth/token" && response.data.accessToken) {
        // OAuth2 로그인 후 /api/auth/token 호출 시
        const token = `Bearer ${response.data.accessToken}`; // "Bearer " 접두사를 붙여 저장
        localStorage.setItem("Authorization", token);
        console.log("OAuth2 로그인 토큰 저장됨:", token);
      }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // 401 에러 감지 및 재시도 방지 (originalRequest._retry 플래그 사용)
      if (error.response?.status === 401 && !originalRequest._retry) {
        // 재발급 중인 경우 큐에 추가
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

        originalRequest._retry = true; // 재시도 플래그 설정
        isRefreshing = true; // 토큰 재발급 시작 플래그

        try {
          console.log("액세스 토큰 만료됨. 토큰 재발급 시도...");
          // /reissue 엔드포인트는 쿠키에 있는 refresh 토큰을 사용하므로, 별도로 Authorization 헤더를 보내지 않습니다.
          // `api` 인스턴스에 `withCredentials: true`가 설정되어 있어 쿠키는 자동으로 전송됩니다.
          const response = await api.post("/reissue");
          const newToken = response.headers["authorization"]; // 백엔드에서 'Authorization' 헤더로 새 access 토큰 반환

          if (newToken) {
            console.log("토큰 재발급 성공:", newToken);
            localStorage.setItem("Authorization", newToken); // 새 access token 저장

            // 원본 요청 헤더 업데이트
            originalRequest.headers.Authorization = newToken;

            // 대기 중인 요청들 처리
            processQueue(null, newToken);

            // 새 토큰으로 원본 요청 재시도
            return axios(originalRequest);
          } else {
            console.error("토큰 재발급 응답에 새 access 토큰이 없음");
            processQueue(new Error("토큰 재발급 실패: 새 토큰 없음"));
            // 토큰이 없으면 로그인 페이지로 강제 이동
            localStorage.removeItem("Authorization");
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            window.location.href = "/";
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.error("토큰 재발급 실패:", refreshError.response?.data || refreshError.message);
          localStorage.removeItem("Authorization"); // 로컬 스토리지에서 토큰 삭제
          processQueue(refreshError); // 대기 중인 요청들에게 실패 전파

          // 리프레시 토큰이 만료되었거나 (403) 다른 인증 문제 (401) 발생 시 로그인 페이지로 이동
          if (refreshError.response?.status === 403 || refreshError.response?.status === 401) {
            console.log("리프레시 토큰도 만료되었거나 유효하지 않음. 로그인 필요.");
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            window.location.href = "/"; // 로그인 페이지로 리다이렉트
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false; // 토큰 재발급 완료 (성공/실패 무관)
        }
      }

      // 다른 종류의 에러는 그대로 반환
      return Promise.reject(error);
    }
);

export default api;