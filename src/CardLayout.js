import genresData from "./genresData";
const img_300 = "https://image.tmdb.org/t/p/w300";
const CardLayout = ({ state }) => {
  return (
    <div className="cards">
      {state.map((movie) => {
        const genreNames = movie.genre_ids
          .map((genreId) => {
            const genre = genresData.find((genre) => genre.id === genreId);
            return genre ? genre.name : "";
          })
          .join(", ");
        return (
          <div className="card" key={movie.id}>
            <img
              src={
                movie.poster_path
                  ? `${img_300}/${movie.poster_path}`
                  : `https://placehold.co/300x450?text=No \nImage`
              }
              alt={`Poster for ${movie.title || movie.name}`}
            />
            <div className="card-body">
              <h4 className="card-title">
                {movie.title || movie.name} /
                {parseFloat(movie.vote_average).toFixed(1)}{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 rating"
                  width="12px"
                  height="12px"
                >
                  <path
                    fill="#ffc107"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
              </h4>
              <div className="card-details">
                <p className="card-genre">Genres: {genreNames}</p>
                <p>Release date:{movie.first_air_date || movie.release_date}</p>
                <p className="card-description">
                  Description: {movie.overview}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardLayout;
