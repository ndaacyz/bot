const fs = require('fs');
const path = require('path');
const logger = require('./logger');

function loadCommands(dir = path.join(__dirname, '..', 'commands'), commands = new Map()) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            loadCommands(fullPath, commands);
        } else if (file.endsWith('.js')) {
            try {
                delete require.cache[require.resolve(fullPath)];
                const command = require(fullPath);

                if (command.name) {
                    commands.set(command.name, command);
                    if (Array.isArray(command.alias)) {
                        for (const alias of command.alias) {
                            commands.set(alias, command);
                        }
                    }
                }
            } catch (e) {
                logger.error(`Gagal load command ${file}: ${e.message}`);
            }
        }
    }

    return commands;
}

function getUniqueCommands(commands) {
    const unique = new Map();
    for (const [key, cmd] of commands) {
        if (cmd.name === key) {
            unique.set(key, cmd);
        }
    }
    return unique;
}

module.exports = { loadCommands, getUniqueCommands };