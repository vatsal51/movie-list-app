import React, { useState, useEffect } from "react";
import CardLayout from "./CardLayout";
import Genre from "./Genre";
import "./globals.css";

const Movie = () => {
  const [movieList, setMovieList] = useState([]);
  const [releaseYear, setReleaseYear] = useState(2012);
  const [tempYear, setTempYear] = useState();
  const [selectedGenres, setSelectedGenres] = useState([]);

  const updateSelectedGenres = (newSelectedGenres) => {
    setSelectedGenres(newSelectedGenres);
    setMovieList([]);
    setReleaseYear(2012);
    fetchMovies(2012);
  };

  const fetchMovies = (rYear) => {
    try {
      // rYear = rYear || releaseYear;
      const API_KEY = "2dca580c2a14b55200e784d157207b4d";
      const BASE_URL = "https://api.themoviedb.org/3/discover/movie";
      const genreIds = selectedGenres.map((g) => g.id).join(",");
      const url = `${BASE_URL}?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${rYear}&page=1&vote_count.gte=100&with_genres=${genreIds}`;

      return fetch(url)
        .then((response) => response.json())
        .then((result) => {
          let updatedMovieList = [];
          if (!selectedGenres) {
            updatedMovieList = movieList.concat(result.results);
          } else {
            if (rYear === releaseYear) {
              // Append the new movies to the bottom if it's the current year
              updatedMovieList = result.results;
            } else if (rYear < releaseYear) {
              // Add the new movies to the top if it's the previous year
              updatedMovieList = [...result.results, ...movieList];
              setReleaseYear(rYear);
            } else {
              // Add the new movies to the bottom if it's the next year
              updatedMovieList = [...movieList, ...result.results];
            }
          }

          setMovieList(updatedMovieList);
          // setReleaseYear(rYear);
          setTempYear(rYear);
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

    if (scrollTop === 0) {
      // Scrolled to the top, load movies of the previous year
      console.log("sc top");
      fetchMovies(releaseYear - 1);
    } else if (
      scrollTop + clientHeight >= scrollHeight &&
      releaseYear < new Date().getFullYear()
    ) {
      // Scrolled to the bottom, load movies of the next year
      console.log("sc bottom");
      fetchMovies(tempYear + 1);
    }
  };

  useEffect(() => {
    fetchMovies(2012);
  }, [selectedGenres]);

  return (
    <>
      <Genre
        selectedGenres={selectedGenres}
        updateSelectedGenres={updateSelectedGenres}
      />
      <div
        className="container"
        style={{ overflowY: "scroll", height: "80vh" }}
        onScroll={handleScroll}
      >
        <div key={releaseYear} className="movie-year">
          <div className="col-12 text-center mt-2 mb-4 fs-1 fw-bold text-decoration-underline text-white">
            Movies of {releaseYear}
          </div>
          <div className="cards">
            <CardLayout state={movieList} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Movie;
