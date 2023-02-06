'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfFactory = void 0;
const library_1 = require('@solidstate/library');
function describeBehaviorOfFactory(deploy, {}, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::Factory', function () {
    // no behavior
  });
}
exports.describeBehaviorOfFactory = describeBehaviorOfFactory;
