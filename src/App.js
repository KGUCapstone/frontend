import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MyPage from "./pages/MyPage";
import Home from "./pages/Home";
import JoinForm from "./pages/JoinForm";
import LoginForm from "./pages/LoginForm";
import CameraPage from "./pages/CameraPage";
import PicturePage from "./pages/PicturePage";

import ComparePage from "./pages/ComparePage";
import CartList from "./pages/CartList";
import CartDetailList from "./pages/cartDetailList";
import CheckListPage from "./pages/CheckListPage";


import CartDetailPage from "./pages/CartDetailPage";
import ComparisonResultsPage from "./pages/ComparisonResultsPage";
import MonthHistoryPage from "./pages/MonthHistoryPage";

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
        <Route path="/compareItem" element={<ComparePage />} />
        <Route path="/cart" element={<CartList />} />

        <Route path="/cartDetailList" element={<CartDetailList />} />

        {/*kkm이 바로 위에 수정함*/}

        <Route path="/history" element={<MonthHistoryPage />} />
        <Route path="/history/:cartId" element={<CartDetailPage />} />
        <Route path="/checkListPage" element={<CheckListPage />} />
        <Route path="/comparison-results" element={<ComparisonResultsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
