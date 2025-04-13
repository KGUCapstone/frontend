import React from 'react';
import { useNavigate } from 'react-router-dom';
import titleImage from '../assets/title.svg';
import logoImage from '../assets/logo.svg';
import '../style/Home.css';

const Home = () => {
  const navigate = useNavigate(); 

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
          가장 쉬운 <br />
          비교 <br />
          똑똑한 쇼핑 <br />
          라이프
        </p>



        <button onClick={handleStartClick} className="start-button">START</button>

      </div>
    </div>
  );
};

export default Home;
