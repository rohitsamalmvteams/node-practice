// utils/runCommand.js
import { spawn } from "node:child_process";

/**
 * @param {string} command - The base command (e.g./ "ls", "npm")
 * @param {string[]} args - Command arguments
 * @param {object} [options] - Additional arguments like cwd
 */
export const runCommand = (command, args = [], options = {}) => {
    const child = spawn(command, args, {
        stdio: "pipe", // default: gives us access to stdout/stderr
        ...options,
    })

    child.stdout.on("data", (data) => {
        process.stdout.write(`[stdout] ${data}`);
    })

    child.stderr.on("data", (data) => {
        process.stderr.write(`[stderr] ${data}`);
    })

    child.on("close", (code) => {
        console.info(`\n[info] "${command}" exited with code ${code}\n`);
    })

    return child;
}

export const runCommandAsync = (command, args = [], options = {}) => {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {stdio: 'pipe', ...options});
        
        child.stdout.on('data', (data) => process.stdout.write(`[stdout] ${data}`));
        child.stderr.on('data', (data) => process.stderr.write(`[stderr] ${data}`));

        child.on('close', (code) => {
            if(code === 0) resolve(code);
            else reject(new Error(`Command exited with code ${code}`));
        })
    })
}