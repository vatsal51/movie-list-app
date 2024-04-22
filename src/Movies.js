import React, { useState, useEffect, useRef } from "react";
import CardLayout from "./CardLayout";
import Genre from "./Genre";
import Search from "./Search";
import "./globals.css";

const Movie = () => {
  const [movieList, setMovieList] = useState({ 2010: [], 2011: [], 2012: [] });

  // const [releaseYear, setReleaseYear] = useState(2010);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const lastYear = Math.max(...Object.keys(movieList)); // Get the latest year in the movie list
  const firstYear = Math.min(...Object.keys(movieList)); // Get the earliest year in the movie list
  const [content, setContent] = useState([]);
  const containerRef = useRef(null);
  const SetSearchContent = (content) => {
    setContent(content);
  };
  const scrollYear2012 = () => {
    const element = document.querySelector(".year-2012");
    if (element) {
      console.log("2012");
      element.scrollIntoView();
    }
  };

  const updateSelectedGenres = (newSelectedGenres) => {
    setSelectedGenres(newSelectedGenres);
    setMovieList({ 2012: [] });
    // setReleaseYear(2012);
    fetchMovies(2012);
    setTimeout(scrollYear2012, 100);
  };

  const fetchMovies = (rYear) => {
    try {
      const API_KEY = "2dca580c2a14b55200e784d157207b4d";
      const BASE_URL = "https://api.themoviedb.org/3/discover/movie";
      const genreIds = selectedGenres.map((g) => g.id).join(",");
      const url = `${BASE_URL}?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${rYear}&page=1&vote_count.gte=100&with_genres=${genreIds}`;

      return fetch(url)
        .then((response) => response.json())
        .then((result) => {
          setMovieList((prevMovieList) => ({
            ...prevMovieList,
            [rYear]: result.results,
          }));
          // setReleaseYear(rYear + 1);
          return rYear;
        });
    } catch (error) {
      setMovieList([]);
      alert("Something went wrong while fetching movies.");
    }
  };
  const handleScroll = () => {
    const scrollTop = containerRef.current.scrollTop;
    const scrollHeight = containerRef.current.scrollHeight;
    const clientHeight = containerRef.current.clientHeight;
    const scrollThreshold = 0.9;
    if (scrollTop < 2000) {
      // Scrolled to the top, load movies of the previous year
      console.log("sc top");
      fetchMovies(firstYear - 1);
    } else if (
      scrollTop + clientHeight >= scrollHeight * scrollThreshold &&
      lastYear < new Date().getFullYear()
    ) {
      // Scrolled to the bottom, load movies of the next year
      console.log("sc bot");
      fetchMovies(lastYear + 1);
    }
    console.log("scrolltop", scrollTop, "year");
  };

  useEffect(() => {
    const initialYears = [2010, 2011, 2012];
    initialYears.forEach((year) => fetchMovies(year));
  }, [selectedGenres]);

  useEffect(() => {
    // Scroll to the year 2012 after the movies are loaded
    setTimeout(scrollYear2012, 100);
    return () => {
      clearTimeout(scrollYear2012);
    };
  }, [content]);
  const isEmptyMovieList = Object.values(movieList).every(
    (movies) => movies.length === 0
  );
  return (
    <>
      <Genre
        selectedGenres={selectedGenres}
        updateSelectedGenres={updateSelectedGenres}
      />
      <Search SetSearchContent={SetSearchContent} />
      {content.length > 0 ? ( // Check if search content is present
        <div>
          <div className="search-container">
            <h3>Search results</h3>
            <CardLayout state={content} />
          </div>
        </div>
      ) : (
        <div
          className="container"
          style={{ overflowY: "scroll", height: "80vh" }}
          ref={containerRef}
          onScroll={handleScroll}
        >
          {isEmptyMovieList ? (
            <div>
              <h3>No movies available for selected genres</h3>
            </div>
          ) : (
            Object.entries(movieList).map(([year, movies]) =>
              movies.length === 0 ? (
                <div key={year} className={`movie-year year-${year}`}>
                  <h1>Movies of {year}</h1>
                  <div style={{ color: "red" }}>
                    No movies available for {year}
                  </div>
                </div>
              ) : (
                <div key={year} className={`movie-year year-${year}`}>
                  <div>
                    <h1>Movies of {year}</h1>
                  </div>
                  <CardLayout state={movies} />
                </div>
              )
            )
          )}
        </div>
      )}
    </>
  );
};

export default Movie;
