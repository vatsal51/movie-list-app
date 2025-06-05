import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import CardLayout from "./CardLayout";
import Genre from "./Genre";
import Search from "./Search";

const Movie = () => {
  const [movieList, setMovieList] = useState({});
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [content, setContent] = useState([]);
  const containerRef = useRef(null);
  const fetchedYears = useRef(new Set());

  const firstYear = useMemo(() => {
    const years = Object.keys(movieList).map(Number);
    return years.length ? Math.min(...years) : 2012;
  }, [movieList]);

  const lastYear = useMemo(() => {
    const years = Object.keys(movieList).map(Number);
    return years.length ? Math.max(...years) : 2012;
  }, [movieList]);

  const SetSearchContent = (content) => {
    setContent(content);
  }; 
  const year2012Ref = useRef(null);
  const scrollYear2012 = useCallback(() => {
    year2012Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const updateSelectedGenres = (newSelectedGenres) => {
    setSelectedGenres(newSelectedGenres);
    setMovieList({});
    fetchedYears.current.clear();
    fetchMovies(2012);
    setTimeout(scrollYear2012, 100);
  };

  const fetchMovies = useCallback(
    async (rYear) => {
      if (fetchedYears.current.has(rYear)) return;
      fetchedYears.current.add(rYear);

      try {
        const API_KEY = "2dca580c2a14b55200e784d157207b4d";
        const BASE_URL = "https://api.themoviedb.org/3/discover/movie";
        const genreIds = selectedGenres.map((g) => g.id).join(",");
        const url = `${BASE_URL}?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${rYear}&page=1&vote_count.gte=100&with_genres=${genreIds}`;

        const response = await fetch(url);
        const result = await response.json();

        setMovieList((prev) => ({
          ...prev,
          [rYear]: result.results,
        }));
      } catch (error) {
        console.error(`Error fetching movies for year ${rYear}:`, error);
      }
    },
    [selectedGenres]
  );

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedFetchMovies = useRef(
    debounce((year) => fetchMovies(year), 300)
  ).current;

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    if (scrollTop < 1500 && firstYear > 1900) {
      debouncedFetchMovies(firstYear - 1);
    } else if (
      scrollTop + clientHeight >= scrollHeight * 0.9 &&
      lastYear < new Date().getFullYear()
    ) {
      debouncedFetchMovies(lastYear + 1);
    }
  };

  // Initial fetch on mount (or genre change)
  useEffect(() => {
    const initialYears = [2010, 2011, 2012];
    initialYears.forEach((year) => {
      fetchMovies(year);
    });
  }, [fetchMovies]);

  useEffect(() => {
    setTimeout(scrollYear2012, 100);
    return () => clearTimeout(scrollYear2012);
  }, [content]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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
        <div className="searchresult-container container">
          <h3>Search results</h3>
          <CardLayout state={content} />
        </div>
      ) : (
        <div className="movie-wrapper">
          <div className="movie-container" ref={containerRef}>
            {isEmptyMovieList ? (
              <div>
                <h3>No movies available for selected genres</h3>
              </div>
            ) : (
              Object.entries(movieList).map(([year, movies]) => (
                <div
                  key={year}
                  className={`container movie-year year-${year}`}
                  ref={year == "2012" ? year2012Ref : null}
                >
                  <p className="year">{year}</p>
                  {movies.length > 0 ? (
                    <CardLayout state={movies} />
                  ) : (
                    <div style={{ color: "red" }}>
                      No movies available for {year}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Movie;
