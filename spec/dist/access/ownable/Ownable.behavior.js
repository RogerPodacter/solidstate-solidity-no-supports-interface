'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfOwnable = void 0;
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfOwnable(deploy, { getOwner, getNonOwner }, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::Ownable', function () {
    let instance;
    let owner;
    let nonOwner;
    beforeEach(async function () {
      instance = await deploy();
      owner = await getOwner();
      nonOwner = await getNonOwner();
    });
    describe('#owner()', function () {
      it('returns address of owner', async function () {
        (0, chai_1.expect)(await instance.callStatic['owner()']()).to.equal(
          owner.address,
        );
      });
    });
    describe('#transferOwnership(address)', function () {
      it('sets new owner', async function () {
        await instance
          .connect(owner)
          .transferOwnership(hardhat_1.ethers.constants.AddressZero);
        (0, chai_1.expect)(await instance.callStatic['owner()']()).to.equal(
          hardhat_1.ethers.constants.AddressZero,
        );
      });
      it('emits OwnershipTransferred event', async function () {
        await (0, chai_1.expect)(
          instance
            .connect(owner)
            .transferOwnership(hardhat_1.ethers.constants.AddressZero),
        )
          .to.emit(instance, 'OwnershipTransferred')
          .withArgs(owner.address, hardhat_1.ethers.constants.AddressZero);
      });
      describe('reverts if', function () {
        it('sender is not owner', async function () {
          await (0, chai_1.expect)(
            instance
              .connect(nonOwner)
              ['transferOwnership(address)'](nonOwner.address),
          ).to.be.revertedWithCustomError(instance, 'Ownable__NotOwner');
        });
      });
    });
  });
}
exports.describeBehaviorOfOwnable = describeBehaviorOfOwnable;
