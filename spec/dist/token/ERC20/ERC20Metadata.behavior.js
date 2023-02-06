'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfERC20Metadata = void 0;
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
function describeBehaviorOfERC20Metadata(
  deploy,
  { name, symbol, decimals },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ERC20Metadata', function () {
    let instance;
    beforeEach(async function () {
      instance = await deploy();
    });
    describe('#name()', function () {
      it('returns token name', async function () {
        (0, chai_1.expect)(await instance.callStatic['name()']()).to.equal(
          name,
        );
      });
    });
    describe('#symbol()', function () {
      it('returns token symbol', async function () {
        (0, chai_1.expect)(await instance.callStatic['symbol()']()).to.equal(
          symbol,
        );
      });
    });
    describe('#decimals()', function () {
      it('returns token decimals', async function () {
        (0, chai_1.expect)(await instance.callStatic['decimals()']()).to.equal(
          decimals,
        );
      });
    });
  });
}
exports.describeBehaviorOfERC20Metadata = describeBehaviorOfERC20Metadata;
