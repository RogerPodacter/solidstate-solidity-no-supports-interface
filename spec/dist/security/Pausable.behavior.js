'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfPausable = void 0;
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
function describeBehaviorOfPausable(deploy, args, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::Pausable', function () {
    let instance;
    beforeEach(async function () {
      instance = await deploy();
    });
    describe('#paused()', function () {
      it('returns paused == false', async function () {
        (0, chai_1.expect)(await instance.paused()).to.equal(false);
      });
    });
  });
}
exports.describeBehaviorOfPausable = describeBehaviorOfPausable;
