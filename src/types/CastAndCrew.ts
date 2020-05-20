type Cast = {
  cast_id?: number;
  character: string;
  credit_id: string;
  gender: number;
  id: number;
  name: string;
  order: number;
  profile_path: string | null;
};

export type Crew = {
  credit_id: string;
  department: string;
  gender: number;
  id: number;
  job: string;
  name: string;
  profile_path: string | null;
};

export type CastAndCrew = {
  id: number;
  cast: Cast[];
  crew: Crew[];
};
