import {
  loadingBar,
  renderSpecificPlayer,
  renderBestScores,
  renderPlayerDetails,
  loadTeamSchedule,
  renderTeamDetail,
  renderTable,
} from "./template.js";

const fetchApi = (url) => {
  return fetch(url, {
    method: "GET",
    headers: {
      "X-Auth-Token": "a278ac30977441dba32c4a833602f37b",
    },
  });
};

const leagueStandingsApi = async (baseURL, option) => {
  try {
    const loading = loadingBar();
    const url = `${baseURL}competitions/${option}/standings`;
    document.querySelector(".container-table").innerHTML = loading;
    document.querySelector(".standings-title").innerHTML = "";
    const api = await fetchApi(url);
    const responseJson = await api.json();
    const standings = responseJson.standings.filter(
      (standing) => standing.type === "TOTAL"
    );
    return renderTable(standings, responseJson);
  } catch (err) {
    console.error(err);
  }
};

const getSpecificTeamsApi = async (baseURL, id) => {
  try {
    const loading = loadingBar();
    const url = `${baseURL}teams/${id}`;
    document.querySelector(".team-detail-content").innerHTML = loading;
    document.querySelector(".table").innerHTML = "";
    const api = await fetchApi(url);
    const responseJson = await api.json();
    return { responseJson, result: renderTeamDetail(responseJson) };
  } catch (err) {
    console.error(err);
  }
};

const matchScheduleApi = async (baseURL, id) => {
  try {
    const loading = loadingBar();
    const url = `${baseURL}teams/${id}/matches?status=SCHEDULED`;
    document.querySelector(".table-team-schedule").innerHTML = loading;
    const api = await fetchApi(url);
    const responseJson = await api.json();
    return responseJson && loadTeamSchedule(responseJson);
  } catch (err) {
    console.error(err);
  }
};

const todayCompetitionApi = async (baseURL) => {
  try {
    const loading = loadingBar();
    const url = `${baseURL}matches`;
    document.querySelector(".table-today-competition").innerHTML = loading;
    const api = await fetchApi(url);
    const responseJson = await api.json();
    return responseJson && loadTeamSchedule(responseJson);
  } catch (err) {
    console.error(err);
  }
};

const playerMathcesApi = async (baseURL, id) => {
  try {
    const loading = loadingBar();
    const url = `${baseURL}players/${id}/matches?status=FINISHED`;
    document.querySelector(".player-mathces-content").innerHTML = loading;
    document.querySelector(".table-player-mathces").innerHTML = "";
    const api = await fetchApi(url);
    const responseJson = await api.json();
    return responseJson && renderPlayerDetails(responseJson);
  } catch (err) {
    console.error(err);
  }
};

const bestCompetitionsScoresApi = async (baseURL, option) => {
  try {
    const loading = loadingBar();
    const url = `${baseURL}competitions/${option}/scorers`;
    document.querySelector(".score-title").innerHTML = loading;
    document.querySelector(".container-table").innerHTML = "";
    const api = await fetchApi(url);
    const responseJson = await api.json();
    return responseJson && renderBestScores(responseJson);
  } catch (err) {
    console.error(err);
  }
};

const getSpecificPlayerApi = async (baseURL, id) => {
  try {
    const loading = loadingBar();
    const url = `${baseURL}players/${id}`;
    document.querySelector(".player-specific").innerHTML = loading;
    const api = await fetchApi(url);
    const responseJson = await api.json();
    return responseJson ? renderSpecificPlayer(responseJson) : loading;
  } catch (err) {
    console.error(err);
  }
};

export {
  getSpecificPlayerApi,
  bestCompetitionsScoresApi,
  playerMathcesApi,
  todayCompetitionApi,
  matchScheduleApi,
  getSpecificTeamsApi,
  leagueStandingsApi,
  fetchApi,
};
