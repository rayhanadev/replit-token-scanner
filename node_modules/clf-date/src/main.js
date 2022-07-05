/**
 * Convert the Number to String with 0 at the beginning.
 * @param  {Number} n - The number.
 * @return {String} The number converted to String.
 */
function numberToString(n) {
	const str = n.toString();
	return `${str.length === 1 ? '0' : ''}${str}`;
}

/**
 * Return the offset from UTC in CLF format.
 * @param {Date} date - The date
 * @return {String} The offset.
 */
function getCLFOffset(date) {
	const tzoffset    = date.getTimezoneOffset();
	const abstzoffset = Math.abs(tzoffset);
	const op		  = tzoffset > 0 ? '-' : '+'; // TimezoneOffset is set as subtraction from localtime to UTC,
                                                  //    on the other hand time in CLF is shown as subtraction from UTC to localtime.
	const hour = numberToString(Math.floor(abstzoffset / 60));
	const min  = numberToString(abstzoffset % 60);
	return `${op}${hour}${min}`;
}

module.exports = function (now = new Date()) {
	if (!(now instanceof Date)) {
		throw new Error('clf-date: invalid parameter');
	}

	const MONTHS = [
		'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
	];

	const day		= numberToString(now.getDate());
	const month		= MONTHS[now.getMonth()];
	const year		= now.getFullYear();

	const hours		= numberToString(now.getHours());
	const minutes	= numberToString(now.getMinutes());
	const seconds	= numberToString(now.getSeconds());

	const offset	= getCLFOffset(now);

	return `${day}/${month}/${year}:${hours}:${minutes}:${seconds} ${offset}`;
};
