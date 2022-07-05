import { parentPort } from 'node:worker_threads';
import process from 'node:process';

import { Crosis } from 'crosis4furrets';
import GraphQL from '../utils.js';

const { REPLIT_TOKEN } = process.env;
const gql = new GraphQL(REPLIT_TOKEN);

const { replPosts } = await gql.request('RECENTLY_PUBLISHED_REPLS', {
	options: {
		order: 'New',
		count: 10
	},
});

console.log(replPosts.items);

if (parentPort) parentPort.postMessage('done');
else process.exit(0);