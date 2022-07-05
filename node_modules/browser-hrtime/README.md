# browser-hrtime
browser support for `process.hrtime()`.

![Node.js CI](https://github.com/cabinjs/browser-hrtime/workflows/Node.js%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/cabinjs/browser-hrtime/badge.svg?branch=master)](https://coveralls.io/github/cabinjs/browser-hrtime?branch=master)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![license](https://img.shields.io/github/license/cabinjs/parse-request.svg)](LICENSE)

## :package: Installation

#### npm

```bash
npm install browser-hrtime
```

#### yarn

```bash
yarn add browser-hrtime
```

## :page_with_curl: Examples
### NodeJS
#### As a polyfill
```js
require('browser-hrtime');

const time = process.hrtime();// [ 1800216, 25 ]
setTimeout(() => {
  const diff = process.hrtime(time);// [ 1, 552 ]
  console.log(`Benchmark took ${diff[0] * 1e9 + diff[1]} nanoseconds`);// Benchmark took 1000000552 nanoseconds
}, 1000);
```
### As a function
```js
const hrtime = require('browser-hrtime');

const time = hrtime();// [ 1800216, 25 ]
setTimeout(() => {
  const diff = hrtime(time);// [ 1, 552 ]
  console.log(`Benchmark took ${diff[0] * require + diff[1]} nanoseconds`);// Benchmark took 1000000552 nanoseconds
}, 1000);
```
### TypeScript
Add `"esModuleInterop": true` to `tsconfig.json` or use: 
```js
import hrtime = require('browser-hrtime');
```

## Web with module

```js
import * as hrtime from 'browser-hrtime';

const time = hrtime();// [ 1800216, 25 ]
setTimeout(() => {
  const diff = hrtime(time);// [ 1, 552 ]
  console.log(`Benchmark took ${diff[0] * 1e9 + diff[1]} nanoseconds`);// Benchmark took 1000000552 nanoseconds
}, 1000);
```

or as polyfill:
```js
import 'browser-hrtime';
const time = process.hrtime();// [ 1800216, 25 ]

setTimeout(() => {
  const diff = process.hrtime(time);// [ 1, 552 ]
  console.log(`Benchmark took ${diff[0] * 1e9 + diff[1]} nanoseconds`);// Benchmark took 1000000552 nanoseconds
}, 1000);
```
### Usage as an Angular polyfill:
add to `src/polyfills.ts`:
`import 'browser-hrtime';`
Add @types/node to your Angular app

```bash
npm i -S @types/node
```

Then in `tsconfig.json`
```json
"angularCompilerOptions": {
    "types" : ["node"]
    ....
}
```

## Web

```html
<script src="node_modules/browser-hrtime/lib/hrtime.js"></script>
<!-- Or from CDN: -->
<!-- <script crossorigin src="https://unpkg.com/browser-hrtime/lib/hrtime.js"></script> -->
```
```javascript
    console.log(hrtime());
    const first = process.hrtime();
    console.log(first);
    console.log(process.hrtime(first));
```

see [NodeJS documenation](https://nodejs.org/api/process.html#process_process_hrtime_time) for detailed process.hrtime API


## Contribution
Clone project from Github

```bash
git clone git@github.com:cabinjs/browser-hrtime.git
```

Install npm packages

```bash
cd browser-hrtime
npm install
```

Build sources:

```bash
npm run build
```
Run tests:

```
npm run test
```

### License

[MIT](LICENSE)
