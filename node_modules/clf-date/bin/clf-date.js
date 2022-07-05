#!/usr/bin/env node

const clfDate = require('../src/main.js');

const { argv } = process.argv;

if (argv.length > 2) {
	console.log(clfDate(new Date(Date.parse(argv[2]))));
} else {
	console.log(clfDate());
}
