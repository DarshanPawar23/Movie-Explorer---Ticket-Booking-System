import { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!query.trim()) return;

    onSearch(query);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-3 mb-8"
    >
      <input
        type="text"
        placeholder="Search Movies..."
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
        className="flex-1 px-4 py-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-red-500"
      />

      <button
        type="submit"
        className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;