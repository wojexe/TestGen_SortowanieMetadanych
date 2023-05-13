// Generator testow do zadania 07_SortowanieMetadanych

const OUTPUT_DIR = "./tests";
const TEST_COUNT = 3;

const maxRows = 1e5;
const maxColumns = 15;
const numberMagn = 1e4;

const FILE_ENCODING = "ascii";

import words from "random-words"; // bad types
import { nanoid } from "nanoid";
import * as fs from "fs/promises";
import path from "path";

async function saveToFile(data: string) {
  let filepath: string;

  try {
    await fs.access(OUTPUT_DIR);
  } catch (e) {
    // Try to create that directory if it's not accessible
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  }

  filepath = path.join(OUTPUT_DIR, nanoid(8) + ".in");

  const handle = await fs.open(filepath, "w");
  await handle.writeFile(data, { encoding: FILE_ENCODING });
}

function generate(testCount: number) {
  let test = "";

  test += testCount + "\n";

  while (testCount-- > 0) {
    const columnCount = 3 + Math.floor(Math.random() * (maxColumns - 2));

    const rowCount = 1 + Math.floor(Math.random() * (maxRows - 1));
    const colSortBy = columnCount - Math.floor(Math.random() * columnCount);
    const isDescending = Math.random() < 0.5;

    test += `${rowCount},${colSortBy},${isDescending ? "-1" : "1"}\n`;

    // @ts-ignore
    test += words(columnCount).join(",") + "\n";

    let isInteger = Array.from(
      { length: columnCount },
      (_) => Math.random() < 0.5
    );

    test += Array.from({ length: rowCount }, (_) =>
      Array(...isInteger)
        .map((isInt) =>
          // @ts-ignore
          isInt ? Math.floor(Math.random() * numberMagn) : words(1)[0]
        )
        .join(",")
    ).join("\n");

    test += "\n";
  }

  return test;
}

const tests = generate(TEST_COUNT);

saveToFile(tests);
