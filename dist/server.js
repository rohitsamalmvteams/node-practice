import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3001;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log('__dirname: ', __dirname);
const frontendPath = path.join(__dirname, "frontend");
console.log('frontendPath: ', frontendPath);

app.use(express.static(frontendPath));

app.listen(PORT, () => {
  console.log(`Frontend server as http://localhost:${PORT}`);
});
