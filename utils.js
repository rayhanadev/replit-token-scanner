import { lightfetch } from 'lightfetch-node';
// import fetch from 'node-fetch';

export const CURRENT_USER = `
	query CurrentUser {
		currentUser { 
			username,
			followerCount
		}
	}`

export const RECENTLY_PUBLISHED_REPLS = `
	query RecentlyPublishedRepls($options: ReplPostsQueryOptions) {
		replPosts(options: $options) {
			items {
				repl { id, title	}
			}
			pageInfo{ nextCursor }
		}
	}`;

class GraphQL {
	constructor(token) {
		this.headers = {
			'user-agent': 'Mozilla/5.0',
			'x-requested-with': 'XMLHttpRequest',
			'origin': 'https://replit.com',
			'referer': 'https://replit.com',
			'cookie': token ? `connect.sid=${token};` : '',
		};

		this.queries = {
			CURRENT_USER,
			RECENTLY_PUBLISHED_REPLS
		}
	}

	async request(query, variables) {
		const res = await lightfetch('https://replit.com/graphql', {
			method: 'POST',
			headers: this.headers,
			body: {
				query: this.queries[query],
				variables: JSON.stringify(variables),
			}
		}).then((res) => res.json());

		const { data, errors } = res;

		if (errors) throw new Error('Replit GraphQL Error.');
		return data;
	}
};

export default GraphQL;