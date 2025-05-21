// index.js
import { spawn } from "node:child_process";
import { runCommand, runCommandAsync } from "./utils/runCommand.js";

import { commitAndPush } from "./tools/gitHelper.js";
import { deployViaSSH } from "./tools/sshDeployer.js";
import { publishPackage } from "./tools/npmPublisher.js";
import { startWatcher } from "./tools/buildWatcher.js";

const ls = spawn("ls", ["-lh", "/usr"]);

ls.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

ls.on("close", (code) => {
  console.info(`child process exited with code ${code}`);
});

console.log("Running test...");

(async () => {
  try {
    runCommand("npm", ["test"]);
    await runCommandAsync("ls", ["-a"]);
  } catch (err) {
    console.log(err);
  }
})();


const task = process.argv[2];

switch (task) {
  case "git":
    commitAndPush(process.argv[3] || "chore: auto commit");
    break;
  case "deploy":
    deployViaSSH("ubuntu", "your-server.com", "cd /app && git pull && npm install");
    break;
  case "publish":
    publishPackage();
    break;
  case "watch":
    startWatcher();
    break;
  default:
    console.log("Available commands: git, deploy, publish, watch");
}
