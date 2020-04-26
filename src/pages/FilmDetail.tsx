import React, { useState, useEffect } from "react";
import PageContainer from "../core/PageContainer";
import { PageType } from "../App";
import styles from "./FilmDetail.module.scss";
import Button from "../core/Button";
import { Crew, Film, CastAndCrew, testData } from "../types/film";
import moment from "moment";
import Header from "../core/Header";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Icon from "../common/Icon";
import ReviewModal from "../components/ReviewModal";
import { CSSTransition } from "react-transition-group";
import "./FilmDetailAnimations.css";
import { functions } from "../config/firebase";
import { auth } from "../config/firebase";

function getDirectorAndScreenwriter(crew: Crew[]): Crew[] {
  const filteredCrew = crew.filter(
    (x) => x.job === "Director" || x.job === "Screenplay"
  );
  if (filteredCrew[0].id === filteredCrew[1].id) {
    return [
      {
        ...filteredCrew[0],
        job: `${filteredCrew[0].job} ${filteredCrew[1].job}`,
      },
    ];
  }
  return filteredCrew;
}

async function saveRatingAndReview(film: Film, rating: number, review: string) {
  try {
    const postReviewRating = functions.httpsCallable("postReviewRating");
    const userUID = localStorage.getItem("userUID");
    const username = localStorage.getItem("username");

    const ratingObj = {
      filmID: film.id,
      filmPosterPath: film.poster_path,
      filmTitle: film.title,
      rating,
      userUID,
      username,
    };

    if (review) {
      const reviewObj = {
        filmID: film.id,
        filmPosterPath: film.poster_path,
        filmTitle: film.title,
        review,
        userUID,
        username,
      };
      await postReviewRating({
        rating: ratingObj,
        review: reviewObj,
        userUID,
        filmID: film.id,
      });
      return;
    }

    await postReviewRating({ rating: ratingObj, userUID, filmID: film.id });
  } catch (err) {
    console.error(err);
  }
}

const CastAndCrewItem: React.FunctionComponent<{
  name: string;
  role: string;
  profile_path: string | null;
}> = (props) => {
  const cleanStr = (str: string) => {
    if (str.includes("/")) return str.substring(0, str.indexOf("/"));
    return str;
  };

  return (
    <div className={styles.CastCrewItemContainer}>
      <img src={`https://image.tmdb.org/t/p/w500${props.profile_path}`}></img>
      <div className={styles.CastCrewName}>{props.name}</div>
      <div className={styles.CastCrewRole}> {cleanStr(props.role)}</div>
    </div>
  );
};

const FilmDetail: React.FunctionComponent<PageType> = (props) => {
  const [showModal, showModalUpdate] = useState(false);
  const [blurStyle, blurStyleUpdate] = useState({});
  const [filmData, filmDataUpdate] = useState<{
    film: Film;
    castAndCrew: CastAndCrew;
  }>();
  const [review, reviewUpdate] = useState<string | undefined>(undefined);
  const [rating, ratingUpdate] = useState<number | undefined>(undefined);

  const fetchMovie = async () => {
    const fetchMovieFunc = functions.httpsCallable("fetchMovie");
    const response = await fetchMovieFunc({
      userUID: localStorage.getItem("userUID"),
      filmID: 181808,
    });
    const film = response.data.film as Film;
    const castAndCrew = response.data.castAndCrew as CastAndCrew;
    const review = response.data.review;
    const rating = response.data.rating;
    filmDataUpdate({ film, castAndCrew });
    reviewUpdate(review ? review.review : undefined);
    ratingUpdate(rating ? rating.rating : undefined);
  };

  const saveRatingReview = async (rating: number, review: string) => {
    try {
      const data = filmData as { film: Film; castAndCrew: CastAndCrew };
      await saveRatingAndReview(data.film, rating, review);
      showModalUpdate(false);
      reviewUpdate(review);
      ratingUpdate(rating);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    try {
      fetchMovie();
      // Use this when you want dummy data
      // filmDataUpdate(testData);
      // reviewUpdate("Test Review");
      // ratingUpdate(10);
    } catch (err) {
      console.error(err);
    }
  }, []);

  if (filmData === undefined) return null;
  return (
    <PageContainer className={`${styles.Container}`}>
      <Header
        title={filmData.film.title}
        iconLeft={<Icon>{faChevronLeft}</Icon>}
      ></Header>
      <div className={styles.PosterSection}>
        <img
          src={`https://image.tmdb.org/t/p/w1280${filmData.film.poster_path}`}
        ></img>
      </div>
      <div className={styles.MainInfoSection}>
        <h1>{filmData.film.title}</h1>
        <h2>{moment(filmData.film.release_date).format("DD MMM YYYY")}</h2>
      </div>
      <div className={styles.ButtonsContainer}>
        <Button onClick={() => ""}>Wanted</Button>
        <Button onClick={() => showModalUpdate(true)}>Watched</Button>
      </div>
      <div className={styles.SynopsisSection}>
        <h3>Synopsis</h3>
        <p>{filmData.film.overview}</p>
      </div>
      <div className={styles.GenresSection}>
        <h3>Genres</h3>
        <div className={styles.GenresContainer}>
          {filmData.film.genres.map((genre) => (
            <p key={genre.id}>{genre.name}</p>
          ))}
        </div>
      </div>
      <div className={styles.CastAndCrewSection}>
        <h3>Cast and Crew</h3>
        <div className={styles.CastAndCrewWrapper}>
          <div className={styles.CastAndCrewContainer}>
            {getDirectorAndScreenwriter(filmData.castAndCrew.crew).map(
              (crew) => (
                <CastAndCrewItem
                  key={crew.credit_id}
                  name={crew.name}
                  role={crew.job}
                  profile_path={crew.profile_path}
                ></CastAndCrewItem>
              )
            )}
            {filmData.castAndCrew.cast.slice(0, 20).map((cast) => (
              <CastAndCrewItem
                key={cast.cast_id}
                name={cast.name}
                role={cast.character}
                profile_path={cast.profile_path}
              ></CastAndCrewItem>
            ))}
          </div>
        </div>
      </div>

      {/* Review Modal and Transitions */}
      <CSSTransition
        in={showModal}
        unmountOnExit
        timeout={300}
        classNames="background"
        onEntered={() =>
          blurStyleUpdate({
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(11px)",
          })
        }
        onExit={() => blurStyleUpdate({})}
      >
        <div className={styles.ReviewModal} style={blurStyle}></div>
      </CSSTransition>

      <CSSTransition
        in={showModal}
        unmountOnExit
        timeout={300}
        classNames="review-modal"
      >
        <ReviewModal
          filmTitle={filmData.film.title}
          review={review}
          rating={rating}
          onClose={() => showModalUpdate(false)}
          onSave={saveRatingReview}
        ></ReviewModal>
      </CSSTransition>
    </PageContainer>
  );
};

export default FilmDetail;
