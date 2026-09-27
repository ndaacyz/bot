const pino = require('pino');
const chalk = require('chalk');

const logger = pino({
    level: 'silent' // silent untuk baileys internal log, kita pakai custom log dibawah
});

function info(message) {
    console.log(chalk.blue(`[INFO] ${new Date().toLocaleTimeString()} - ${message}`));
}

function success(message) {
    console.log(chalk.green(`[SUCCESS] ${new Date().toLocaleTimeString()} - ${message}`));
}

function warning(message) {
    console.log(chalk.yellow(`[WARNING] ${new Date().toLocaleTimeString()} - ${message}`));
}

function error(message) {
    console.log(chalk.red(`[ERROR] ${new Date().toLocaleTimeString()} - ${message}`));
}

function command(sender, cmd) {
    console.log(chalk.magenta(`[COMMAND] ${sender} menjalankan: ${cmd}`));
}

module.exports = { logger, info, success, warning, error, command };