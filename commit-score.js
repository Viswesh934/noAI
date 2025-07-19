const axios = require("axios");
const fs = require("fs");

const owner = "Viswesh934";
const repo = "noAI";
const readmeFile = "README.md";

const githubToken = process.env.GITHUB_TOKEN;

async function updateScores() {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/stats/contributors`,
      {
        headers: {
          Authorization: `token ${githubToken}`,
          "User-Agent": "commit-score-script",
        },
      }
    );

    const contributors = response.data;

    if (!Array.isArray(contributors)) {
      console.error("Unexpected response format or stats not ready yet.");
      return;
    }

    const filtered = contributors
      .filter((c) => c.author?.login !== "github-actions[bot]")
      .sort((a, b) => b.total - a.total);

    const leaderboard = `
<!-- commit scores -->

<table>
  <thead>
    <tr>
      <th align="left">🏅 Rank</th>
      <th align="left">👤 Contributor</th>
      <th align="left">📈 Commits</th>
    </tr>
  </thead>
  <tbody>
    ${filtered
      .map((contributor, index) => {
        const username = contributor.author.login;
        const commits = contributor.total;
        const medal =
          index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";
        return `
    <tr>
      <td>${index + 1} ${medal}</td>
      <td><a href="https://github.com/${username}">@${username}</a></td>
      <td>${commits}</td>
    </tr>`;
      })
      .join("")}
  </tbody>
</table>

<!-- /commit scores -->
    `.trim();

    const readmeContent = fs.readFileSync(readmeFile, "utf8");
    const updatedReadmeContent = readmeContent.replace(
      /<!-- commit scores -->[\s\S]*?<!-- \/commit scores -->/,
      leaderboard
    );

    fs.writeFileSync(readmeFile, updatedReadmeContent);
    console.log("README updated with commit leaderboard.");
  } catch (error) {
    console.error("Error fetching commit stats:", error.message);
  }
}

updateScores();
