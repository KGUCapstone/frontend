import React, { useState } from "react";
import api from "../api";

const SearchPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    brand: "",
    volume: "",
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const postData = {
        ...formData,
        price: formData.price ? Number(formData.price) : "",
      };

      const res = await api.post("/shopping/search", postData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setResponse(res.data);
    } catch (err) {
      const msg = err.response?.data?.error || "검색 중 오류가 발생했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Shopping Search</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            상품명 (Title)
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">가격 (Price)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            브랜드 (Brand)
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            용량 (Volume)
          </label>
          <input
            type="text"
            name="volume"
            value={formData.volume}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          disabled={loading}
        >
          {loading ? "검색 중..." : "검색하기"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {response && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">검색 결과:</h3>
          <pre className="bg-gray-100 p-3 rounded-md overflow-auto max-h-60">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
