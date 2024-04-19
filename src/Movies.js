"use client";
import React, { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "bootstrap/dist/css/bootstrap.css";
import Genre from "./Genre";
import CardLayout from "./CardLayout";

const Movie = () => {
  const [movieList, setMovieList] = useState([]);

  // Storing the updated page token everytime i receive a new
  const [releaseYear, setReleaseYear] = useState(2012);
  const [page, setPage] = useState(1);
  // const [genre, setGenre] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const genreIds = selectedGenres.map((g) => g.id).join(",");
  var updatedMessageList;
  const updateSelectedGenres = (newSelectedGenres) => {
    setSelectedGenres(newSelectedGenres);
  };
  // this will fetch message and store them in the above state
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
          // Concating the newly received messages in the exisiting list
          if (!genreIds) {
            updatedMessageList = movieList.concat(result.results);
          } else {
            updatedMessageList = result.results;
          }
          // updating the messagesList to te updatedMessageList from above
          setMovieList(updatedMessageList);
          console.log("len",movieList.length)
        });
    } catch (error) {
      // in any case of error i am emptying the list
      // this should be avoided and instead a notification should be trigger that something has went wrong
      setMovieList([]);
      alert("Something has went wrong");
    }
  };

  useEffect(() => {
    // Calling the fetchMessages on page load
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
