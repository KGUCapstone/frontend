import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import titleImage from '../assets/title.svg';
import logoImage from '../assets/logo.svg';
import '../style/Home.css';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("Authorization");
        if (token) {
            navigate("/home");  // 토큰이 있으면 바로 홈으로 이동
        }
    }, [navigate]);

    const handleStartClick = () => {
        navigate('/login');
    };

    return (
        <div className="home-container">
            <div className="home-card">
                <header>
                    <div className="home-title">
                        <img src={titleImage} alt="title" className="title-image" />
                    </div>
                </header>

                <img src={logoImage} alt="logo" className="logo-image" />
                <p>
                  <span className="highlight-text">
                    가장 쉬운 <br />
                    비교 <br />
                    똑똑한 쇼핑 라이프
                  </span>
                </p>

                <button onClick={handleStartClick} className="start-button">START</button>
            </div>
        </div>
    );
};

export default Home;
