// Generator testow do zadania 07_SortowanieMetadanych

const OUTPUT_FILE_PATH = "";
const TEST_COUNT = 3;

const maxRows = 10e5;
const maxColumns = 15;
const numberMagn = 10e4;

const FILE_ENCODING = "ascii";

import randomWords from "random-words";
import short from "short-uuid";
import * as fs from "fs/promises";

async function saveToFile(data) {
  let path = OUTPUT_FILE_PATH;

  if (path === "") {
    // If directory "./tests" does not exist, create one
    await fs.access("./tests").catch(async () => await fs.mkdir("tests"));

    path = "./tests/" + short().new() + ".in";
  }

  const handle = await fs
    .open(path, "w")
    .catch((e) => console.error(`error ${e}`));

  await handle
    .writeFile(data, { encoding: FILE_ENCODING })
    .catch((e) => console.error(`errror ${e}`));
}

function generate(testCount) {
  let test = "";

  test += testCount + "\n";

  while (testCount-- > 0) {
    const columnCount = 3 + Math.floor(Math.random() * (maxColumns - 2));

    const rowCount = 1 + Math.floor(Math.random() * (maxRows - 1));
    const colSortBy = columnCount - Math.floor(Math.random() * columnCount);
    const isDescending = Math.random() < 0.5;

    test += `${rowCount},${colSortBy},${isDescending ? "-1" : "1"}\n`;

    test += randomWords(columnCount).join(",") + "\n";

    let isInteger = Array.from(
      { length: columnCount },
      (_) => Math.random() < 0.5
    );

    test += Array.from({ length: rowCount }, (_) =>
      Array(...isInteger)
        .map((isInt) =>
          isInt ? Math.floor(Math.random() * numberMagn) : randomWords()
        )
        .join(",")
    ).join("\n");

    test += "\n";
  }

  return test;
}

const tests = generate(TEST_COUNT);

saveToFile(tests);
