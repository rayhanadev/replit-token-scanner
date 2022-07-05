'use strict';

const fs = require('fs');
const ini = require('ini');
const path = require('path');

const format = data => {
  const res = {};
  Object.keys(data).forEach(k => {
    if (~k.indexOf('"')) {
      const arr = k.split('"');
      const mainkey = arr.shift().trim();
      const childkey = arr.shift().trim();

      if (!res[mainkey]) {
        res[mainkey] = {};
      }
      res[mainkey][childkey] = data[k];
    } else {
      res[k] = data[k];
    }
  });
  return res;
};

module.exports = (dir, cb) => {
  let gitDir = process.env.GIT_DIR || dir;
  // makeup .git
  if (!gitDir.endsWith('/.git')) {
    gitDir = path.resolve(gitDir, '.git');
  }
  const filePath = path.resolve(gitDir, 'config');
  const isExisted = fs.existsSync(filePath) && fs.statSync(filePath).isFile();

  if (!isExisted) {
    new Error(`no gitconfig to be found at ${dir}`);
  }
  const content = fs.readFileSync(filePath, 'utf8');

  return format(ini.parse(content));
};
