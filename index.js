// Core & internal utilities
import { spawn } from "node:child_process";
import cors from "cors";

// External tools & helpers
import { runCommand, runCommandAsync } from "./utils/runCommand.js";
import { commitAndPush } from "./tools/gitHelper.js";
import { deployViaSSH } from "./tools/sshDeployer.js";
import { publishPackage } from "./tools/npmPublisher.js";
import { startWatcher } from "./tools/buildWatcher.js";
import { client } from "./db/postgresClient.js";
import { writeInAFile } from "./tools/writeInFile.js";

// Express server
import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(cors());
// ========== ✨ Express API ==========
app.post("/write", (req, res) => {
  const { fileName, text } = req.body;
  if (!fileName || !text) {
    return res.status(400).json({ error: "Missing fileName or text" });
  }

  writeInAFile(fileName, text);
  res.status(200).json({ message: "✅ Written to file" });
});

app.listen(PORT, () => {
  console.log(`🚀 Express server listening at http://localhost:${PORT}`);
});

// ========== 🐚 Child Process Example ==========
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

// ========== 🧪 Utility Command Execution ==========
console.log("Running test commands...");

(async () => {
  try {
    runCommand("npm", ["test"]); // not awaited on purpose
    await runCommandAsync("ls", ["-a"]);
  } catch (err) {
    console.error("❌ Command error:", err);
  }
})();

// ========== 📦 CLI Task Runner ==========
const task = process.argv[2];
console.log('task: ', task);

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

// ========== 🛠️ PostgreSQL Setup ==========
async function setupPostgres() {
  try {
    await client.query(`CREATE SCHEMA IF NOT EXISTS analytics;`);

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS analytics.users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createTableQuery);
    console.log('✅ Table "analytics.users" created successfully');
  } catch (err) {
    console.error("❌ PostgreSQL error:", err);
  } finally {
    await client.end();
  }
}

// setupPostgres();
