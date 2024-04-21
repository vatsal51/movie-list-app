import React, { memo } from "react";
const img_300 = "https://image.tmdb.org/t/p/w300";
const CardLayout = ({ state }) => {
  return (
    <div className="cards">
      {state.map((Val) => {
        const {
          name,
          title,
          poster_path,
          first_air_date,
          release_date,
          media_type,
          vote_average,
          id,
        } = Val;
        return (
          <div className="card " key={id}>
            <img
              src={
                poster_path
                  ? `${img_300}/${poster_path}`
                  : `https://placehold.co/300x450?text=No \nImage`
              }
              placeholder="blur"
              width={500}
              height={500}
              className="card-img-top pt-3 pb-0 px-3"
              alt={`Poster for ${title || name}`}
            />
            <div className="card-body">
              <h5 className="card-title text-center fs-5">
                {title || name} / {parseFloat(vote_average).toFixed(1)}{" "}
                <i className="bi bi-star-fill"></i>
              </h5>
              <div className="d-flex fs-6 align-items-center justify-content-evenly movie">
                <div>{media_type}</div>
                <div>{first_air_date || release_date}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardLayout;
