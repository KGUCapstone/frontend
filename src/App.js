import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Mainpage from "./pages/Mainpage";
import Mypage from "./pages/Mypage"
import Home from "./pages/Home";
import Join from "./pages/Join";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/mainpage" element={<Mainpage />} />
        <Route path="/mypage" element = {<Mypage />} />
        
        
      </Routes>
    </Router>

  );
};

export default App;
