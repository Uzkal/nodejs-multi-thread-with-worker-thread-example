let queue = [1, 2, 3, 4];

async function runTask(params) {
  await new Promise((resolve) =>
    setTimeout(resolve, randomIntFromInterval(100, 3000))
  );

  console.log("runTask:", params);
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
  queue,
  runTask,
};
