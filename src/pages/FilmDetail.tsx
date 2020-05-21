import React, { useState, useEffect } from "react";
import PageContainer from "../core/PageContainer";
import { PageType } from "../App";
import styles from "./FilmDetail.module.scss";
import Button from "../core/Button";
import { Film } from "../types/Film";
import { CastAndCrew, Crew } from "../types/CastAndCrew";
import moment from "moment";
import Header from "../core/Header";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Icon from "../common/Icon";
import ReviewModal from "../components/ReviewModal";
import { CSSTransition } from "react-transition-group";
import "./FilmDetailAnimations.css";
import { functions } from "../config/firebase";
import { ListItem, ListType } from "../types/listItem";
import CastAndCrewItem from "../components/CastAndCrewItem";
import Poster from "../components/Poster";
import Feedback from "../types/Feedback";

function getDirectorAndScreenwriter(crew: Crew[]): Crew[] {
  const filteredCrew = crew.filter(
    (x) => x.job === "Director" || x.job === "Screenplay"
  );

  if (filteredCrew.length > 1 && filteredCrew[0].id === filteredCrew[1].id) {
    return [
      {
        ...filteredCrew[0],
        job: `${filteredCrew[0].job} ${filteredCrew[1].job}`,
      },
    ];
  }
  return filteredCrew;
}

async function fetchFilmPromise() {
  const fetchMovieFunc = functions.httpsCallable("fetchFilm");
  const response = await fetchMovieFunc({
    userUID: localStorage.getItem("userUID"),
    filmID: Number(localStorage.getItem("filmID")),
  });
  const film = response.data.film as Film;
  const castAndCrew = response.data.castAndCrew as CastAndCrew;
  const feedback = response.data.feedback as Feedback;
  const isToWatch = response.data.isToWatch as boolean;
  const isWatched = response.data.isWatched as boolean;
  const isFavorite = response.data.isFavorite as boolean;

  return {
    film,
    castAndCrew,
    feedback,
    isToWatch,
    isWatched,
    isFavorite,
  };
}

function saveFeedbackPromise(film: Film, rating: number, review: string) {
  const postFeedback = functions.httpsCallable("postFeedback");
  const username = localStorage.getItem("username")!;

  const feedback: Feedback = {
    id: film.id,
    posterPath: film.poster_path,
    title: film.title,
    review,
    rating,
    userUID: localStorage.getItem("userUID")!,
    username,
    type: "film",
  };
  return postFeedback({
    feedback,
  });
}

function addFilmToListPromise(film: Film, list: string) {
  const addToList = functions.httpsCallable("addToList");
  const listItem: ListItem = {
    id: film.id,
    poster_path: film.poster_path,
    title: film.title,
    type: "film",
  };
  return addToList({ list, listItem });
}

function removeFilmFromListPromise(filmID: number, list: ListType) {
  const removeFromList = functions.httpsCallable("removeFromList");
  return removeFromList({ id: filmID, list });
}

const FilmDetail: React.FunctionComponent<PageType> = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [filmData, setFilmData] = useState<{
    film: Film;
    castAndCrew: CastAndCrew;
  }>();
  const [review, setReview] = useState<string | undefined>(undefined);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [isToWatch, setIsToWatch] = useState(false);
  const [isWatched, setWatched] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchFilm = async () => {
    try {
      const {
        film,
        castAndCrew,
        feedback,
        isToWatch,
        isWatched,
        isFavorite,
      } = await fetchFilmPromise();
      setFilmData({ film, castAndCrew });
      setReview(feedback ? feedback.review : undefined);
      setRating(feedback ? feedback.rating : undefined);

      setIsToWatch(isToWatch);
      setWatched(isWatched);
      setIsFavorite(isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  const saveFeedback = async (rating: number, review: string) => {
    try {
      const data = filmData!;
      await saveFeedbackPromise(data.film, rating, review);
      setShowModal(false);
      setReview(review);
      setRating(rating);
      setWatched(true);
    } catch (err) {
      console.error(err);
    }
  };

  const addFilmToList = async (film: Film, list: ListType) => {
    try {
      await addFilmToListPromise(film, list);
      if (list === "toWatch") setIsToWatch(true);
      else if (list === "watched") setWatched(true);
      else setIsFavorite(true);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFilmFromList = async (filmID: number, list: ListType) => {
    try {
      await removeFilmFromListPromise(filmID, list);
      if (list === "toWatch") setIsToWatch(false);
      else if (list === "watched") setWatched(false);
      else setIsFavorite(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFilm();
    // Use this when you want dummy data
    // setFilmData(testData);
    // setReview("Test Review");
    // setRating(10);
  }, []);

  if (filmData === undefined) return null;
  return (
    <PageContainer className={`${styles.Container}`}>
      <Header
        title={filmData.film.title}
        iconLeft={<Icon>{faChevronLeft}</Icon>}
        actionLeft={() => props.back!()}
      ></Header>
      <div className={styles.PosterSection}>
        <Poster
          poster_path={filmData.film.poster_path}
          rating={rating}
        ></Poster>
      </div>
      <div className={styles.MainInfoSection}>
        <h1>{filmData.film.title}</h1>
        <h2>{moment(filmData.film.release_date).format("DD MMM YYYY")}</h2>
      </div>
      <div className={styles.ButtonsContainer}>
        <Button
          isSelected={isToWatch}
          onClick={() => {
            if (!isToWatch) addFilmToList(filmData.film, "toWatch");
            else removeFilmFromList(filmData.film.id, "toWatch");
          }}
        >
          To Watch
        </Button>
        <Button isSelected={isWatched} onClick={() => setShowModal(true)}>
          Watched
        </Button>
        <Button
          isSelected={isFavorite}
          onClick={() => {
            if (!isFavorite) addFilmToList(filmData.film, "favorites");
            else removeFilmFromList(filmData.film.id, "favorites");
          }}
        >
          Favorite
        </Button>
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
      >
        <div
          className={styles.ReviewModal}
          onClick={() => setShowModal(false)}
        ></div>
      </CSSTransition>

      <CSSTransition
        in={showModal}
        unmountOnExit
        timeout={300}
        classNames="review-modal"
      >
        <ReviewModal
          title={filmData.film.title}
          review={review}
          rating={rating}
          onClose={() => setShowModal(false)}
          onSave={saveFeedback}
        ></ReviewModal>
      </CSSTransition>
    </PageContainer>
  );
};

export default FilmDetail;
