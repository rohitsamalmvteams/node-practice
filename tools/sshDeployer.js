// tools/sshDeployer.js
import { runCommand } from "../utils/runCommand.js";

export function deployViaSSH(user, host, remoteCommand) {
  const sshCommand = `${user}@${host}`;
  runCommand("ssh", [sshCommand, remoteCommand]);
}
