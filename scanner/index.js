import Bree from 'bree';
import Cabin from 'cabin';
import Graceful from '@ladjs/graceful';

const bree = new Bree({
	root: `${process.cwd()}/scanner/jobs/`,
	logger: new Cabin(),
	jobs: [
		{
			name: 'scan',
			interval: '1m',
		},
	],
});

const graceful = new Graceful({ brees: [bree] });
graceful.listen();

await bree.start();
