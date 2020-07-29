import { save, deleteTeamDetails, getById } from "./db.js";
import {
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
} from "./fetch.js";

const conLost = "<p class='center flow-text'>Connection lost...</p>";

function loadNav(sidenav) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status != 200) return;

      //* Muat daftar menu navigasi
      document.querySelectorAll(".topnav,.sidenav").forEach(function (elm) {
        elm.innerHTML = xhr.responseText;
      });

      //* Muat event
      document
        .querySelectorAll(".sidenav a, .topnav a, .brand-logo")
        .forEach((elm) => {
          elm.addEventListener("click", (e) => {
            M.Sidenav.getInstance(sidenav).close();
            let menu = e.target.getAttribute("href").substr(1);
            if (menu === "") menu = "home";
            loadPage(menu);
          });
        });
    }
  };
  xhr.open("GET", "assets/components/nav.html", true);
  xhr.send();
}

function loadPage(page) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      const slider = document.querySelector("#slider");
      const nav = document.querySelector("nav");
      if (this.status === 200) {
        slider.innerHTML = xhr.responseText;
        routes(page);
      } else {
        resetNav();
        slider.innerHTML = `<div class="container"><p class="center">ups... halaman tidak ditemukan.</p></div>`;
      }
    }
  };
  xhr.open("GET", `assets/components/${page}.html`, true);
  xhr.send();
}

const sliderLoad = () => {
  const opts = {
    indicators: true,
    duration: 1000,
    interval: 100000,
  };
  M.Slider.init(slider, opts);
};

const resetNav = () => {
  document.querySelector("nav").style.position = "static";
  document.querySelector("nav").style.opacity = "1";
};
const dropDownLoad = () => {
  const elm = document.querySelector("a.dropdown-trigger");
  M.Dropdown.init(elm, { constrainWidth: false });
};

const loadApiLeagueStandings = () => {
  let value = 2001;
  document.querySelectorAll(".option-dropdown").forEach((elm) => {
    elm.addEventListener("click", (e) => {
      value = e.target.getAttribute("data-value");
      renderToPageApiLeaugeStandings(value);
    });
  });
  renderToPageApiLeaugeStandings(value);
};

const renderToPageApiLeaugeStandings = async (value) => {
  try {
    const result = await leagueStandings(value);
    document.querySelector(".container-table").innerHTML = result
      ? result.team
      : conLost;
    document.querySelector(".standings-title").innerHTML = result
      ? result.title
      : "";
    leagueStandingsRedirectLinks();
  } catch (error) {
    console.log(error);
  }
};

const loadApibestCompetitionsScore = () => {
  let opt = 2001;
  document.querySelectorAll(".option-dropdown").forEach((elm) => {
    elm.addEventListener("click", () => {
      opt = elm.getAttribute("data-value");
      renderToPageBestCompetitionsScore(opt);
    });
  });
  renderToPageBestCompetitionsScore(opt);
};

const renderToPageBestCompetitionsScore = async (value) => {
  try {
    const result = await bestCompetitionsScores(value);
    document.querySelector(".score-title").innerHTML = result
      ? result.title
      : conLost;
    document.querySelector(".container-table").innerHTML = result
      ? result.tableScores
      : "";
    bestCompetitionsScoreRedirectLink();
  } catch (error) {
    console.log(error);
  }
};

const renderDetailPage = async () => {
  try {
    const url = window.location.hash.split("?id=")[1];
    const id = parseInt(url);
    const result = await getByIdFromDb(id);
    document.querySelector(".team-detail-content").innerHTML = result
      ? result.content
      : conLost;
    document.querySelector(".table").innerHTML = result
      ? result.tablePlayer
      : "";
    renderTeamDetailsRedrectlink();
  } catch (error) {
    console.log(error);
  }
};

const PlayerMathcesRedirectLink = () => {
  document.querySelector("#link").addEventListener("click", (e) => {
    const elems = link.getAttribute("href").substr(1).split("?id=")[0];
    loadPage(elems);
  });
};

const renderPlayerMathces = async () => {
  try {
    const url = window.location.hash.split("?id=")[1];
    const id = parseInt(url);
    const result = await playerMatches(id);
    document.querySelector(".player-mathces-content").innerHTML = result
      ? result.content
      : conLost;
    document.querySelector(".table-player-mathces").innerHTML = result
      ? result.tableMatches
      : "";
    PlayerMathcesRedirectLink();
  } catch (error) {
    console.log(error);
  }
};

const leagueStandingsRedirectLinks = () => {
  document
    .querySelectorAll("a#teamDetails, a#checkSchedule")
    .forEach((link) => {
      link.addEventListener("click", () => {
        const elems = link.getAttribute("href").substr(1).split("?id=")[0];
        loadPage(elems);
      });
    });
};

