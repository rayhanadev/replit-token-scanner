import path from 'node:path';

import Koa from 'koa';
import Router from '@koa/router';
const app = new Koa();
const _ = new Router();

import compression from 'koa-compress';
app.use(compression());

import serve from 'koa-static';
import mount from 'koa-mount';
app.use(mount('/', serve(process.cwd() + '/website/public', { maxage: 0 })));

import send from 'koa-send';
app.use(
	async (ctx) =>
		(ctx.body = await send(ctx, '/index.html', {
			root: process.cwd() + '/website/public',
		})),
);

app.listen(3000, () => console.log('Server Running.'));
