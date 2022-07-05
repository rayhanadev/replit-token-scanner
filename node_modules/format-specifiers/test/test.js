const test = require('ava');

const formatSpecifiers = require('..');

test('returns list', t => {
  t.deepEqual(formatSpecifiers, [
    '%s',
    '%d',
    '%i',
    '%f',
    '%j',
    '%o',
    '%O',
    '%%'
  ]);
});
