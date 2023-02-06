'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeFilter = void 0;
function describeFilter(skips) {
  let set = new Set(skips);
  return function (title, suite) {
    set.has(title) || describe(title, suite);
  };
}
exports.describeFilter = describeFilter;
