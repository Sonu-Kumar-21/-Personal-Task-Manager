const fs = require('fs').promises;
const path = require('path');

const dataFile = path.join(__dirname, 'tasks.json');

// Ensure the file exists
async function initStore() {
    try {
        await fs.access(dataFile);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(dataFile, JSON.stringify([]));
        }
    }
}

initStore();

async function getTasks() {
    try {
        const data = await fs.readFile(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveTasks(tasks) {
    await fs.writeFile(dataFile, JSON.stringify(tasks, null, 2));
}

module.exports = {
    getTasks,
    saveTasks
};
