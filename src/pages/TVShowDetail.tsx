import React, { useState, useEffect } from "react";
import PageContainer from "../core/PageContainer";
import { PageType } from "../App";
import styles from "./TVShowDetail.module.scss";
import Button from "../core/Button";
import { TVShow, testData } from "../types/TVShow";
import { CastAndCrew } from "../types/CastAndCrew";
import moment from "moment";
import Header from "../core/Header";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Icon from "../common/Icon";
import ReviewModal from "../components/ReviewModal";
import { CSSTransition } from "react-transition-group";
import "./FilmDetailAnimations.css";
import { functions } from "../config/firebase";
import CastAndCrewItem from "../components/CastAndCrewItem";
import RatingCell from "../components/RatingCell";
import Poster from "../components/Poster";
import Feedback from "../types/Feedback";
import { ListType, ListItem } from "../types/listItem";

async function fetchTVShowPromise() {
  const fetchMovieFunc = functions.httpsCallable("fetchTVShow");
  const response = await fetchMovieFunc({
    userUID: localStorage.getItem("userUID"),
    tvShowID: Number(localStorage.getItem("tvShowID")),
  });
  const tvShow = response.data.tvShow as TVShow;
  const castAndCrew = response.data.castAndCrew as CastAndCrew;
  const isToWatch = response.data.isToWatch as boolean;
  const isFavorite = response.data.isFavorite as boolean;
  const seasonsFeedbacks = response.data.seasonsFeedbacks as Feedback[];

  return {
    tvShow,
    castAndCrew,
    isToWatch,
    isFavorite,
    seasonsFeedbacks,
  };
}

function saveFeedbackPromise(
  tvShow: TVShow,
  season: number,
  rating: number,
  review: string
) {
  const postFeedback = functions.httpsCallable("postFeedback");
  const username = localStorage.getItem("username")!;

  const feedback: Feedback = {
    id: tvShow.id,
    posterPath: tvShow.poster_path,
    title: tvShow.name,
    season,
    review,
    rating,
    userUID: localStorage.getItem("userUID")!,
    username,
    type: "tvShow",
  };
  return postFeedback({
    feedback,
  });
}

function addTVShowToListPromise(tvShow: TVShow, list: string) {
  const addToList = functions.httpsCallable("addToList");
  const listItem: ListItem = {
    id: tvShow.id,
    poster_path: tvShow.poster_path,
    title: tvShow.name,
    type: "tvShow",
  };
  return addToList({ list, listItem });
}

function removeTVShowFromListPromise(tvShowID: number, list: ListType) {
  const removeFromList = functions.httpsCallable("removeFromList");
  return removeFromList({ id: tvShowID, list });
}

