import React, { useEffect, useState } from "react";

const Genre = ({ updateSelectedGenres }) => {
  const [select, setSelect] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=6b99f46cc249aa0e4664f52a5c266bb4&language=en-US`
        );
        const result = await data.json();
        const allGenre = { id: "all", name: "All" };
        setSelect([allGenre]);
        setGenres([allGenre, ...result.genres]);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);
  const handleGenreClick = (clickedGenre) => {
    if (clickedGenre.id === "all") {
      setSelect([clickedGenre]);
      updateSelectedGenres([]);
    } else {
      const isSelected = select.some((genre) => genre.id === clickedGenre.id);

      setSelect((prevGenres) => {
        if (isSelected) {
          return prevGenres.filter((genre) => genre.id !== clickedGenre.id);
        } else {
          const updatedGenres = prevGenres.filter(
            (genre) => genre.id !== "all"
          );
          return [...updatedGenres, clickedGenre];
        }
      });

      updateSelectedGenres((prevSelectedGenres) => {
        if (isSelected) {
          return prevSelectedGenres.filter(
            (genre) => genre.id !== clickedGenre.id
          );
        } else {
          const updatedSelectedGenres = prevSelectedGenres.filter(
            (genre) => genre.id !== "all"
          );
          return [...updatedSelectedGenres, clickedGenre];
        }
      });
    }
  };

  return (
    <div className="genre-container">
      <div className="genre">
        {genres.map((genre) => (
          <div key={genre.id}>
            <button
              className={`button ${
                select.some((selectedGenre) => selectedGenre.id === genre.id)
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleGenreClick(genre)}
            >
              {genre.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Genre;
