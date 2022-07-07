import { readFile, writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { lightfetch } from 'lightfetch-node';
import { Octokit } from '@octokit/rest';
import { format } from 'date-fns'

export const errorLog = (error) => await writeFile(process.cwd() + '/scanner-error.logs', `
${format(new Date(), "MM/dd/yy 'at' h':'m':'s UTC-0")}
${error.message}
${error.stack ? error.stack : ''}`);

export const ignore = await readFile(
	process.cwd() + '/scanner/default.gitignore',
	{ encoding: 'utf-8' },
);

export const tokenMatchers = {
	Discord: /[M-Z][A-Za-z\d]{23}\.[\w-]{6}\.[\w-]{27}/g,
};

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
});

const atob = (str) => Buffer.from(str).toString('base64');
const message = (token, repl) => {
	return `Heya! Replit's Token Scanner found your token in a published Repl!

Type: ${token.type}
Location: https://replit.com${repl.url}
Token: ${token.token}

Your token has been revoked at your service because Github scans these
repositories for secrets.

Please keep your token safe! You can do this by using Replit's secrets tab. To learn
how to use it, read: https://docs.replit.com/tutorials/storing-secrets-and-history`;
};

const { GITHUB_OWNER, GITHUB_REPO } = process.env;

export const disableToken = async (token, repl) => {
	const res = await octokit.repos.createOrUpdateFileContents({
		owner: GITHUB_OWNER,
		repo: GITHUB_REPO,
		path: `${atob(repl.id)}.txt`,
		message: `chore: add token from ${repl.id}`,
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

		if (errors) throw new Error('Replit GraphQL Error.');
		return data;
	}
}

export default GraphQL;
