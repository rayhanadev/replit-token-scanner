import { readFile } from 'node:fs/promises';
import { appendFileSync } from 'node:fs';
import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import { lightfetch } from 'lightfetch-node';
import { Octokit } from '@octokit/rest';
import { format } from 'date-fns';
import chalk from 'chalk';
import boxen from 'boxen';

export const pTimeout = (promise, ms, fallback) => {
	let timer;
	return Promise.race([
		promise,
		new Promise((res) => (timer = setTimeout(() => res(fallback), ms))),
	]).finally(() => clearTimeout(timer));
};

export const errorLog = async (error) => {
	console.log(
		boxen(
			[chalk`{reset.bold.red An error occured}`, error.message].join(
				'\n',
			),
			{
				padding: 1,
				title: 'Error!',
				titleAlignment: 'center',
			},
		),
	);

	appendFileSync(
		process.cwd() + '/scanner-error.logs',
		`
${format(new Date(), "MM/dd/yy 'at' h':'m':'s 'UTC-0'")}
${error.message}
${error.stack ? error.stack : ''}
---`,
	);
};

export const ignore = await readFile(
	process.cwd() + '/scanner/default.gitignore',
	{ encoding: 'utf-8' },
);

export const tokenMatchers = {
	'Discord Bot Token': /[M-Z][A-Za-z\d]{23}\.[\w-]{6}\.[\w-]{27}/g,
	// TODO: Determine if the following two keys
	// Need to appear together to be invalidated.
	// 'AWS Access Token': /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g,
	// 'AWS Secret Key': /(?i)aws(.{0,20})?(?-i)['\"][0-9a-zA-Z\/+]{40}['\"]/g,
	'Google API Key': /AIza[0-9A-Za-z\\-_]{35}/g,
	'Google Cloud Platform API Key': /(google|gcp|youtube|drive|yt)(.{0,20})?['\"][AIza[0-9a-z\\-_]{35}]['\"]/gi,
	'Mailgun API Key': /key-[0-9a-zA-Z]{32}/g,
	'Mailchimp API Key': /[0-9a-f]{32}-us[0-9]{1,2}/g,
	'Slack API Token': /xox[baprs]-([0-9a-zA-Z]{10,48})?/g,
	'Slack Webhook': /https:\/\/hooks.slack.com\/services\/T[a-zA-Z0-9_]{10}\/B[a-zA-Z0-9_]{10}\/[a-zA-Z0-9_]{24}/g,
	'Slack Live API Key': /(?:r|s)k_live_[0-9a-zA-Z]{24}/g,
	'Slack Test API Key': /(?:r|s)k_test_[0-9a-zA-Z]{24}/g,
	'Twilio API Key': /SK[0-9a-fA-F]{32}/g,
};

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
});

const atob = (str) => Buffer.from(str).toString('base64');
const message = (token, repl) => {
	return `Heya! Replit's Token Scanner found your token in a published Repl!

Date: ${format(new Date(), "MM/dd/yy 'at' h':'m':'s 'UTC-0'")}
Location: https://replit.com${repl.url}#${token.path.slice(2)}
Type: ${token.type}
Token: ${token.token}

Your token has been revoked at ${token.type.split(' ')[0]} because Github scans these
repositories for secrets.

Please keep your token safe! You can do this by using Replit's secrets tab. To learn
how to use it, read: https://docs.replit.com/tutorials/storing-secrets-and-history`;
};

const { GITHUB_OWNER, GITHUB_REPO } = process.env;

export const disableToken = async (token, repl) => {
	const res = await octokit.repos.createOrUpdateFileContents({
		owner: GITHUB_OWNER,
		repo: GITHUB_REPO,
		path: `tokens/${crypto
			.randomBytes(60)
			.toString('base64')
			.replace(/\//g, '_')
			.replace(/\+/g, '-')
			.replace(/=/g, '')}.txt`,
		message: `chore(tokens): add from ${repl.id}`,
		content: atob(message(token, repl)),
	});

	if (res && res.status < 300) return true;
	else return false;
};

export const CURRENT_USER = `
	query CurrentUser {
		currentUser { 
			username,
			followerCount
		}
	}`;

export const RECENTLY_PUBLISHED_REPLS = `
	query RecentlyPublishedRepls($options: ReplPostsQueryOptions) {
		replPosts(options: $options) {
			items {
				repl { id, title, url	}
			}
			pageInfo{ nextCursor }
		}
	}`;

class GraphQL {
	constructor(token) {
		this.headers = {
			'user-agent': 'Mozilla/5.0',
			'x-requested-with': 'XMLHttpRequest',
			origin: 'https://replit.com',
			referer: 'https://replit.com',
			cookie: token ? `connect.sid=${token};` : '',
		};

		this.queries = {
			CURRENT_USER,
			RECENTLY_PUBLISHED_REPLS,
		};
	}

	async request(query, variables) {
		const res = await lightfetch('https://replit.com/graphql', {
			method: 'POST',
			headers: this.headers,
			body: {
				query: this.queries[query],
				variables: JSON.stringify(variables),
			},
		}).then((res) => res.json());

		const { data, errors } = res;

		if (errors)
			errorLog({
				message: 'GraphQL Error',
				stack: JSON.stringify({
					query: this.queries[query],
					variables: JSON.stringify(variables),
				}),
			});
		return data;
	}
}

export default GraphQL;
