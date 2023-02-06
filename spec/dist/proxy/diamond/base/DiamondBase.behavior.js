'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfDiamondBase = void 0;
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfDiamondBase(
  deploy,
  { facetFunction, facetFunctionArgs },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::DiamondBase', function () {
    let instance;
    beforeEach(async function () {
      instance = await deploy();
    });
    describe('fallback()', function () {
      it('forwards data with matching selector call to facet', async function () {
        (0, chai_1.expect)(instance[facetFunction]).to.be.undefined;
        let contract = new hardhat_1.ethers.Contract(
          instance.address,
          [`function ${facetFunction}`],
          hardhat_1.ethers.provider,
        );
        await (0, chai_1.expect)(
          contract.callStatic[facetFunction](...facetFunctionArgs),
        ).not.to.be.reverted;
      });
      it('forwards data without matching selector to fallback contract');
      describe('reverts if', function () {
        it('no selector matches data', async function () {
          let contract = new hardhat_1.ethers.Contract(
            instance.address,
            ['function function()'],
            hardhat_1.ethers.provider,
          );
          await (0, chai_1.expect)(
            contract.callStatic['function()'](),
          ).to.be.revertedWithCustomError(
            instance,
            'Proxy__ImplementationIsNotContract',
          );
        });
      });
    });
  });
}
exports.describeBehaviorOfDiamondBase = describeBehaviorOfDiamondBase;
