import {
  getSpecificPlayerCache,
  bestCompetitionsScoresCache,
  playerMatchesCache,
  todayCompetitionCache,
  matchScheduleCache,
  getSpecificTeamsCaches,
  leagueStandingsCache,
  undoApi,
} from "./fromCache.js";

import { renderAllFromDb, renderTeamDetail } from "./template.js";

import { getAll, getById } from "./db.js";

const baseURL = "https://api.football-data.org/v2/";

const leagueStandings = (option) => {
  return leagueStandingsCache(baseURL, option);
};

const matchSchedule = (id) => {
  if ("caches" in window) {
    return matchScheduleCache(baseURL, id);
  }
};

const todayCompetitions = () => {
  if ("caches" in window) {
    return todayCompetitionCache(baseURL);
  }
};

const playerMatches = (id) => {
  if ("caches" in window) {
    return playerMatchesCache(baseURL, id);
  }
};

const bestCompetitionsScores = (option) => {
  if ("caches" in window) {
    return bestCompetitionsScoresCache(baseURL, option);
  }
};

const getSpecificPlayer = (id) => {
  if ("caches" in window) {
    return getSpecificPlayerCache(baseURL, id);
  }
};

const getSpecificTeams = (id) => {
  return new Promise((resolve, reject) => {
    if ("caches" in window) {
      const data = getSpecificTeamsCaches(baseURL, id);
      resolve(data);
    }
  });
};

const getAllFromDb = async () => {
  const db = await getAll();
  return renderAllFromDb(db);
};

const getByIdFromDb = async (id) => {
  try {
    const db = await getById(id);
    const result = renderTeamDetail(db);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const undo = async (id) => {
  return await undoApi(baseURL, id);
};

export {
  getByIdFromDb,
  getAllFromDb,
  getSpecificTeams,
  getSpecificPlayer,
  bestCompetitionsScores,
  playerMatches,
  todayCompetitions,
  matchSchedule,
  leagueStandings,
  undo,
};
