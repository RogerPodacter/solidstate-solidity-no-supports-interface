'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfMinimalProxyFactory = void 0;
const Factory_behavior_1 = require('./Factory.behavior');
const library_1 = require('@solidstate/library');
function describeBehaviorOfMinimalProxyFactory(deploy, {}, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::MinimalProxyFactory', function () {
    (0, Factory_behavior_1.describeBehaviorOfFactory)(deploy, {}, skips);
  });
}
exports.describeBehaviorOfMinimalProxyFactory =
  describeBehaviorOfMinimalProxyFactory;
