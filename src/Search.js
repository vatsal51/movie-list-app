"use client";
import React, { useState, useEffect } from "react";
const Search = ({ SetSearchContent }) => {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchText]);

  useEffect(() => {
    const fetchSearch = async () => {
      const data = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=6b99f46cc249aa0e4664f52a5c266bb4&language=en-US&query=${debouncedSearchText}&page=1&include_adult=false`
      );
      const { results } = await data.json();
      SetSearchContent(results);
    };

    if (debouncedSearchText) {
      fetchSearch();
    } else {
      SetSearchContent([]);
    }
  }, [debouncedSearchText]);

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <>
      <div className="container">
        <div className="row pt-3 mb-5 pb-5">
          <div className="col-12 pt-5 pb-3 mt-5 d-flex justify-content-center align-items-center">
            <input
              type="text"
              placeholder="search..."
              onChange={handleInputChange}
              className="search"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
