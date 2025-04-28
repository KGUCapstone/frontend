import React, { useState } from "react";
import "../style/SearchBar.css";
import ModalSearch from "../pages/ModalSearch";

const SearchBar = () => {
  const [open, setOpen] = useState(false);

  return (
      <>
        <div className="mini-search-bar" onClick={() => setOpen(true)}>
          <span className="placeholder">검색어를 입력하세요.</span>
        </div>
        {open && <ModalSearch onClose={() => setOpen(false)} />}
      </>

  );
};

export default SearchBar;
