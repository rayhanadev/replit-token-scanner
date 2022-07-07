import process from 'node:process';
import { spawn } from 'node:child_process';
import chalk from 'chalk';
import boxen from 'boxen';

import GraphQL from '../utils.js';

const TASK_START_TIME = new Date();
const { REPLIT_TOKEN, } = process.env;
const gql = new GraphQL(REPLIT_TOKEN);

const { replPosts } = await gql.request('RECENTLY_PUBLISHED_REPLS', {
	options: {
		order: 'New',
		count: 10,
	},
});

const { items } = replPosts;

const completion = [];

for (let i = 0; i < items.length; i++) {
	const { repl } = items[i];
	if (!repl) continue;

	const childPromise = await new Promise((res) => {
		const START_TIME = new Date();

		// TODO: sanitize the value
		const node = spawn('node', [
			'scanner/check.js',
			`--REPLIT_ID=${repl.id}`,
		]);

		node.stdout.on('data', (data) => {
			const message = Buffer.from(data).toString('utf8');
			console.log(message);
		});

		node.stderr.on('data', (data) => {
			const message = Buffer.from(data).toString('utf8');
			console.log(message);
		});

		node.on('close', (code) => {
			const END_TIME = new Date();
			const elapsed = Math.abs(
				(END_TIME.getTime() - START_TIME.getTime()) / 1000,
			);

			const data = { elapsed, ...repl };

			if (code === 0) res({ pass: true, ...data });
			else res({ pass: false, ...data });
		});
	});

	completion.push(childPromise);
}

await Promise.all(completion);
completion.forEach(({ pass, title, url, elapsed }) =>
	console.log(
		boxen(
			[
				`${
					pass
						? chalk`{reset.bold.green Does not have}`
						: chalk`{reset.bold.red Has}`
				} exposed secrets.`,
				`https://replit.com${url}`,
				`Completed in ${elapsed} seconds.`,
			].join('\n'),
			{
				padding: 1,
				title: title,
				titleAlignment: 'center',
			},
		),
	),
);

const TASK_END_TIME = new Date();
const totalElapsed = Math.abs(
	(TASK_END_TIME.getTime() - TASK_START_TIME.getTime()) / 1000,
);

console.log(
	chalk`{reset.bold.blue Total task completion took ${totalElapsed} seconds.}`,
);
