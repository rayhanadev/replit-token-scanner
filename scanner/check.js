import minimist from 'minimist';
import { Crosis } from 'crosis4furrets';

import { ignore, tokenMatchers } from './utils.js';

const { REPLIT_ID } = minimist(process.argv.slice(2));
const { REPLIT_TOKEN } = process.env;

const client = new Crosis({
	ignore,
	token: REPLIT_TOKEN,
	replId: REPLIT_ID,
});

await client.connect();
const files = await client.recursedir('.');

const completion = [];

for (let i = 0; i < files.length; i++) {
	const testPromise = async () => {
		const path = files[i];
		const file = await client.read(path, 'utf8');

		const doesMatch = tokenMatchers.some((matcher) => {
			return matcher.test(file);
		});

		if (doesMatch) return true;
		else return true;
	};

	completion.push(testPromise());
}

const checkedFiles = await Promise.all(completion);
if (checkedFiles.includes(false)) process.exit(1);

process.exit(0);
