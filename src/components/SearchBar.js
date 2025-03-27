import React, { useState } from "react";
import "../style/SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ keyword, price, capacity });
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="상품명 입력"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <input
        type="number"
        placeholder="가격 (선택)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="text"
        placeholder="용량 (선택)"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />
      <button type="submit"> 검색</button>
    </form>
  );
};

export default SearchBar;
