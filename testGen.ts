// Generator testow do zadania 07_SortowanieMetadanych

const OUTPUT_DIR = "./tests";
const TEST_COUNT = 3;

const maxRows = 1e5;
const maxColumns = 15;
const numberMagn = 1e4;

const FILE_ENCODING = "ascii";

import * as fs from "fs/promises";
import path from "path";

import words from "random-words"; // has wrong types
import { nanoid } from "nanoid";

type Test = {
  meta: number[];
  headers: string[];
  rows: Array<Array<string | number>>;
  sorted: Array<Array<string | number>>;
};

type Data = {
  input: string;
  output: string;
};

async function saveToFile(data: Data) {
  try {
    await fs.access(OUTPUT_DIR);
  } catch (e) {
    // Try to create that directory if it's not accessible
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  }

  const testID = nanoid(8);

  const paths = {
    in: path.join(OUTPUT_DIR, testID + ".in"),
    out: path.join(OUTPUT_DIR, testID + ".out"),
  };

  const handles = {
    in: await fs.open(paths.in, "w"),
    out: await fs.open(paths.out, "w"),
  };

  console.log(`Generated test:\n  IN: ${paths.in}\n OUT: ${paths.out}`);

  await handles.in.writeFile(data.input, { encoding: FILE_ENCODING });
  await handles.out.writeFile(data.output, { encoding: FILE_ENCODING });
}

function generate(testCount: number): { input: string; output: string } {
  const tests: Test[] = [];

  while (testCount-- > 0) {
    const columnCount = 3 + Math.floor(Math.random() * (maxColumns - 2));

    const rowCount = 1 + Math.floor(Math.random() * (maxRows - 1));
    const colSortBy = columnCount - Math.floor(Math.random() * columnCount);
    const isDescending = Math.random() < 0.5;

    const meta = [rowCount, colSortBy, isDescending ? -1 : 1];

    // @ts-ignore
    const headers: string[] = words(columnCount);

    const isInteger: boolean[] = Array.from(
      { length: columnCount },
      (_) => Math.random() < 0.5
    );

    const rows: Test["rows"] = Array.from({ length: rowCount }, (_) =>
      isInteger.map((bool) =>
        // @ts-ignore
        bool ? Math.floor(Math.random() * numberMagn) : words(1)[0]
      )
    );

    // Generate the answer
    let sorted: Test["sorted"] = [...rows];

    const index = colSortBy - 1;

    if (isInteger[index]) {
      if (isDescending)
        (sorted as number[][]).sort((rowA, rowB) => rowB[index] - rowA[index]);
      else
        (sorted as number[][]).sort((rowA, rowB) => rowA[index] - rowB[index]);
    } else {
      if (isDescending)
        (sorted as string[][]).sort((rowA, rowB) =>
          rowB[index].localeCompare(rowA[index])
        );
      else
        (sorted as string[][]).sort((rowA, rowB) =>
          rowA[index].localeCompare(rowB[index])
        );
    }

    sorted.unshift([...headers]);

    if (index !== 0) {
      for (let row of sorted) {
        for (let i = index - 1; i >= 0; i--) {
          const tmp = row[i + 1];
          row[i + 1] = row[i];
          row[i] = tmp;
        }
      }
    }

    tests.push({ meta, headers, rows, sorted });
  }

  let input = tests.length + "\n";
  let output = "";

  for (let test of tests) {
    input += test.meta.join(",") + "\n";
    input += test.headers.join(",") + "\n";
    input += test.rows.map((row) => row.join(",")).join("\n");

    output += test.sorted.map((row) => row.join(",")).join("\n");

    input += "\n";
    output += "\n\n";
  }

  return { input, output };
}

const test = generate(TEST_COUNT);

saveToFile(test);
