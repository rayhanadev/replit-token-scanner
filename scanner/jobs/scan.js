import process from 'node:process';
import { spawn } from 'node:child_process';
import chalk from 'chalk';
import boxen from 'boxen';

import GraphQL, { disableToken, errorLog, pTimeout } from '../utils.js';

const TASK_START_TIME = new Date();
const { REPLIT_TOKEN, SCANNER_COUNT_OVERRIDE, SCANNER_TIMEOUT } = process.env;
const gql = new GraphQL(REPLIT_TOKEN);

const { replPosts } = await gql.request('RECENTLY_PUBLISHED_REPLS', {
	options: {
		order: 'New',
		count: SCANNER_COUNT_OVERRIDE || 10,
	},
});

const { items } = replPosts;

const completion = [];

for (let i = 0; i < items.length; i++) {
	const { repl } = items[i];
	if (!repl) continue;

	const childPromise = new Promise((res) => {
		const START_TIME = new Date();

		const node = spawn(
			'node',
			['scanner/check.js', `--REPLIT_ID=${repl.id}`],
			{ stdio: ['inherit', 'inherit', 'inherit', 'ipc'] },
		);

		let tokens = [];

		node.on('message', (data) => {
			let info = {};
			try {
				info = JSON.parse(data);
			} catch {
				return;
			}

			if (info.type && info.token) tokens.push(info);
		});

		node.on('close', () => {
			const END_TIME = new Date();
			const elapsed = Math.abs(
				(END_TIME.getTime() - START_TIME.getTime()) / 1000,
			);

			const data = { elapsed, tokens, repl };

			if (tokens.length === 0) res({ pass: true, ...data });
			else res({ pass: false, ...data });
		});
	});

	completion.push(
		await pTimeout(childPromise, Number(SCANNER_TIMEOUT) || Infinity, {
			repl,
			pass: false,
			elapsed: SCANNER_TIMEOUT,
		}),
	);
}

await Promise.all(completion);
completion.forEach(({ pass, elapsed, tokens, repl }) => {
	try {
		if (!pass && tokens && tokens.length > 0)
			tokens.forEach((token) => disableToken(token, repl));
	} catch (error) {
		errorLog(error);
	}

	if (!pass && elapsed === SCANNER_TIMEOUT) {
		console.log(
			boxen(
				[
					`${chalk`{reset.bold.red Could not be scanned}`} for exposed secrets.`,
					`https://replit.com${repl.url.substring(0, 30)}${
						repl.url.length > 30 ? '...' : ''
					}`,
					`Completed in ${chalk`{reset.bold.red ${Math.abs(
						Number(elapsed) / 1000,
					)}}`} seconds.`,
				].join('\n'),
				{
					padding: 1,
					title: repl.title,
					titleAlignment: 'center',
				},
			),
		);

		return;
	}

	console.log(
		boxen(
			[
				`${
					pass
						? chalk`{reset.bold.green Does not have}`
						: chalk`{reset.bold.red Has}`
				} exposed secrets.`,
				`https://replit.com${repl.url.substring(0, 30)}${
					repl.url.length > 30 ? '...' : ''
				}`,
				`Completed in ${
					elapsed > 15
						? chalk`{reset.bold.red ${elapsed}}`
						: chalk`{reset.bold.green ${elapsed}}`
				} seconds.`,
			].join('\n'),
			{
				padding: 1,
				title: repl.title,
				titleAlignment: 'center',
			},
		),
	);
});

const TASK_END_TIME = new Date();
const totalElapsed = Math.abs(
	(TASK_END_TIME.getTime() - TASK_START_TIME.getTime()) / 1000,
);

console.log(
	chalk`{reset.bold.blue Total task completion took ${totalElapsed} seconds.}`,
);
