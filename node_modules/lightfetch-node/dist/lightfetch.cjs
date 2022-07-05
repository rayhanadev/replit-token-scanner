'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const https = require('https');

const parseCookieString = (cookieValue) => {
	const parts = cookieValue
		.split(';')
		.filter((str) => typeof str === 'string' && !!str.trim());
	const item = parts.shift().split('=');
	const name = item.shift();
	const value = decodeURIComponent(item.join('='));

	const cookie = {
		name: name,
		value: value,
	};

	parts.forEach((part) => {
		const args = part.split('=');
		const key = args.shift().trimLeft().toLowerCase();
		const value = args.join('=');
		switch (key) {
			case 'path': {
				cookie['Path'] = value;
				break;
			}
			case 'expires': {
				cookie['Expires'] = new Date(value);
				break;
			}
			case 'max-age': {
				cookie['Max-Age'] = parseInt(value, 10);
				break;
			}
			case 'secure': {
				cookie['Secure'] = true;
				break;
			}
			case 'httponly': {
				cookie['HttpOnly'] = true;
				break;
			}
			case 'samesite': {
				cookie['SameSite'] = value;
				break;
			}
			default: {
				cookie[key] = value;
			}
		}
	});

	return cookie;
};

const parseCookie = ({ headers: { 'set-cookie': input } }) => {
	if (!Array.isArray(input)) input = [input];

	const cookies = {};
	return input
		.filter((str) => typeof str === 'string' && !!str.trim())
		.reduce((cookies, str) => {
			const cookie = parseCookieString(str);
			cookies[cookie.name] = cookie;
			return cookies;
		}, cookies);
};

const requestFunc = (method, url, headers = {}, body) => {
	const urlPieces = new URL(url);
	const formRegex = /^(([\w\s.])+=([\w\s.])+&?)+/;

	let requestSafeBody = '';
	if (method.toLowerCase() !== 'get' && !headers['Content-Type']) {
		if (typeof body === 'object') {
			headers['Content-Type'] = 'application/json';
			requestSafeBody = JSON.stringify(body);
		} else if (
			typeof body === 'string' &&
			formRegex.test(decodeURI(body))
		) {
			headers['Content-Type'] = 'application/x-www-form-urlencoded';
			requestSafeBody = body;
		} else {
			headers['Content-Type'] = 'text/plain';
			requestSafeBody = body;
		}
	}

	if (method.toLowerCase() !== 'get')
		headers['Content-Length'] = Buffer.byteLength(requestSafeBody);

	const requestOptions = {
		hostname: urlPieces.host,
		port: urlPieces.port || 443,
		path: urlPieces.pathname + urlPieces.search,
		method: method.toUpperCase(),
		headers,
	};

	const requestPromise = new Promise((resolve, reject) => {
		const request = https.request(requestOptions, (response) => {
			let responseData = '';

			response.on('data', (dataBuffer) => {
				responseData += dataBuffer;
			});

			response.on('end', () => {
				const returnable = {
					response,
					cookies: parseCookie(response),
					status: response.statusCode,
					headers: {
						...response.headers,
						get: (header) => response.headers[header.toLowerCase()],
					},
					json: () => {
						try {
							return JSON.parse(responseData);
						} catch (error) {
							throw new Error(error);
						}
					},
					text: () => {
						try {
							return responseData;
						} catch (error) {
							throw new Error(error);
						}
					},
				};
				resolve(returnable);
			});
		});

		request.on('error', (error) => {
			reject(error);
		});

		if (method.toLowerCase() !== 'get') request.write(requestSafeBody);
		request.end();
	});
	return requestPromise;
};

const lightfetch = async (url, options = { method: 'GET' }) => {
	const { method, headers, body } = options;
	return requestFunc(method, url, headers, body);
};

exports.lightfetch = lightfetch;
