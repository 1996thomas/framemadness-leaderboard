import "./style.css";
import { teamsData } from "./public/teams.js"; 
import usersChoices from "./utils/donnees_fusionnees.json";
import matchPlayed from "./utils/tournament_progress.json";

document.querySelector("#app").innerHTML = `
<main>
<div class="leaderBoard__wrapper">
  <div class="nav__wrapper">
    <a href=""></a>
    <img src="./Eco.png" height="40px" alt="" />
    <img src="./Krause_House.png" height="40px" alt="" />
  </div>
  <div id="matchWinners">
    <!-- Les vainqueurs des matchs seront affichés ici -->
  </div>
  <h2>Leaderboard</h2>
  <input type="text" id="searchInput" placeholder="Search by user...">
  <div class="leaderboard">
    <p>Leaderboard will start on March 21st</p>
  </div>
</div>
<div class="information__wrapper">
  <div class="presentation__wrapper">
    <h2>
      Experience the thrill <br />
      of frame madness
    </h2>
    A completely in-frame March Madness Brackets experience on Warpcast.
    Play for free, build a dream bracket, win USDC and own the onchain
    proof forever as an NFT minted on Base.
  </div>
  <div class="schedule__wrapper">
  <h2>Upcoming schedule</h2>
  <ul>
    <li>
      <p class="date">17</p>
      <div>
        <p>March 2024</p>
        <p>6pm ET - Submission start</p>
      </div>
    </li>
    <li>
      <p class="date">21</p>
      <div>
        <p>March 2024</p>
        <p>12pm ET - Submission close</p>
      </div>
    </li>
    <li>
      <p class="date">08</p>
      <div>
        <p>April 2024</p>
        <p>9pm ET - Tourney ends</p>
      </div>
    </li>
    <li>
      <p class="date">09</p>
      <div>
        <p>April 2024</p>
        <p>10pm ET - NFTs are dropped with the prizes</p>
      </div>
    </li>
  </ul>
</div>
</div>
</main>
`;

function updateLeaderboard(choixUtilisateurs, matchsJoues) {
  let scores = {};

  choixUtilisateurs.forEach((utilisateur) => {
    const username = utilisateur.userInformation.username;
    const avatar = utilisateur.userInformation.avatar;

    if (!scores[username]) {
      scores[username] = { score: 0, username, avatar, ucs: utilisateur.ucs };
    }

    utilisateur.ucs.forEach((choix) => {
      const matchJoue = matchsJoues.find(
        (matchJoue) => matchJoue.m === choix.m
      );
      if (matchJoue && choix.w === matchJoue.w) {
        scores[username].score += calculateScore(choix.m);
      }
    });
  });

  let leaderboard = Object.values(scores).sort((a, b) => b.score - a.score);

  const leaderboardElement = document.querySelector(".leaderboard");
  leaderboardElement.innerHTML = `
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Username</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        ${leaderboard
          .map(
            (user, index) => `
            <tr class="userRow" id="userRow-${index}" style="cursor: pointer;">
              <td class="avatar"><img src="${user.avatar}" alt="Avatar"></td>
              <td class="username">${user.username}</td>
              <td class="score">${user.score}</td>
            </tr>
            <tr id="dropdown-${index}" class="dropdownContent" style="display: none;">
              <td colspan="3">
                <select id="roundSelect-${index}" class="roundSelect">
                <option value="">Choose a round</option>
                <option value="1">Round 1</option>
                <option value="2">Round 2</option>
                <option value="3">Sweet 16</option>
                <option value="4">Elite 8</option>
                <option value="5">Final Four</option>
                <option value="6">Finale</option>
                <option value="all">See All</option>
                </select>
                <div id="userChoices-${index}"></div>
              </td>
            </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

  attachEventListeners(leaderboard, matchsJoues);
  attachRoundSelectListeners(leaderboard, matchsJoues);
  attachSearchInputListener(leaderboard);
}

function calculateScore(matchId) {
  if (matchId >= 63) return 320; // Final
  else if (matchId >= 61) return 160; // Final Four
  else if (matchId >= 57) return 80; // Elite 8
  else if (matchId >= 49) return 40; // Sweet 16
  else if (matchId >= 33) return 20; // Round 2
  else return 10; // Round 1
}

function attachEventListeners(leaderboard, matchsJoues) {
  document.querySelectorAll(".userRow").forEach((row, index) => {
    row.addEventListener("click", () => {
      const dropdown = document.getElementById(`dropdown-${index}`);
      dropdown.style.display =
        dropdown.style.display === "none" ? "table-row" : "none";
    });
  });
}

function attachRoundSelectListeners(leaderboard, matchsJoues) {
  document.querySelectorAll(".roundSelect").forEach((selectElement, index) => {
    selectElement.addEventListener("change", () => {
      const round = selectElement.value;
      updateChoicesDisplay(index, round, leaderboard, matchsJoues);
    });
  });
}

function attachSearchInputListener(leaderboard) {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const usernames = leaderboard.map((user) => user.username.toLowerCase());
    document.querySelectorAll(".userRow").forEach((row, index) => {
      if (!usernames[index].includes(searchTerm)) {
        row.style.display = "none";
        const dropdown = document.getElementById(`dropdown-${index}`);
        dropdown.style.display = "none";
      } else {
        row.style.display = "table-row";
      }
    });
  });
}

function updateChoicesDisplay(
  userIndex,
  selectedRound,
  leaderboard,
  matchsJoues
) {
  const userChoicesElement = document.getElementById(
    `userChoices-${userIndex}`
  );
  const user = leaderboard[userIndex];

  const filteredChoices = user.ucs.filter((choice) => {
    const matchRound = determineRound(choice.m);
    return selectedRound === "all" || matchRound === parseInt(selectedRound);
  });

  userChoicesElement.innerHTML = filteredChoices
    .map((u) => {
      const matchResult = matchsJoues.find((m) => m.m === u.m);
      const team = teamsData[u.w] || {};
      const teamLogo = team.logo || "";
      const teamName = team.name || "Team not found";
      const borderColor = matchResult
        ? matchResult.w === u.w
          ? "#98FB98"
          : "#B22222"
        : "lightGray";
      return `<div style="border: 2px solid ${borderColor}; border-radius: 50%; display: inline-block; padding: 5px; margin: 5px;">
              <img src="${teamLogo}" height="40" width="40" alt="${teamName} logo"> 
           </div>`;
    })
    .join("");
}

function determineRound(matchId) {
  if (matchId >= 63) return 6;
  else if (matchId >= 61) return 5;
  else if (matchId >= 57) return 4;
  else if (matchId >= 49) return 3;
  else if (matchId >= 33) return 2;
  else return 1;
}

updateLeaderboard(usersChoices, matchPlayed);
