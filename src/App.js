import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mainpage from "./pages/Mainpage";
import Mypage from "./pages/Mypage"
import Home from "./pages/Home";
import JoinForm from "./pages/JoinForm";
import LoginForm from "./pages/LoginForm";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<LoginForm />} />
        <Route path="/join" element={<JoinForm />} />
        <Route path="/mainpage" element={<Mainpage />} />
        <Route path="/mypage" element = {<Mypage />} />
        
        
      </Routes>
    </Router>

  );
};

export default App;
