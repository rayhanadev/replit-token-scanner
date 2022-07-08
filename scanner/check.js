import minimist from 'minimist';
import { Crosis } from 'crosis4furrets';

import { ignore, tokenMatchers, errorLog } from './utils.js';

const { REPLIT_ID } = minimist(process.argv.slice(2));
const { REPLIT_TOKEN } = process.env;

let client;
let files = [];

try {
	client = new Crosis({
		ignore,
		token: REPLIT_TOKEN,
		replId: REPLIT_ID,
	});

	await client.connect();
	files = await client.recursedir('.');
} catch (error) {
	errorLog(error);
	process.exit(1);
}

const completion = [];

for (let i = 0; i < files.length; i++) {
	const testPromise = async () => {
		try {
			const path = files[i];
			const file = await client.read(path, 'utf8');

			let type = '';
			let token = '';

			const matchers = Object.values(tokenMatchers);
			const doesMatch = matchers.some((matcher) => {
				const test = matcher.exec(file);
				if (test !== null) {
					type = Object.keys(tokenMatchers).find(
						(key) => tokenMatchers[key] === matcher,
					);
					token = test[0];

					return true;
				}
				return false;
			});

			if (doesMatch) return { type, path, token };
			else return false;
		} catch (error) {
			errorLog(error);
		}
	};

	completion.push(testPromise());
}

const checkedFiles = await Promise.all(completion);

const uniqueTokens = [];
const tokens = checkedFiles.filter((file) => {
	if (file === false) return false;

	if (file.token && !uniqueTokens.includes(file.token)) {
		uniqueTokens.push(file.token);
		return true;
	}

	return false;
});

if (tokens.length > 0) {
	tokens.forEach((info) => process.send(JSON.stringify(info)));
}

process.exit(0);
