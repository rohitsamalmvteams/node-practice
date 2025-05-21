// tools/gitHelper.js
import {runCommand} from  "../utils/runCommand.js";

export const commitAndPush = (message = "chore: automated commit") => {
    runCommand("git", ["add", "."]);
    runCommand("git", ["commit", "-m", message]);
    runCommand("git", ["push"]);
}
