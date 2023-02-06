'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfDiamondFallback = void 0;
const mock_contract_1 = require('@ethereum-waffle/mock-contract');
const library_1 = require('@solidstate/library');
const spec_1 = require('@solidstate/spec');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfDiamondFallback(deploy, args, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::DiamondFallback', function () {
    let instance;
    let owner;
    let nonOwner;
    beforeEach(async function () {
      instance = await deploy();
      owner = await args.getOwner();
      nonOwner = await args.getNonOwner();
    });
    (0, spec_1.describeBehaviorOfDiamondBase)(
      async () => instance,
      args,
      skips,
    );
    describe('#getFallbackAddress()', function () {
      it('returns the fallback address', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['getFallbackAddress()'](),
        ).to.equal(args.fallbackAddress);
      });
    });
    describe('#setFallbackAddress(address)', function () {
      it('updates the fallback address', async function () {
        const fallback = await (0, mock_contract_1.deployMockContract)(
          owner,
          [],
        );
        await instance
          .connect(owner)
          ['setFallbackAddress(address)'](fallback.address);
        (0, chai_1.expect)(
          await instance.callStatic['getFallbackAddress()'](),
        ).to.equal(fallback.address);
        // call reverts, but with mock-specific message
        await (0, chai_1.expect)(
          owner.sendTransaction({
            to: instance.address,
            data: hardhat_1.ethers.utils.randomBytes(4),
          }),
        ).to.be.revertedWith('Mock on the method is not initialized');
      });
      describe('reverts if', function () {
        it('sender is not owner', async function () {
          await (0, chai_1.expect)(
            instance
              .connect(nonOwner)
              ['setFallbackAddress(address)'](
                hardhat_1.ethers.constants.AddressZero,
              ),
          ).to.be.revertedWithCustomError(instance, 'Ownable__NotOwner');
        });
      });
    });
  });
}
exports.describeBehaviorOfDiamondFallback = describeBehaviorOfDiamondFallback;
