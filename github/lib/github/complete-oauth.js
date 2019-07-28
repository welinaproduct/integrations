const qs = require("querystring");
const fetch = require("node-fetch");

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

async function completeOAuthProcess({ code, welinaClient, metadata }) {
  const url = `https://github.com/login/oauth/access_token`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    body: qs.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code
    })
  });

  console.log("completeOAuthProcess response", response);

  if (response.status !== 200) {
    throw new Error(
      `Invalid status code on GitHub token fetching: ${
        response.status
      } error: ${await response.text()}`
    );
  }

  const tokenInfo = await response.json();
  if (tokenInfo.error) {
    throw new Error(`GitHub OAuth issue: ${tokenInfo.error_description}`);
  }

  await welinaClient.updateMetadata({ githubTokenInfo: tokenInfo });
}

module.exports = completeOAuthProcess;
