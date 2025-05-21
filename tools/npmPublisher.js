// tools/npmPublisher.js
import { runCommand } from "../utils/runCommand.js";

export function publishPackage() {
  console.log("🚀 Publishing to NPM...");
  runCommand("npm", ["publish"]);
}
