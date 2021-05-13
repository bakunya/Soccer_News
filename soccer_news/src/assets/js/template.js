const replaceUrl = (url) => {
  return url.replace(/^http:\/\//i, "https://");
};

const renderTable = (clubs, standings) => {
  let team = "";
  const title = `
    <div>
      <p class="flow-text title">${
        standings.competition.name ? standings.competition.name : "-"
      }</p>
      <p class="flow-text title">Area: ${
        standings.competition.area.name ? standings.competition.area.name : "-"
      }</p>
      <p class="flow-text title">Seasons: ${
        standings.season.startDate
          ? `${standings.season.startDate} / ${standings.season.endDate}`
          : "-"
      }</p>
    </div>
    `;
  clubs.map((groups) => {
    let tbody = "";
    groups.table.map((team) => {
      tbody += `
            <tr>
              <td class="table-name-club"s>
                <div class="table-club-name">
                  ${team.team.name}
                </div>
              </td>
              <td>${team.goalsFor ? team.goalsFor : "-"}</td>
              <td>${team.points ? team.points : "-"}</td>
              <td>${team.playedGames ? team.playedGames : "-"}</td>
              <td>${team.position ? team.position : "-"}</td>
              <td><a href="#teamDetails?id=${
                team.team.id
              }&isSave=false" id="teamDetails">Detail Teams</a></td>
              <td><a href="#scheduleTeams?id=${
                team.team.id
              }" id="checkSchedule">Check Schedule</a></td>
            </tr>`;
    });

    team += `
      <table class="responsive-table striped centered">
      <thead>
      <tr>
      <th>Team</th>
      <th>Goals</th>
      <th>Points</th>
      <th>Played Games</th>
      <th>Positions</th>
      <th>Details</th>
      <th>Check Schedule</th>
      </tr>
      </thead>
      <tbody>
      ${tbody}
      </tbody>
      <p class="text-flow group-standings">${
        standings.competition.name === "UEFA Champions League"
          ? groups.group
          : groups.stage
      }</p>
      `;
  });
  return { team, title };
};

const renderNavCompetitions = (competitions) => {
  let nav = ''
  competitions.forEach(({ id, name }) => {
    nav += `<p data-id="${ id }" tabindex="0" class="standings_nav">${ name }</p>`
  })
  return { nav, competitions }
}

const renderTeamDetail = (team) => {
  const content = `
    <div class="row col l4 m5 s12">
      <img
        src="${team.crestUrl && replaceUrl(team.crestUrl)}"
        alt="Team Logo"
        class="responsive-img"
      />
    </div>
    <div class="row col l8 m7 s12">
      <ul class="collection with-header">
          <li class="collection-header">
            <p class="flow-text">
              ${team.name ? team.name : "-"}
            </p>
            <p>
            ${team.name ? team.name : "-"} or simply called ${
    team.shortName ? team.shortName : "-"
  } is a soccer team based at the ${
    team.address ? team.address : "-"
  } and venue in the ${
    team.venue ? team.venue : "-"
  }. Now they are playing at ${
    team.activeCompetitions.name ? team.activeCompetitions.name : "-"
  }, one of the biggest leagues in ${team.area.name ? team.area.name : "-"}.
            </p>
          </li>
          <li class="collection-item">Area: ${
            team.area.name ? team.area.name : "-"
          }</li>
          <li class="collection-item">Address: ${
            team.address ? team.address : "-"
          }</li>
          <li class="collection-item">Email: ${
            team.email ? team.email : "-"
          }</li>
          <li class="collection-item">Phone: ${
            team.phone ? team.phone : "-"
          }</li>
          <li class="collection-item">Shortname: ${
            team.shortName ? team.shortName : "-"
          }</li>
          <li class="collection-item">Founded: ${
            team.founded ? team.founded : "-"
          }</li>
      </ul>
    </div>
    `;
  let player = "";
  team.squad.map((plyr) => {
    player += `
        <tr>
          <td>${plyr.name ? plyr.name : "-"}</td>
          <td>${plyr.position ? plyr.position : "-"}</td>
          <td>${plyr.role ? plyr.role : "-"}</td>
          <td>${plyr.nationality ? plyr.nationality : "-"}</td>
          <td>${plyr.dateOfBirth ? plyr.dateOfBirth : "-"}</td>
          <td>${plyr.countryOfBirth ? plyr.countryOfBirth : "-"}</td>
          <td>
            <a href="#playerMatches?id=${
              plyr.id
            }" id="playerMathces">Matches</a>
            &
            <a href="#specificPlayer?id=${
              plyr.id
            }" id="specificPlayer">Player</a>
          </td>
        </tr>
      `;
  });

  let tablePlayer = `
    <table class="responsive-table striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Role</th>
              <th>Nationality</th>
              <th>Date of Birth</th>
              <th>Country of Birth</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody class="team-detail-table">
            ${player}
          </tbody>
        </table>
    `;

  if (team.squad.length < 1) {
    tablePlayer = "";
  }
  return { content, tablePlayer };
};

const loadTeamSchedule = (team) => {
  let schedule = "";
  team.matches.map((match) => {
    schedule += `
        <tr>
          <td>${match.homeTeam.name ? match.homeTeam.name : "-"}</td>
          <td>${match.awayTeam.name ? match.awayTeam.name : "-"}</td>
          <td>${match.competition.name ? match.competition.name : "-"}</td>
          <td>${match.group ? match.group : "-"}</td>
          <td>${match.matchday ? match.matchday : "-"}</td>
          <td>${match.season.startDate ? match.season.startDate : "-"}</td>
          <td>${match.season.endDate ? match.season.endDate : "-"}</td>
          <td>${
            match.utcDate
              ? match.utcDate.split("T")[0] +
                ", " +
                match.utcDate.split("T")[1].split("Z")[0]
              : "-"
          }</td>
        </tr>
        `;
  });
  const scheduleTable = `
    <table class="responsive-table striped">
      <thead>
        <tr>
          <th>Home Team</th>
          <th>Away Team</th>
          <th>Competition</th>
          <th>Group</th>
          <th>Match Day</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Utc Date</th>
        </tr>
      </thead>
  
      <tbody class="team-detail-table">${schedule}</tbody>
    </table>
    `;
  if (team.matches.length > 0) {
    return scheduleTable;
  } else {
    return `<p class="center flow-text">No Match.<p>`;
  }
};

const renderPlayerDetails = (player) => {
  const content = `
    <a id="link" class="flow-text" href="#specificPlayer?id=${
      player.player.id
    }">${player.player.name ? player.player.name : "-"}</a>
    `;
  let matchs = "";
  player.matches.map((match) => {
    matchs += `
        <tr>
          <td>${match.awayTeam.name ? match.awayTeam.name : "-"} (${
      match.score.fullTime.awayTeam ? match.score.fullTime.awayTeam : "-"
    })</td>
          <td>${match.homeTeam.name ? match.homeTeam.name : "-"} (${
      match.score.fullTime.homeTeam ? match.score.fullTime.homeTeam : "-"
    })</td>
          <td>${match.competition.name ? match.competition.name : "-"}</td>
          <td>${match.season.startDate ? match.season.startDate : "-"} - ${
      match.season.endDate ? match.season.endDate : "-"
    }</td>
        </tr>
      `;
  });

  let tableMatches = `
    <table class="responsive-table striped">
          <thead>
            <tr>
              <th>Away Team Scores</th>
              <th>Home Team Scores</th>
              <th>Competition</th>
              <th>Seasons</th>
            </tr>
          </thead>
  
          <tbody class="team-detail-table">
            ${matchs}
          </tbody>
        </table>
    `;

  if (player.matches.length < 1) {
    tablePlayer = "";
  }
  return { content, tableMatches };
};

const renderBestScores = (player) => {
  const title = `
    <div>
      <p class="flow-text title">${
        player.competition.name ? player.competition.name : "-"
      }</p>
      <p class="flow-text title">Area: ${
        player.competition.area.name ? player.competition.area.name : "-"
      }</p>
      <p class="flow-text title">Seasons: ${
        player.season.startDate
          ? `${player.season.startDate} / ${player.season.endDate}`
          : "-"
      }</p>
    </div>`;
  let table = ``;
  player.scorers.map((score) => {
    table += `
      <tr>
            <td>${score.player.name ? score.player.name : "-"}</td>
            <td>${score.team.name ? score.team.name : "-"}</td>
            <td>${score.player.position ? score.player.position : "-"}</td>
            <td>${score.numberOfGoals ? score.numberOfGoals : "-"}</td>
            <td><a href="#playerMatches?id=${
              score.player.id
            }"id="playerMatchesLink">Detail Matches</a> & 
            <a href="#specificPlayer?id=${
              score.player.id
            }"id="specificPlayer">Detail Player</a></td>
      </tr>
      `;
  });
  const tableScores = `
    <table class="responsive-table striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Team</th>
              <th>Position</th>
              <th>Goals</th>
              <th>Detail</th>
            </tr>
          </thead>
  
          <tbody class="team-detail-table">
            ${table}
          </tbody>
        </table>
    `;

  return { title, tableScores };
};

const renderSpecificPlayer = (player) => {
  const playerDetail = `
    <ul class="collection with-header">
      <li class="collection-header"><p class="flow-text">${player.name}</p>
      <p>${player.name} was born on ${player.dateOfBirth} in ${
    player.countryOfBirth
  }. He is a professional soccer player from ${player.nationality}. ${
    player.name
  } is also the ${player.position} on his team.</p></li>
      <li class="collection-item">Position: ${player.position}</li>
      <li class="collection-item">Shirt Number: ${
        player.shirtNumber ? player.shirtNumber : "-"
      }</li>
      <li class="collection-item">Birth: ${player.dateOfBirth}</li>
      <li class="collection-item">Nationality: ${player.nationality}</li>
    </ul>
    `;

  return playerDetail;
};

const loadingBar = () => {
  return `    
  <div class="center">
  <div class="progress black">
      <div class="indeterminate white"></div>
    </div>
  </div>
  `;
};

const renderAllFromDb = (data) => {
  let card = ``;
  data.map((result) => {
    card += `
    <div class="col s12 m12">
      <p class="header flow-text">${result.name}</p>
      <div class="card horizontal">
        <div class="card-image">
          <img src="${
            result.crestUrl && replaceUrl(result.crestUrl)
          }" alt="Team Logo" height="150" width="150"/>
        </div>
        <div class="card-stacked">
          <div class="card-content">
            <p>
            ${result.name ? result.name : "-"}
             or simply called 
            ${result.shortName ? result.shortName : "-"}
              is a soccer result based at the 
            ${result.address ? result.address : "-"}
               and venue in the 
            ${result.venue ? result.venue : "-"}.
                Now they are playing at 
            ${
              result.activeCompetitions.name
                ? result.activeCompetitions.name
                : "-"
            },
                 one of the biggest leagues in 
            ${result.area.name ? result.area.name : "-"}.
            </p>
          </div>
          <div class="card-action">
            <a href="#teamDetails?id=${result.id}&isSave=true">View Details</a>
          </div>
        </div>
      </div>
    </div>`;
  });
  return card;
};

const spinnerLoading = () => {
  return `
  <div
    class="preloader-wrapper small active">
    <div class="spinner-layer spinner-green-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div>
      <div class="gap-patch">
        <div class="circle"></div>
      </div>
      <div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>`;
};

const renderError = (msg) => `<p style="text-align=center;">${msg}</p>`

export {
  renderAllFromDb,
  loadingBar,
  renderSpecificPlayer,
  renderBestScores,
  renderPlayerDetails,
  loadTeamSchedule,
  renderTeamDetail,
  renderTable,
  spinnerLoading,
  renderNavCompetitions,
  renderError
};
