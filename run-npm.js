const { execFileSync } = require("child_process");
const npmCli = require("path").join(
  "D:", "软件类", "claudecode", "nodejs", "node_modules", "npm", "bin", "npm-cli.js"
);
process.env.npm_config_cache = "C:\\temp\\npm-cache";
try {
  execFileSync(process.execPath, [npmCli, ...process.argv.slice(2)], {
    cwd: process.cwd(),
    stdio: "inherit",
    env: process.env,
  });
} catch (e) {
  process.exit(e.status || 1);
}
