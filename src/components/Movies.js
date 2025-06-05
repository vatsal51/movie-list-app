import { useState, useEffect, useRef, useCallback } from "react";
import CardLayout from "./CardLayout";
import Genre from "./Genre";
import Search from "./Search";

const Movie = () => {
  const [movieList, setMovieList] = useState({ 2010: [], 2011: [], 2012: [] });
  const [selectedGenres, setSelectedGenres] = useState([]);
  const lastYear = Math.max(...Object.keys(movieList));
  const firstYear = Math.min(...Object.keys(movieList));
  const [content, setContent] = useState([]);
  const containerRef = useRef(null);
  const SetSearchContent = (content) => {
    setContent(content);
  };
  const year2012Ref = useRef(null);
  const scrollYear2012 = useCallback(() => {
    if (year2012Ref.current) {
      year2012Ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const updateSelectedGenres = (newSelectedGenres) => {
    setSelectedGenres(newSelectedGenres);
    setMovieList({ 2012: [] });
    // setReleaseYear(2012);
    fetchMovies(2012);
    setTimeout(scrollYear2012, 100);
  };

  const fetchMovies = useCallback(
    async (rYear) => {
      try {
        const API_KEY = "2dca580c2a14b55200e784d157207b4d";
        const BASE_URL = "https://api.themoviedb.org/3/discover/movie";
        const genreIds = selectedGenres.map((g) => g.id).join(",");
        const url = `${BASE_URL}?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${rYear}&page=1&vote_count.gte=100&with_genres=${genreIds}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        setMovieList((prevMovieList) => ({
          ...prevMovieList,
          [rYear]: result.results,
        }));
        return { rYear, success: true, count: result.results.length }; // Return success status and count
      } catch (error) {
        console.error(`Error fetching movies for year ${rYear}:`, error);

        return { rYear, success: false, error: error.message }; // Return error status
      }
    },
    [selectedGenres]
  );
  const handleScroll = () => {
    const scrollTop = containerRef.current.scrollTop;
    const scrollHeight = containerRef.current.scrollHeight;
    const clientHeight = containerRef.current.clientHeight;
    const scrollThreshold = 0.9;

    if (scrollTop < 1500) {
      debouncedFetchMovies(firstYear - 1);
    } else if (
      scrollTop + clientHeight >= scrollHeight * scrollThreshold &&
      lastYear < new Date().getFullYear()
    ) {
      debouncedFetchMovies(lastYear + 1);
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedFetchMovies = useRef(debounce(fetchMovies, 200)).current;

  useEffect(() => {
    const initialYears = [2010, 2011, 2012];
    const fetchPromises = initialYears.map((year) => fetchMovies(year));
    Promise.all(fetchPromises)
      .then((results) => {
        console.log("Initial movie fetches completed:", results);
      })
      .catch((error) => {
        console.error("Error during initial Promise.all fetch:", error);
        // Fallback for full failure of initial fetches
        setMovieList({});
      });
    // initialYears.forEach((year) => fetchMovies(year));
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [selectedGenres]);

  useEffect(() => {
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
      {content.length > 0 ? (
        <div>
          <div className="searchresult-container container">
            <h3>Search results</h3>
            <CardLayout state={content} />
          </div>
        </div>
      ) : (
        <div className="movie-wrapper">
          <div
            className="movie-container "
            ref={containerRef}
            // onScroll={handleScroll}
          >
            {isEmptyMovieList ? (
              <div>
                <h3>No movies available for selected genres</h3>
              </div>
            ) : (
              Object.entries(movieList).map(([year, movies]) =>
                movies.length === 0 ? (
                  <div
                    key={year}
                    className={`container movie-year year-${year}`}
                    ref={Number(year) === 2012 ? year2012Ref : null}
                  >
                    <h1>{year}</h1>
                    <div style={{ color: "red" }}>
                      No movies available for {year}
                    </div>
                  </div>
                ) : (
                  <div
                    key={year}
                    className={`container movie-year year-${year}`}
                    ref={Number(year) === 2012 ? year2012Ref : null}
                  >
                    <p className="year">{year}</p>

                    <CardLayout state={movies} />
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Movie;
