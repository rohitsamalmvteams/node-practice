// import { createWriteStream } from "fs";

// export const writeInAFile = (fileName, text) => {
//   const writableStream = createWriteStream(fileName);

//   writableStream.write(text);
//   writableStream.end();

//   writableStream.on("finish", () => {
//     console.log("✅ All data has been written.");
//   });

//   writableStream.on("error", (err) => {
//     console.error("❌ An error occurred:", err.message);
//   });
// };

import { createWriteStream } from "fs";
import { mkdirSync } from "fs";
import { dirname } from "path";

export const writeInAFile = (fileName, text) => {
  try {
    // Ensure the directory exists
    const folderPath = dirname(fileName);
    mkdirSync(folderPath, { recursive: true });

    const writableStream = createWriteStream(fileName);

    writableStream.write(text);
    writableStream.end();

    writableStream.on("finish", () => {
      console.log("✅ All data has been written.");
    });

    writableStream.on("error", (err) => {
      console.error("❌ Stream error:", err.message);
    });
  } catch (err) {
    console.error("❌ Directory creation error:", err.message);
  }
};