const TVShowDetail: React.FunctionComponent<PageType> = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [tvShowData, setTVShowData] = useState<{
    tvShow: TVShow;
    castAndCrew: CastAndCrew;
  }>();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isToWatch, setIsToWatch] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const getRatingCell = (season: number) => {
    const feedback = feedbacks.find((x) => x.season === season);
    if (feedback)
      return (
        <RatingCell
          rating={feedback.rating}
          className={styles.RatingCell}
        ></RatingCell>
      );
    return null;
  };

  const fetchTVShow = async () => {
    try {
      const {
        tvShow,
        castAndCrew,
        isToWatch,
        isFavorite,
        seasonsFeedbacks,
      } = await fetchTVShowPromise();
      setTVShowData({ tvShow, castAndCrew });
      setIsToWatch(isToWatch);
      setIsFavorite(isFavorite);
      setFeedbacks(seasonsFeedbacks);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const addTVShowToList = async (tvShow: TVShow, list: ListType) => {
    try {
      await addTVShowToListPromise(tvShow, list);
      if (list === "toWatch") setIsToWatch(true);
      else setIsFavorite(true);
    } catch (err) {
      console.error(err);
    }
  };

  const removeTVShowFromList = async (tvShowID: number, list: ListType) => {
    try {
      await removeTVShowFromListPromise(tvShowID, list);
      if (list === "toWatch") setIsToWatch(false);
      else setIsFavorite(false);
    } catch (err) {
      console.error(err);
    }
  };

  const saveFeedback = async (
    season: number,
    rating: number,
    review: string
  ) => {
    try {
      const data = tvShowData!;
      const result = await saveFeedbackPromise(
        data.tvShow,
        season,
        rating,
        review
      );

      // Handle Seasons Feedback
      const feedback = result.data as Feedback;
      const updatedFeedbacks =
        feedbacks.length === 0
          ? [feedback]
          : feedbacks.map((feedback) =>
              feedback.season === season
                ? ({ ...feedback, rating, review } as Feedback)
                : { ...feedback }
            );
      setShowModal(false);
      setFeedbacks(updatedFeedbacks);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTVShow();
    // Use this when you want dummy data
    // setTVShowData(testData);
    // setIsLoading(false);
  }, []);

  if (isLoading) return null;
  return (
    <PageContainer className={`${styles.Container}`}>
      <Header
        title={tvShowData!.tvShow.name}
        iconLeft={<Icon>{faChevronLeft}</Icon>}
        actionLeft={() => props.back!()}
      ></Header>
      <div className={styles.PosterSection}>
        <Poster poster_path={tvShowData!.tvShow.poster_path}></Poster>
      </div>
      <div className={styles.MainInfoSection}>
        <h1>{tvShowData!.tvShow.name}</h1>
        <h2>
          {moment(tvShowData!.tvShow.first_air_date).format("DD MMM YYYY")}
        </h2>
      </div>
      <div className={styles.ButtonsContainer}>
        <Button
          isSelected={isToWatch}
          onClick={() => {
            if (!isToWatch) addTVShowToList(tvShowData!.tvShow, "toWatch");
            else removeTVShowFromList(tvShowData!.tvShow.id, "toWatch");
          }}
        >
          To Watch
        </Button>
        <Button
          isSelected={isFavorite}
          onClick={() => {
            if (!isFavorite) addTVShowToList(tvShowData!.tvShow, "favorites");
            else removeTVShowFromList(tvShowData!.tvShow.id, "favorites");
          }}
        >
          Favorite
        </Button>
      </div>
      <div className={styles.SynopsisSection}>
        <h3>Synopsis</h3>
        <p>{tvShowData!.tvShow.overview}</p>
      </div>
      <div className={styles.GenresSection}>
        <h3>Genres</h3>
        <div className={styles.GenresContainer}>
          {tvShowData!.tvShow.genres.map((genre) => (
            <p key={genre.id}>{genre.name}</p>
          ))}
        </div>
      </div>
      <div className={styles.SeasonsSection}>
        <h3>Seasons</h3>
        <div className={styles.SeasonContainer}>
          {tvShowData!.tvShow.seasons.map((season) => (
            <div key={season.season_number} className={styles.SeasonElement}>
              <div className={styles.SeasonData}>
                <h3>{`Season ${season.season_number}`}</h3>
                <h4>{moment(season.air_date).format("DD MMM YYYY")}</h4>
              </div>
              {getRatingCell(season.season_number)}
              <div className={styles.SeasonActions}>
                <Button
                  isSelected={feedbacks.some(
                    (feedback) => feedback.season === season.season_number
                  )}
                  onClick={() => {
                    setSelectedSeason(season.season_number);
                    setShowModal(true);
                  }}
                >
                  Watched
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.CastAndCrewSection}>
        <h3>Cast and Crew</h3>
        <div className={styles.CastAndCrewWrapper}>
          <div className={styles.CastAndCrewContainer}>
            {tvShowData!.tvShow.created_by.map((crew) => (
              <CastAndCrewItem
                key={crew.credit_id}
                name={crew.name}
                role="Creator"
                profile_path={crew.profile_path}
              ></CastAndCrewItem>
            ))}
            {tvShowData!.castAndCrew.cast.slice(0, 20).map((cast) => (
              <CastAndCrewItem
                key={cast.id}
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
          title={`${tvShowData!.tvShow.name} -  Season ${selectedSeason}`}
          review={feedbacks.find((x) => x.season === selectedSeason)?.review}
          rating={feedbacks.find((x) => x.season === selectedSeason)?.rating}
          onClose={() => setShowModal(false)}
          onSave={(rating, review) =>
            saveFeedback(selectedSeason, rating, review)
          }
        ></ReviewModal>
      </CSSTransition>
    </PageContainer>
  );
};

export default TVShowDetail;
