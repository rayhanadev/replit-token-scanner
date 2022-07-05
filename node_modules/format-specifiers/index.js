// these are known as "placeholder tokens", see this link for more info:
// <https://nodejs.org/api/util.html#util_util_format_format_args>
//
// since they aren't exposed (or don't seem to be) by node (at least not yet)
// we just define an array that contains them for now
// <https://github.com/nodejs/node/issues/17601>
// <https://github.com/nodejs/node/blob/7af1ad0ec15546761233c2e90008316551db2bbd/doc/api/util.md#utilformatformat-args>
module.exports = ['%s', '%d', '%i', '%f', '%j', '%o', '%O', '%%'];
