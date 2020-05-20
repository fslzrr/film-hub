import { Crew } from "./CastAndCrew";

export type CreatedBy = {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path?: any;
};

export type Genre = {
  id: number;
  name: string;
};

export type LastEpisodeToAir = {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
};

export type Network = {
  name: string;
  id: number;
  logo_path: string;
  origin_country: string;
};

export type ProductionCompany = {
  id: number;
  logo_path?: any;
  name: string;
  origin_country: string;
};

export type Season = {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
};

export type TVShow = {
  backdrop_path: string;
  created_by: CreatedBy[];
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: LastEpisodeToAir;
  name: string;
  next_episode_to_air?: any;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  seasons: Season[];
  status: string;
  type: string;
  vote_average: number;
  vote_count: number;
};

export type GuestStar = {
  id: number;
  name: string;
  credit_id: string;
  character: string;
  order: number;
  gender: number;
  profile_path: string;
};

export type Episode = {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
  crew: Crew[];
  guest_stars: GuestStar[];
};

export type SeasonData = {
  _id: string;
  air_date: string;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
};

export const testData = {
  tvShow: {
    backdrop_path: "/u23G9KZregWHs1use6ir1fX27gl.jpg",
    created_by: [
      {
        id: 2099609,
        credit_id: "5b657a300e0a267ef4072d27",
        name: "Laurie Nunn",
        gender: 1,
        profile_path: null,
      },
    ],
    episode_run_time: [45],
    first_air_date: "2019-01-11",
    genres: [
      {
        id: 35,
        name: "Comedy",
      },
      {
        id: 18,
        name: "Drama",
      },
    ],
    homepage: "https://www.netflix.com/title/80197526",
    id: 81356,
    in_production: true,
    languages: ["hi"],
    last_air_date: "2020-01-17",
    last_episode_to_air: {
      air_date: "2020-01-17",
      episode_number: 8,
      id: 1997018,
      name: "Episode 8",
      overview:
        "The talking cure may be failing Otis and Jean as they sort out their issues. A wary Maeve makes the finals. Sexy Shakespeare never goes out of style.",
      production_code: "",
      season_number: 2,
      show_id: 81356,
      still_path: "/5AvJbMdjERWUTv8AeXzLyssxTWs.jpg",
      vote_average: 7.667,
      vote_count: 3,
    },
    name: "Sex Education",
    next_episode_to_air: null,
    networks: [
      {
        name: "Netflix",
        id: 213,
        logo_path: "/wwemzKWzjKYJFfCeiB57q3r4Bcm.png",
        origin_country: "",
      },
    ],
    number_of_episodes: 16,
    number_of_seasons: 2,
    origin_country: ["GB"],
    original_language: "en",
    original_name: "Sex Education",
    overview:
      "Inexperienced Otis channels his sex therapist mom when he teams up with rebellious Maeve to set up an underground sex therapy clinic at school.",
    popularity: 39.265,
    poster_path: "/4Bph0hhnDH6dpc0SZIV522bLm4P.jpg",
    production_companies: [
      {
        id: 34666,
        logo_path: null,
        name: "Eleven Films",
        origin_country: "",
      },
    ],
    seasons: [
      {
        air_date: "2019-01-11",
        episode_count: 8,
        id: 107288,
        name: "Season 1",
        overview:
          "Insecure Otis has all the answers when it comes to sex advice, thanks to his therapist mom. So rebel Maeve proposes a school sex-therapy clinic.",
        poster_path: "/u3eoZguH2tqLLKqRqWjvisF0d2U.jpg",
        season_number: 1,
      },
      {
        air_date: "2020-01-17",
        episode_count: 8,
        id: 136055,
        name: "Season 2",
        overview:
          "Otis finally loosens up -- often and epically -- but the pressure’s on to perform as chlamydia hits the school and mates struggle with new issues.",
        poster_path: "/rdcY9VJ5uVsCvCxdHoyZzXtKp2E.jpg",
        season_number: 2,
      },
    ],
    status: "Returning Series",
    type: "Scripted",
    vote_average: 8.4,
    vote_count: 1376,
  },
  castAndCrew: {
    cast: [
      {
        character: "Otis Milburn",
        credit_id: "5b6579df0e0a267ef4072c7f",
        id: 77996,
        name: "Asa Butterfield",
        gender: 2,
        profile_path: "/wy20YeD36WvaAuwAKkrDe8bzyY0.jpg",
        order: 0,
      },
      {
        character: "Jean Milburn",
        credit_id: "5b6579cb0e0a267ef8074ed9",
        id: 12214,
        name: "Gillian Anderson",
        gender: 1,
        profile_path: "/5emeOf49lM2WSs4rc186Wc9Zgs3.jpg",
        order: 1,
      },
      {
        character: "Eric Nevin",
        credit_id: "5c21adac92514167fbc27ab4",
        id: 1475239,
        name: "Ncuti Gatwa",
        gender: 2,
        profile_path: "/zc7x4xSaSUb85PBYUj7sXu17NvT.jpg",
        order: 2,
      },
      {
        character: "Maeve Wiley",
        credit_id: "5c21adeb0e0a264dedeee60d",
        id: 2201315,
        name: "Emma Mackey",
        gender: 1,
        profile_path: "/9OZBcFSS3Yz0Oqr8mssbQa4suW8.jpg",
        order: 3,
      },
      {
        character: "Jackson Monroe",
        credit_id: "5c21ae0b0e0a26309aee5731",
        id: 126169,
        name: "Kedar Williams-Stirling",
        gender: 2,
        profile_path: "/dhXjEwdKhhObMgU1Y8cA1MgZnUL.jpg",
        order: 4,
      },
      {
        character: "Aimee Gibbs",
        credit_id: "5c21ae29c3a3687001ec79c4",
        id: 2201317,
        name: "Aimée-Lou Wood",
        gender: 1,
        profile_path: "/4mBtmJ4MAkP1fRPhQC7lHTpntW3.jpg",
        order: 5,
      },
      {
        character: "Adam Groff",
        credit_id: "5c21ae500e0a264de6eec158",
        id: 2112439,
        name: "Connor Swindells",
        gender: 2,
        profile_path: "/jUY1Ayi79usRpwjMmrGVtGmWL6B.jpg",
        order: 6,
      },
      {
        character: "Ola Nyman",
        credit_id: "5c4701359251410e0a50b1bc",
        id: 2223754,
        name: "Patricia Allison",
        gender: 1,
        profile_path: "/ztRXYFo2HUgUkxKjNbh3ivlw6pL.jpg",
        order: 15,
      },
      {
        character: "Mr. Groff",
        credit_id: "5c4701030e0a264962c9c351",
        id: 56100,
        name: "Alistair Petrie",
        gender: 2,
        profile_path: null,
        order: 34,
      },
    ],
    crew: [
      {
        credit_id: "5e5d85c11108a800150aa771",
        department: "Sound",
        id: 2555574,
        name: "Tolga Kahraman",
        gender: 2,
        job: "Sound",
        profile_path: null,
      },
    ],
    id: 81356,
  },
};
