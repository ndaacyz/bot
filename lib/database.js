const fs = require('fs-extra');
const path = require('path');
const config = require('../config');
const logger = require('./logger');

const DB_PATH = path.join(__dirname, '..', 'database');
const USERS_FILE = path.join(DB_PATH, 'users.json');
const GROUPS_FILE = path.join(DB_PATH, 'groups.json');
const SETTINGS_FILE = path.join(DB_PATH, 'settings.json');

let users = {};
let groups = {};
let settings = {};

function initDatabase() {
    fs.ensureDirSync(DB_PATH);

    if (!fs.existsSync(USERS_FILE)) {
        fs.writeJsonSync(USERS_FILE, {}, { spaces: 2 });
    }
    if (!fs.existsSync(GROUPS_FILE)) {
        fs.writeJsonSync(GROUPS_FILE, {}, { spaces: 2 });
    }
    if (!fs.existsSync(SETTINGS_FILE)) {
        fs.writeJsonSync(SETTINGS_FILE, {}, { spaces: 2 });
    }

    users = fs.readJsonSync(USERS_FILE);
    groups = fs.readJsonSync(GROUPS_FILE);
    settings = fs.readJsonSync(SETTINGS_FILE);

    logger.success(`Database loaded: ${Object.keys(users).length} users, ${Object.keys(groups).length} groups`);

    // Auto save berkala
    setInterval(() => {
        saveDatabase();
    }, config.autoSaveInterval);

    // Save saat proses exit
    process.on('SIGINT', () => {
        saveDatabase();
        process.exit();
    });
}

function saveDatabase() {
    try {
        fs.writeJsonSync(USERS_FILE, users, { spaces: 2 });
        fs.writeJsonSync(GROUPS_FILE, groups, { spaces: 2 });
        fs.writeJsonSync(SETTINGS_FILE, settings, { spaces: 2 });
    } catch (e) {
        logger.error(`Gagal save database: ${e.message}`);
    }
}

function getUser(id) {
    if (!users[id]) {
        users[id] = { ...config.defaultUser, registeredAt: Date.now() };
    }
    return users[id];
}

function setUser(id, data) {
    users[id] = { ...getUser(id), ...data };
    return users[id];
}

function getGroup(id) {
    if (!groups[id]) {
        groups[id] = { ...config.defaultGroup, createdAt: Date.now() };
    }
    return groups[id];
}

function setGroup(id, data) {
    groups[id] = { ...getGroup(id), ...data };
    return groups[id];
}

function getAllUsers() {
    return users;
}

function getAllGroups() {
    return groups;
}

function getSettings() {
    return settings;
}

function setSettings(data) {
    settings = { ...settings, ...data };
    return settings;
}

module.exports = {
    initDatabase,
    saveDatabase,
    getUser,
    setUser,
    getGroup,
    setGroup,
    getAllUsers,
    getAllGroups,
    getSettings,
    setSettings
};