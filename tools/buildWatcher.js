// tools/buildWatcher.js
import { spawn } from "node:child_process";
import { startLiveReloadServer } from "./liveReloadServer.js";

let serverProcess = null;
const liveReload = startLiveReloadServer();

const startServer = () => {
  if (serverProcess) {
    console.log("Restarting server...");
    serverProcess.kill();
  }

  serverProcess = spawn("node", ["dist/server.js"], {
    stdio: "inherit",
  });

  serverProcess.on("close", (code) => {
    console.log(`Server exited with the code ${code}`);
    serverProcess = null;
  });

  liveReload.broadcast("reload");
};
export function startWatcher() {
  console.log("👀 Watching files...");

  const watcher = spawn("nodemon", ["--exec", "npm", "run", "build"], {
    stdio: ["inherit", "pipe", "pipe"],
  });

  watcher.stdout.on("data", (data) => {
    process.stdout.write(`[build] ${data}`);
    const output = data.toString();
    if (output.includes("build") || output.includes("Build Complete")) {
      startServer();
    }
  });

  watcher.stderr.on("data", (data) => {
    process.stderr.write(`[build-error] ${data}`);
  });

  watcher.on("close", (code) => {
    console.log(`Build watcher exited with code ${code}`);
    if (serverProcess) serverProcess.kill();
    liveReload.close();
  });
}
