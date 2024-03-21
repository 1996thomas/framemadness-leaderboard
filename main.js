import "./style.css";
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
  <h2>Leaderboard</h2>
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
      scores[username] = { score: 0, username, avatar };
    }
    utilisateur.ucs.forEach((choix) => {
      const matchJoue = matchsJoues.find(
        (matchJoue) => matchJoue.m === choix.m
      );
      if (matchJoue && choix.w === matchJoue.w) {
        const matchId = choix.m;
        if (matchId < 32) {
          scores[username].score += 10;
        } else if (matchId < 48) {
          scores[username].score += 20;
        } else if (matchId < 56) {
          scores[username].score += 40;
        } else if (matchId < 60) {
          scores[username].score += 80;
        } else if (matchId < 62) {
          scores[username].score += 160;
        } else if (matchId === 62) {
          scores[username].score += 320;
        }
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
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${leaderboard
          .map(
            (user) => `
              <tr class="userRow">
                <td class="avatar">
                  <a href="https://warpcast.com/${user.username}">
                    <img src="${user.avatar}" alt="Avatar"/>
                  </a>
                </td>
                <td class="username">${user.username}</td>
                <td class="score">${user.score}</td>
              </tr>
          `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

const choixUtilisateurs = usersChoices;
const matchsJoues = matchPlayed;
updateLeaderboard(choixUtilisateurs, matchsJoues);
