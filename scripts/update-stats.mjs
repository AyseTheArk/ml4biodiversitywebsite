import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const clean = value =>
  String(value ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();

const normalize = value => clean(value).toLowerCase();

// Reads CSV fields, including quoted commas and line breaks.
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      row.push(field);
      field = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      if (row.some(value => value.trim())) rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (quoted) throw Error('Unclosed quote in CSV.');
  row.push(field);
  if (row.some(value => value.trim())) rows.push(row);

  return rows;
}

const csvPath = process.argv[2];
if (!csvPath) {
  throw Error('Provide the CSV path after the script name.');
}

const bytes = await readFile(csvPath);
let text;

try {
  text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
} catch {
  text = new TextDecoder('windows-1252').decode(bytes);
}

const rows = parseCSV(text.replace(/^\uFEFF/, ''));
const headers = rows.shift()?.map(clean) ?? [];

for (const name of ['Zoo', 'Aviary', 'Scientific name', 'Total count']) {
  if (headers.filter(header => header === name).length !== 1) {
    throw Error(`Expected one column named "${name}".`);
  }
}

const zoos = new Set();
const species = new Set();
const inventories = new Map();

for (const [index, values] of rows.entries()) {
  const record = Object.fromEntries(
    headers.map((header, i) => [header, clean(values[i])])
  );

  if (!record.Aviary) continue;

  const zoo = normalize(record.Zoo);
  const scientificName = normalize(record['Scientific name']);
  const countText = record['Total count'];

  if (!zoo || !scientificName || !/^\d+$/.test(countText)) {
    throw Error(`Check Zoo, Scientific name and Total count near row ${index + 2}.`);
  }

  const count = Number(countText);
  if (!Number.isSafeInteger(count)) {
    throw Error(`Invalid count near row ${index + 2}.`);
  }

  zoos.add(zoo);
  species.add(scientificName);

  // "GaiaZoo Taiga 2025" and "... 2026" are the same aviary.
  const year = record.Aviary.match(/\s+(20\d{2})$/)?.[1] ?? 'undated';
  const aviary = normalize(record.Aviary.replace(/\s+20\d{2}$/, ''));
  const id = JSON.stringify([zoo, aviary]);

  if (!inventories.has(id)) inventories.set(id, new Map());

  const years = inventories.get(id);
  years.set(year, (years.get(year) ?? 0) + count);
}

if (!zoos.size) throw Error('No inventory data found.');

let individuals = 0;

for (const years of inventories.values()) {
  if (years.size > 1 && years.has('undated')) {
    throw Error('An aviary has both dated and undated inventories. Check its names.');
  }

  const latest = [...years.keys()].sort().at(-1);
  individuals += years.get(latest);
}

const statsPath = fileURLToPath(
  new URL('../content/stats.json', import.meta.url)
);

const stats = JSON.parse(await readFile(statsPath, 'utf8'));

stats.zoos = zoos.size;
stats.individuals = individuals;

// Preserve species and hours until their outstanding checks are complete.
await writeFile(statsPath, JSON.stringify(stats, null, 2) + '\n');

console.log(`Updated: ${stats.zoos} zoos, ${stats.individuals} individuals.`);
console.log(`${species.size} distinct scientific names found.`);
console.log(`Published species count remains ${stats.species} pending name review.`);