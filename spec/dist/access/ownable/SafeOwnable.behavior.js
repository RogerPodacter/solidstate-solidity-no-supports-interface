'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfSafeOwnable = void 0;
const Ownable_behavior_1 = require('./Ownable.behavior');
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const ethers_1 = require('ethers');
function describeBehaviorOfSafeOwnable(
  deploy,
  { getOwner, getNomineeOwner, getNonOwner },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::SafeOwnable', function () {
    let instance;
    let owner;
    let nomineeOwner;
    let nonOwner;
    beforeEach(async function () {
      instance = await deploy();
      owner = await getOwner();
      nomineeOwner = await getNomineeOwner();
      nonOwner = await getNonOwner();
    });
    (0, Ownable_behavior_1.describeBehaviorOfOwnable)(
      deploy,
      {
        getOwner,
        getNonOwner,
      },
      [
        '#transferOwnership(address)',
        ...(skips !== null && skips !== void 0 ? skips : []),
      ],
    );
    describe('#nomineeOwner()', function () {
      it('returns address of nominee owner', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['nomineeOwner()'](),
        ).to.equal(ethers_1.ethers.constants.AddressZero);
        await instance
          .connect(owner)
          ['transferOwnership(address)'](nomineeOwner.address);
        (0, chai_1.expect)(
          await instance.callStatic['nomineeOwner()'](),
        ).to.equal(nomineeOwner.address);
      });
    });
    describe('#transferOwnership(address)', function () {
      it('does not set new owner', async function () {
        await instance
          .connect(owner)
          ['transferOwnership(address)'](nomineeOwner.address);
        (0, chai_1.expect)(await instance.callStatic['owner()']()).to.equal(
          owner.address,
        );
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
    describe('#acceptOwnership()', function () {
      it('sets new owner', async function () {
        await instance
          .connect(owner)
          ['transferOwnership(address)'](nomineeOwner.address);
        await instance.connect(nomineeOwner)['acceptOwnership()']();
        (0, chai_1.expect)(await instance.callStatic['owner()']()).to.equal(
          nomineeOwner.address,
        );
      });
      it('emits OwnershipTransferred event', async function () {
        await instance
          .connect(owner)
          ['transferOwnership(address)'](nomineeOwner.address);
        await (0, chai_1.expect)(
          instance.connect(nomineeOwner)['acceptOwnership()'](),
        )
          .to.emit(instance, 'OwnershipTransferred')
          .withArgs(owner.address, nomineeOwner.address);
      });
    });
    describe('reverts if', function () {
      it('sender is not nominee owner', async function () {
        await (0, chai_1.expect)(
          instance.connect(nonOwner)['acceptOwnership()'](),
        ).to.be.revertedWithCustomError(
          instance,
          'SafeOwnable__NotNomineeOwner',
        );
      });
    });
  });
}
exports.describeBehaviorOfSafeOwnable = describeBehaviorOfSafeOwnable;
