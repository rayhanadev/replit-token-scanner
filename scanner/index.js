import Bree from 'bree';
import Cabin from 'cabin';

const bree = new Bree({
	root: `${process.cwd()}/scanner/jobs/`,
	logger: new Cabin(),
});

await bree.start('scan');
