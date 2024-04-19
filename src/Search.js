"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.css";
import Pagination from "../pagination";
import { img_300, unavailable, loading } from "../config";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);

  const fetchSearch = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=6b99f46cc249aa0e4664f52a5c266bb4&language=en-US&query=${searchText}&page=${page}&include_adult=false`
    );
    const { results } = await data.json();
    setContent(results);
  };

  useEffect(() => {
    fetchSearch();
  }, [searchText]);

  const Search = () => {
    fetchSearch();
  };

  const Trigger = (e) => {
    setSearchText(e.target.value);
  };
  return (
    <>
      <div className="container">
        <div className="row pt-3 mb-5 pb-5">
          <div className="col-12 pt-5 pb-3 mt-5 d-flex justify-content-center align-items-center">
            <input
              type="text"
              placeholder="search..."
              onChange={Trigger}
              className="form-control-lg col-6 search bg-dark text-white border border-0"
            />
            <button
              className="btn btn-primary text-white mx-2 col-md-1 col-sm-2 py-2"
              onClick={Search}
            >
              <i className="bi bi-search"></i>
            </button>
          </div>
          {content &&
            content.map((Val) => {
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
                <>
                  <div className="col-md-3 col-sm-4 py-3" id="card" key={id}>
                    <div className="card bg-dark" key={id}>
                      <Image
                        width={500}
                        height={500}
                        src={
                          poster_path
                            ? `${img_300}/${poster_path}`
                            : unavailable
                        }
                        placeholder="blur"
                        blurDataURL={loading}
                        alt={title}
                        className="card-img-top pt-3 pb-0 px-3"
                      />
                      <div className="card-body">
                        <h5 className="card-title text-center fs-5">
                          {title || name} /{" "}
                          {vote_average
                            ? parseFloat(vote_average).toFixed(1)
                            : "No Rating"}{" "}
                          <i className="bi bi-star-fill"></i>
                        </h5>
                        <div className="d-flex fs-6 align-items-center justify-content-evenly movie">
                          <div>{media_type === "tv" ? "TV" : "Movie"}</div>
                          <div>{first_air_date || release_date}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          {page > 1 && <Pagination page={page} setPage={setPage} />}
        </div>
      </div>
    </>
  );
};

export default Search;
