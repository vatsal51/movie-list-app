"use client";
import React, { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Genre from "./Genre";
import CardLayout from "./CardLayout";

const Movie = () => {
  const [movieList, setMovieList] = useState([]);

  const [releaseYear, setReleaseYear] = useState(2011);
  const [page, setPage] = useState(1);
 
  const [selectedGenres, setSelectedGenres] = useState([]);

  const updateSelectedGenres = (newSelectedGenres) => {
    setSelectedGenres(newSelectedGenres);
    setMovieList([]); 
    setReleaseYear(2010); 
    fetchMovies(2010); 
  };
  const genreIds = selectedGenres.map((g) => g.id).join(",");
  console.log("selectiong genre", selectedGenres);
  const fetchMovies = (rYear) => {
    try {
      rYear = rYear || releaseYear;
      console.log("first yr", rYear);
      const API_KEY = "2dca580c2a14b55200e784d157207b4d";
      const BASE_URL = "https://api.themoviedb.org/3/discover/movie";
      const url = `${BASE_URL}?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${rYear}&page=1&vote_count.gte=100&with_genres=${genreIds}`;

      fetch(url)
        .then((response) => response.json())
        .then((result) => {
          let updatedMessageList = [];
          if (!selectedGenres) {
            updatedMessageList = movieList.concat(result.results);
          } else {
            if (rYear === 2010) {
              updatedMessageList = result.results;
            } else {
              updatedMessageList = movieList.concat(result.results);
            }
          }
          console.log("update list", updatedMessageList);
          setMovieList(updatedMessageList);
          setReleaseYear(releaseYear + 1);
          console.log("release year", releaseYear);
          console.log("updated yr", rYear);
          console.log("len", movieList.length);
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
        <InfiniteScroll
          className="row"
          dataLength={movieList.length}
          next={() => fetchMovies()}
          hasMore={true}
          
          scrollThreshold={0.8}
          onScroll={(e)=>console.log(e)}
        >
          <div className="col-12 text-center mt-2 mb-4 fs-1 fw-bold text-decoration-underline text-white">
            Movies of {releaseYear}
          </div>
          <CardLayout state={movieList} />
        </InfiniteScroll>
      </div>
    </>
  );
};

export default Movie;