const loadApiScheduleTeams = async () => {
  try {
    const url = window.location.hash.split("?id=")[1];
    const id = parseInt(url);
    const result = await matchSchedule(id);
    document.querySelector(".table-team-schedule").innerHTML = result
      ? result
      : conLost;
  } catch (error) {
    console.log(error);
  }
};

const loadApiSpecificPlayer = async () => {
  try {
    const url = window.location.hash.split("?id=")[1];
    const id = parseInt(url);
    const result = await getSpecificPlayer(id);
    document.querySelector(".player-specific").innerHTML = result
      ? result
      : conLost;
  } catch (err) {
    console.log(err);
  }
};

const bestCompetitionsScoreRedirectLink = () => {
  document
    .querySelectorAll("a#playerMatchesLink, a#specificPlayer")
    .forEach((link) => {
      link.addEventListener("click", () => {
        const elems = link.getAttribute("href").substr(1).split("?id=")[0];
        loadPage(elems);
      });
    });
};

const renderToPage = async () => {
  try {
    const card = await getAllFromDb();
    document.querySelector("#container-card-save-all").innerHTML = card
      ? card
      : "<p class='center flow-text' id='bold'>Let's save your favourite teams!</p>";
    redirectLinks();
  } catch (err) {
    console.log(err);
  }
};

const redirectLinks = () => {
  document.querySelectorAll(".card-action a").forEach((elm) => {
    elm.addEventListener("click", () => {
      const elems = elm.getAttribute("href").substr(1).split("?id=")[0];
      loadPage(elems);
    });
  });
};

const renderTeamDetailsRedrectlink = () => {
  document
    .querySelectorAll("a#playerMathces,a#specificPlayer")
    .forEach((elm) => {
      elm.addEventListener("click", () => {
        const elems = elm.getAttribute("href").substr(1).split("?id=")[0];
        loadPage(elems);
      });
    });
};

const renderTeamDetails = async () => {
  try {
    const url = window.location.hash.split("?id=")[1];
    const id = parseInt(url);
    const isSaved = window.location.hash.split("&isSave=")[1];
    const button = document.querySelector("#btn-save");

    if (isSaved === "true") {
      const btn = `
      <div class="fixed-action-btn" id="btn">
      <a class="btn-floating btn-large red blue-grey darken-4" id="save" href="#saved">
      <i class="large material-icons" id="icon-color">delete</i>
      </a></div>
      `;
      button.innerHTML = btn;
      const saveClick = document.querySelector("#save");
      renderDetailPage();
      saveClick.onclick = () => {
        let toastDelete =
          '<span>The page will be deleted.</span><button class="btn-flat toast-action no"><i class="material-icons medium">undo</i></button>';
        M.toast({ html: toastDelete });
        document.querySelector(".no").addEventListener("click", async () => {
          const data = await undo(id);
          save(data);
          renderToPage();
        });
        deleteTeamDetails(id);
        loadPage("saved");
      };
    } else {
      const btn = `
      <div class="fixed-action-btn" id="btn">
      <a class="btn-floating btn-large red blue-grey darken-4" id="save">
      <i class="large material-icons" id="icon-color">save</i>
      </a></div>
      `;
      button.innerHTML = btn;
      const saveClick = document.querySelector("#save");
      const data = await getSpecificTeams(id);
      document.querySelector(".team-detail-content").innerHTML = data
        ? data.result.content
        : conLost;
      document.querySelector(".table").innerHTML = data
        ? data.result.tablePlayer
        : "";
      renderTeamDetailsRedrectlink();
      data && (await getById(data.responseJson.id)) && (button.innerHTML = "");
      saveClick.onclick = () => {
        data
          ? save(data.responseJson).then((res) => {
              M.toast({ html: res });
            })
          : M.toast({ html: "Connection lost..." });
      };
    }
  } catch (error) {
    console.log(error);
  }
};

const loadTodayCompetitions = async () => {
  try {
    const result = await todayCompetitions();
    document.querySelector(".table-today-competition").innerHTML = result
      ? result
      : conLost;
  } catch (error) {
    console.log(error);
  }
};

const routes = (page) => {
  switch (page) {
    case "home":
      sliderLoad();
      break;
    case "leagueStandings":
      resetNav();
      dropDownLoad();
      loadApiLeagueStandings();
      break;
    case "scheduleTeams":
      resetNav();
      loadApiScheduleTeams();
      break;
    case "teamDetails":
      resetNav();
      renderTeamDetails();
      break;
    case "playerMatches":
      resetNav();
      renderPlayerMathces();
      break;
    case "specificPlayer":
      resetNav();
      loadApiSpecificPlayer();
      break;
    case "todayCompetitions":
      resetNav();
      loadTodayCompetitions();
      break;
    case "bestCompetitionsScore":
      resetNav();
      dropDownLoad();
      loadApibestCompetitionsScore();
      break;
    case "saved":
      resetNav();
      renderToPage();
      break;
    default:
      break;
  }
};

export { loadNav, loadPage };
