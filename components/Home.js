import { useState, useEffect } from "react";
import { Popover, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Movie from "./Movie";
import "antd/dist/antd.css";
import styles from "../styles/Home.module.css";

function Home() {
  const [likedMovies, setLikedMovies] = useState([]);
  const [moviesData, setMoviesData] = useState([]);

  useEffect(() => {
    fetch("http://my-moviz-backend-rosy-omega.vercel.app")
      .then((response) => response.json())
      .then((data) => {
        setMoviesData(data.movies);
      });
  }, []);

  // Liked movies (inverse data flow)
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find((movie) => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter((movie) => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  const likedMoviesPopover = likedMovies.map((data, i) => {
    return (
      <div key={i} className={styles.likedMoviesContainer}>
        <span className="likedMovie">{data}</span>
        <FontAwesomeIcon
          icon={faCircleXmark}
          onClick={() => updateLikedMovies(data)}
          className={styles.crossIcon}
        />
      </div>
    );
  });

  const popoverContent = (
    <div className={styles.popoverContent}>{likedMoviesPopover}</div>
  );

  // Movies list

  const movies = moviesData.map((data, i) => {
    const isLiked = likedMovies.some((movie) => movie === data.title);
    let title = data.title;
    let poster = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
    let voteAverage = data.vote_average;
    let voteCount = data.vote_count;
    let overview = data.overview;
    if (overview.length > 250) {
      overview = overview.substring(0, 250) + "...";
    }
    return (
      <Movie
        key={i}
        updateLikedMovies={updateLikedMovies}
        isLiked={isLiked}
        title={title}
        overview={overview}
        poster={poster}
        voteAverage={voteAverage}
        voteCount={voteCount}
      />
    );
  });

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logocontainer}>
          <img src="logo.png" alt="Logo" />
          <img className={styles.logo} src="logoletter.png" alt="Letter logo" />
        </div>
        <Popover
          title="Liked movies"
          content={popoverContent}
          className={styles.popover}
          trigger="click"
        >
          <Button>♥ {likedMovies.length} movie(s)</Button>
        </Popover>
      </div>
      <div className={styles.title}>LAST RELEASES</div>
      <div className={styles.moviesContainer}>{movies}</div>
    </div>
  );
}

export default Home;
