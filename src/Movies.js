import React, { useState, useEffect } from "react";
import CardLayout from "./CardLayout";
import Genre from "./Genre";
import Search from "./Search";
import "./globals.css";

const Movie = () => {
  const [movieList, setMovieList] = useState({ 2010: [], 2011: [], 2012: [] });

  const [releaseYear, setReleaseYear] = useState(2010);
  // const [tempYear, setTempYear] = useState();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const lastYear = Math.max(...Object.keys(movieList)); // Get the latest year in the movie list
  const firstYear = Math.min(...Object.keys(movieList)); // Get the earliest year in the movie list
  const [content, setContent] = useState([]);

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
    setReleaseYear(2012);
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
          // let updatedMovieList = [];
          // if (!selectedGenres) {
          //   // updatedMovieList = movieList.concat(result.results);
          // } else {
          //   if (rYear === releaseYear) {
          //     // Append the new movies to the bottom if it's the current year
          //     // updatedMovieList = { ...movieList, [rYear]: result.results };
          //   } else if (rYear < releaseYear) {
          //     // Add the new movies to the top if it's the previous year
          //     // updatedMovieList = { [rYear]: result.results, ...movieList };
          //     setReleaseYear(rYear);
          //   } else {
          //     // Add the new movies to the bottom if it's the next year
          //     // updatedMovieList = { ...movieList, [rYear]: result.results };
          //   }
          // }
          // setMovieList(updatedMovieList);
          setMovieList((prevMovieList) => ({
            ...prevMovieList,
            [rYear]: result.results,
          }));

          // setReleaseYear(rYear);
          // setTempYear(rYear);
          setReleaseYear(rYear + 1);

          return rYear; // Return the requested year
        });
    } catch (error) {
      setMovieList([]);
      alert("Something went wrong while fetching movies.");
    }
  };
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const scrollHeight = e.target.scrollHeight;
    const clientHeight = e.target.clientHeight;
    const scrollThreshold = 0.9;

    if (scrollTop < 1500) {
      // Scrolled to the top, load movies of the previous year
      fetchMovies(firstYear - 1);
      console.log("sc top");
    } else if (
      scrollTop + clientHeight >= scrollHeight * scrollThreshold &&
      releaseYear < new Date().getFullYear()
    ) {
      // Scrolled to the bottom, load movies of the next year
      fetchMovies(lastYear + 1);
      console.log("sc bottom");
    }
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
        <div className="search-container" style={{ overflowY: "scroll" }}>
          <div className="row pt-3 mb-5 pb-5">
            <CardLayout state={content} />
          </div>
        </div>
      ) : (
        <div
          className="container"
          style={{ overflowY: "scroll", height: "80vh" }}
          onScroll={handleScroll}
        >
          {isEmptyMovieList ? (
            <div className="text-center text-white fs-4">
              <h3>No movies available for selected genres</h3>
            </div>
          ) : (
            Object.entries(movieList).map(([year, movies]) =>
              movies.length === 0 ? (
                <div key={year} className={`movie-year year-${year}`}>
                  <div className="text-center text-white fs-4">
                    No movies available for {year}
                  </div>
                </div>
              ) : (
                <div key={year} className={`movie-year year-${year}`}>
                  <div className="col-12 text-center mt-2 mb-4 fs-1 fw-bold text-decoration-underline text-white">
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
