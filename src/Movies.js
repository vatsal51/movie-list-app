"use client";
import React, { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Genre from "./Genre";
import CardLayout from "./CardLayout";

const Movie = () => {
  const [movieList, setMovieList] = useState([]);

  const [releaseYear, setReleaseYear] = useState(2012);
  const [page, setPage] = useState(1);
  // const [genre, setGenre] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const genreIds = selectedGenres.map((g) => g.id).join(",");
  var updatedMessageList;
  const updateSelectedGenres = (newSelectedGenres) => {
    setSelectedGenres(newSelectedGenres);
  };
  const fetchMovies = (rYear) => {
    try {
      rYear = rYear || releaseYear;
      const API_KEY = "2dca580c2a14b55200e784d157207b4d";
      const BASE_URL = "https://api.themoviedb.org/3/discover/movie";
      const url = `${BASE_URL}?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${rYear}&page=1&vote_count.gte=100&with_genres=${genreIds}`;

      fetch(url)
        .then((response) => response.json())
        .then((result) => {
          console.log(rYear);
          setReleaseYear(rYear + 1);
          if (!genreIds) {
            updatedMessageList = movieList.concat(result.results);
          } else {
            updatedMessageList = result.results;
          }
          
          setMovieList(updatedMessageList);
          console.log("len",movieList.length)
        });
    } catch (error) {
           setMovieList([]);
      alert("Something has went wrong");
    }
  };

  useEffect(() => {
    fetchMovies(2010);
  }, [selectedGenres]);

  return (
    <>
      <div className="container">
        <Genre
          selectedGenres={selectedGenres}
          updateSelectedGenres={updateSelectedGenres}
        />
        {releaseYear}
        {genreIds ? (
          <InfiniteScroll
            className="row"
            dataLength={movieList.length}
            next={fetchMovies}
            hasMore={true}
            scrollThreshold={0.5}
          >
            <div className="col-12 text-center mt-2 mb-4 fs-1 fw-bold text-decoration-underline text-white">
              Movies of {releaseYear}
            </div>
            <CardLayout state={movieList} />
          </InfiniteScroll>
        ) : (
          <InfiniteScroll
            className="row"
            dataLength={movieList.length}
            next={fetchMovies}
            hasMore={true}
            scrollThreshold='500px'
          >
            <div className="col-12 text-center mt-2 mb-4 fs-1 fw-bold text-decoration-underline text-white">
              Movies of {releaseYear}
            </div>
            <CardLayout state={movieList} />
          </InfiniteScroll>
        )}
      </div>
    </>
  );
};

export default Movie;
