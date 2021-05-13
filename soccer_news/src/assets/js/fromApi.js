import {
  loadingBar,
  renderSpecificPlayer,
  renderBestScores,
  renderPlayerDetails,
  loadTeamSchedule,
  renderTeamDetail,
  renderTable,
  renderNavCompetitions,
} from "./template.js";

const fetchApi = (url) => {
  return fetch(url, {
    method: "GET",
    headers: {
      "X-Auth-Token": "",
    }
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
    if(api.status > 400) {
      return `<p style="text-align: center;">${responseJson.message}</p>`
    } else {
      const standings = responseJson.standings.filter(
        (standing) => standing.type === "TOTAL"
      );
      return renderTable(standings, responseJson);
    }
  } catch (err) {
    console.error(err);
  }
};

const competitionsApi = async (baseURL) => {
  try {
    const loading = loadingBar();
    const url = `${baseURL}competitions?plan=TIER_ONE`;
    document.querySelector(".container-competitions").innerHTML = loading;
    const api = await fetchApi(url);
    const responseJson = await api.json();
    const competitions = responseJson
                        .competitions
                        .map(({ id, name })  => ({ id, name }))
                        .sort((a, b) => {
                          let nameA = a.name.toUpperCase()
                          let nameB = b.name.toUpperCase()
                          if(nameA < nameB) return -1
                          if(nameA > nameB) return 1
                          return 0
                        });
    return renderNavCompetitions(competitions);
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
  competitionsApi
};
