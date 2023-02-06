'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfMetamorphicFactory = void 0;
const Factory_behavior_1 = require('./Factory.behavior');
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfMetamorphicFactory(deploy, {}, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::MetamorphicFactory', function () {
    let instance;
    beforeEach(async function () {
      instance = await deploy();
    });
    (0, Factory_behavior_1.describeBehaviorOfFactory)(deploy, {}, skips);
    describe('#getMetamorphicImplementation()', function () {
      // behavior changes during internal call but cannot be tested independently
      it('returns zero address', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['getMetamorphicImplementation()'](),
        ).to.equal(hardhat_1.ethers.constants.AddressZero);
      });
    });
  });
}
exports.describeBehaviorOfMetamorphicFactory =
  describeBehaviorOfMetamorphicFactory;
