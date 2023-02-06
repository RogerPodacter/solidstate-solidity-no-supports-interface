'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfCloneFactory = void 0;
const Factory_behavior_1 = require('./Factory.behavior');
const library_1 = require('@solidstate/library');
function describeBehaviorOfCloneFactory(deploy, {}, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::CloneFactory', function () {
    (0, Factory_behavior_1.describeBehaviorOfFactory)(deploy, {}, skips);
  });
}
exports.describeBehaviorOfCloneFactory = describeBehaviorOfCloneFactory;
