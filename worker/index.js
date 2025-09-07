const { createClient } = require('redis');
const keys = require('./keys');

const client = createClient({
  url: `redis://${keys.redisHost}:${keys.redisPort}`,
});

const fib = (index) => {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
};

(async () => {
  await client.connect();

  const sub = client.duplicate();
  await sub.connect();

  // Subscribe to the "insert" channel
  await sub.subscribe('insert', async (message) => {
    await client.hSet('values', message, fib(parseInt(message)));
  });
})();
