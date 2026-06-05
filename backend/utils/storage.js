const fs = require('fs/promises');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

/**
 * Ensures that the data directory exists.
 */
async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

/**
 * Reads and parses a JSON data file. If it doesn't exist, creates it with a default value.
 * @param {string} file Name of the file (e.g. 'expenses.json')
 * @param {any} defaultVal The default structure (e.g. [] or {})
 */
async function readData(file, defaultVal = []) {
  await ensureDir();
  const filePath = path.join(DATA_DIR, file);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeData(file, defaultVal);
      return defaultVal;
    }
    throw err;
  }
}

/**
 * Writes data to a JSON data file atomically.
 * @param {string} file Name of the file (e.g. 'expenses.json')
 * @param {any} data Data to write
 */
async function writeData(file, data) {
  await ensureDir();
  const filePath = path.join(DATA_DIR, file);
  const tempPath = `${filePath}.tmp`;
  try {
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tempPath, filePath);
  } catch (err) {
    // Clean up temp file if possible
    try {
      await fs.unlink(tempPath);
    } catch (_) {}
    throw err;
  }
}

module.exports = {
  readData,
  writeData
};
