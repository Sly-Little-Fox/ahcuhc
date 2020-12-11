#!/usr/bin/node

// * Ahcuhc

process.on('uncaughtException', function (error) {
  errors.push(error.stack);
});

var errors = [];
var chuchas = [];

const system = require('child_process');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
// ^^ Chucha test file ^^
const SUM = 'c9ab0ba1d92e2f755301ef975c0990fcdb321805';

function log(text) {
  system.execSync(`echo "${text}" >> /tmp/ahcuhc.log`);
}

function read(dir) {
  try {
    fs.readdirSync(dir).forEach(function (fileordir) {
      if (fs.lstatSync(path.join(dir, fileordir)).isDirectory()) {
        try {
          read(path.join(dir, fileordir));
        } catch (error) {
          console.warn(error);
        }
      } else {
        if (fs.statSync(path.join(dir, fileordir)).size === 23) {
          var hash = crypto.createHash('sha1').update(fs.readFileSync(path.join(dir, fileordir))).digest('hex');
          if (hash === SUM) {
            chuchas.push(path.join(dir, fileordir));
          }
        }
      }
    });
  } catch (error) {
    errors.push(error);
  }

  try {
    read(__dirname);
  } catch (error) {
    errors.push(error);
  }
}

if (chuchas == 0) {
  system.execSync(`notify-send --icon="/path/to/icon" "No chuchas found! Good for you!"`);
} else {
  try {
    try {
      system.execSync(`mkdir /var/tmp/ahcuhc_temp/`);
    } catch (error) {
      log(error);
    }
    system.execSync(`rm -f ${path.join(__dirname, 'quarantine.tar')}`);
    log('Removed old quarantine!');
    system.execSync(`rm -f /tmp/ahcuhc.log`);
    log('Removed old log!');
    for (let i = 0; i < chuchas.length; i++) {
      system.execSync(`mv ${chuchas[i]} /var/tmp/ahcuhc_temp/chucha-${i}.ahcuhc`);
    }

    try {
      system.execSync(`cd /var/tmp/ahcuhc_temp/ && tar -cf "${path.join(__dirname, 'quarantine.tar')}" * && rm -rf "/var/tmp/ahcuhc_temp/"`);
    } catch (error) {
      log(error);
      errors.push(error);
    }
    log('Quarantined chuchas!');
    system.execSync(`notify-send --icon="/path/to/icon" "Quarantine file with ${chuchas.length} chucha(s) created in ${__dirname}!"`);
  } catch (error) {
    errors.push(error);
  }

}

console.warn(`Errors: ${errors}`);
