const { Worker, isMainThread, parentPort } = require("worker_threads");
let { queue } = require("./shared");

let workerCount = 2;
let workerList = [];

Init();

async function Init() {
  workerList = Array(workerCount)
    .fill(new Worker("./service.js"))
    .map((worker, index) => {
      worker.on("message", (payload) => {
        if (!isMainThread || payload.workerId != index + 1) {
          return;
        }

        console.log("parent:", payload);

        if (queue?.length) {
          let processData = queue.pop();

          worker.postMessage({
            threadId: worker.threadId,
            workerId: index + 1,
            data: processData,
          });
        }
      });
      worker.on("error", (error) => {
        if (!isMainThread) {
          return;
        }

        console.error(error);
      });
      worker.on("exit", (code) => {
        if (!isMainThread) {
          return;
        }

        console.log(code);
      });

      return worker;
    });

  workerList.forEach((worker, index) => {
    if (queue?.length) {
      let processData = queue.shift();

      worker.postMessage({
        threadId: worker.threadId,
        workerId: index + 1,
        data: processData,
      });
    }
  });
}
