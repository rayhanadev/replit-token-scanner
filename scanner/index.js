import Bree from 'bree';
import Cabin from 'cabin';

const bree = new Bree({
	root: `${process.cwd()}/scanner/jobs/`,
	logger: new Cabin(),
	jobs: [
		{
			name: 'scan',
			timeout: false,
			interval: '1m',
		},
	],
});

await bree.start();
