import * as express from 'express';
import fetch from 'node-fetch';
import * as redis from 'redis';

const port = process.env.PORT || 5000;
const redisPort = Number(process.env.REDIS_PORT) || 6379;

const client = redis.createClient({
  port: redisPort,
});

const app = express();

const fetchReposCount: express.Handler = function(req, res, next) {
  const {
    params: { username },
  } = req;

  console.log('fetching repos count for', username);
  fetch(`https://api.github.com/users/${username}`)
    .then(res => res.json())
    .then(
      ({ public_repos }) =>
        `<div>Public repos for <i>${username}</i>: <strong>${public_repos}</strong></div>`,
    )
    .then(repos => res.send(repos))
    .catch(console.error);
};

app.get('/repos/:username', fetchReposCount);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
