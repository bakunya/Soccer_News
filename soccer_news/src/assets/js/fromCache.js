import {
  getSpecificPlayerApi,
  bestCompetitionsScoresApi,
  playerMathcesApi,
  todayCompetitionApi,
  matchScheduleApi,
  getSpecificTeamsApi,
  leagueStandingsApi,
  fetchApi,
} from "./fromApi.js";

import {
  loadingBar,
  renderSpecificPlayer,
  renderBestScores,
  renderPlayerDetails,
  loadTeamSchedule,
  renderTeamDetail,
  renderTable,
  spinnerLoading,
} from "./template.js";

const leagueStandingsCache = async (baseURL, option) => {
  try {
    const loading = loadingBar();
    document.querySelector(".container-table").innerHTML = loading;
    document.querySelector(".standings-title").innerHTML = "";
    const cache = await caches.match(
      `${baseURL}competitions/${option}/standings`
    );
    if (cache) {
      const responseJson = await cache.json();
      const standings = responseJson.standings.filter(
        (standing) => standing.type === "TOTAL"
      );
      const result = renderTable(standings, responseJson);
      return result;
    } else {
      return leagueStandingsApi(baseURL, option);
    }
  } catch (err) {
    console.error(err);
  }
};

const getSpecificTeamsCaches = async (baseURL, id) => {
  try {
    const loading = loadingBar();
    document.querySelector(".team-detail-content").innerHTML = loading;
    document.querySelector(".table").innerHTML = "";
    const cache = await caches.match(`${baseURL}teams/${id}`);
    if (cache) {
      const responseJson = await cache.json();
      const result = renderTeamDetail(responseJson);
      return { responseJson, result };
    } else {
      return getSpecificTeamsApi(baseURL, id);
    }
  } catch (err) {
    console.error(err);
  }
};

const matchScheduleCache = async (baseURL, id) => {
  try {
    const loading = loadingBar();
    document.querySelector(".table-team-schedule").innerHTML = loading;
    const cache = await caches.match(
      `${baseURL}teams/${id}/matches?status=SCHEDULED`
    );
    if (cache) {
      const responseJson = await cache.json();
      return loadTeamSchedule(responseJson);
    } else {
      return matchScheduleApi(baseURL, id);
    }
  } catch (err) {
    console.error(err);
  }
};

const todayCompetitionCache = async (baseURL) => {
  try {
    const loading = loadingBar();
    document.querySelector(".table-today-competition").innerHTML = loading;
    const cache = await caches.match(`${baseURL}matches`);
    if (cache) {
      const responseJson = await cache.json();
      return loadTeamSchedule(responseJson);
    } else {
      return todayCompetitionApi(baseURL);
    }
  } catch (err) {
    console.error(err);
  }
};

const playerMatchesCache = async (baseURL, id) => {
  try {
    const loading = loadingBar();
    document.querySelector(".player-mathces-content").innerHTML = loading;
    document.querySelector(".table-player-mathces").innerHTML = "";
    const cache = await caches.match(
      `${baseURL}players/${id}/matches?status=FINISHED`
    );
    if (cache) {
      const responseJson = await cache.json();
      return renderPlayerDetails(responseJson);
    } else {
      return playerMathcesApi(baseURL, id);
    }
  } catch (err) {
    console.error(err);
  }
};

const bestCompetitionsScoresCache = async (baseURL, option) => {
  try {
    const loading = loadingBar();
    document.querySelector(".score-title").innerHTML = loading;
    document.querySelector(".container-table").innerHTML = "";
    const cache = await caches.match(
      `${baseURL}competitions/${option}/scorers`
    );
    if (cache) {
      const responseJson = await cache.json();
      return renderBestScores(responseJson);
    } else {
      return bestCompetitionsScoresApi(baseURL, option);
    }
  } catch (err) {
    console.error(err);
  }
};

const getSpecificPlayerCache = async (baseURL, id) => {
  try {
    const loading = loadingBar();
    document.querySelector(".player-specific").innerHTML = loading;
    const cache = await caches.match(`${baseURL}players/${id}`);
    if (cache) {
      const responseJson = await cache.json();
      return renderSpecificPlayer(responseJson);
    } else {
      return getSpecificPlayerApi(baseURL, id);
    }
  } catch (err) {
    console.error(err);
  }
};

const undoApi = async (baseURL, id) => {
  try {
    const btn = document.querySelector("#undo-loading");
    btn && (btn.innerHTML = spinnerLoading());
    const cache = await caches.match(`${baseURL}teams/${id}`);
    if (cache) {
      btn && (btn.innerHTML = "");
      return await cache.json();
    } else {
      const api = await fetchApi(`${baseURL}teams/${id}`);
      btn && (btn.innerHTML = "");
      return await api.json();
    }
  } catch (err) {
    console.error(err);
  }
};

export {
  getSpecificPlayerCache,
  bestCompetitionsScoresCache,
  playerMatchesCache,
  todayCompetitionCache,
  matchScheduleCache,
  getSpecificTeamsCaches,
  leagueStandingsCache,
  undoApi,
};
