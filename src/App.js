import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MyPage from "./pages/MyPage";
import Home from "./pages/Home";
import JoinForm from "./pages/JoinForm";
import LoginForm from "./pages/LoginForm";
import CameraPage from "./pages/CameraPage";
import PicturePage from "./pages/PicturePage";
import ComparePage from "./pages/ComparePage"; //kkm이 수정함
import CartList from "./pages/CartList"; //kkm이 수정함
import HistoryPage from "./pages/HistoryPage";
import CartDetailPage from "./pages/CartDetailPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<LoginForm />} />
        <Route path="/join" element={<JoinForm />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/mypage" element={<MyPage />} />

        <Route path="/camera" element={<CameraPage />} />
        <Route path="/picture" element={<PicturePage />} />
        <Route path="/compareitem" element={<ComparePage />} />
        {/*kkm이 바로 위에 수정함*/}
        <Route path="/cart" element={<CartList />} />
        {/*kkm이 바로 위에 수정함*/}

        <Route path="/history" element={<HistoryPage />} />
        <Route path="/history/:cartId" element={<CartDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;
