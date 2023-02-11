const { isMainThread, parentPort } = require("worker_threads");
const { runTask } = require("./shared");

parentPort.on("message", async (payload) => {
  if (isMainThread) {
    return;
  }

  console.log("child", payload);

  await runTask(payload.data);
  // Call async function

  parentPort.postMessage({
    ...payload,
    data: "Child executed:" + payload.data,
  });
});
