const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the Home page!</p>
      <a href="/login">로그인</a> <br></br>
      <a href="/home">홈페이지</a> <br></br>
      <a href="/compareitem">아이템 비교하기</a>
             {/*kkm이 바로 위에 수정함*/}
      <br></br>
      <a href="/search">상품 검색
      </a>
    </div>
  );
};

export default Home;
