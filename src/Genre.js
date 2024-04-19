import React, { useEffect, useState } from "react";

const Genre = ({ updateSelectedGenres }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genre, setGenre] = useState([]);
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await fetch(
          `
          https://api.themoviedb.org/3/genre/movie/list?api_key=6b99f46cc249aa0e4664f52a5c266bb4&language=en-US`
        );
        const result = await data.json();
        setGenre(result.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreClick = (clickedGenre) => {
    setSelectedGenres((prevGenres) => {
      const isSelected = prevGenres.some((g) => g.id === clickedGenre.id);

      return isSelected
        ? prevGenres.filter((g) => g.id !== clickedGenre.id)
        : [...prevGenres, clickedGenre];
    });

    updateSelectedGenres((prevSelectedGenres) => {
      const isSelected = prevSelectedGenres.some(
        (g) => g.id === clickedGenre.id
      );

      return isSelected
        ? prevSelectedGenres.filter((g) => g.id !== clickedGenre.id)
        : [...prevSelectedGenres, clickedGenre];
    });
  };

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-12 d-flex flex-wrap">
          {genre.map((g) => (
            <div className="m-2" key={g.id}>
              <button
                className={`bg-dark text-white px-4 py-2 text-center button ${
                  selectedGenres && selectedGenres.some((g) => g.id === g.id)
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleGenreClick(g)}
              >
                {g.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Genre;
