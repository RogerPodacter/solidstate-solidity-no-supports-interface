'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfERC20Extended = void 0;
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfERC20Extended(
  deploy,
  { mint, burn, allowance, supply },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ERC20Extended', function () {
    let deployer;
    let holder;
    let spender;
    let instance;
    before(async function () {
      [deployer, holder, spender] = await hardhat_1.ethers.getSigners();
    });
    beforeEach(async function () {
      instance = await deploy();
    });
    describe('#increaseAllowance(address,uint256)', function () {
      it('returns true', async () => {
        (0, chai_1.expect)(
          await instance
            .connect(holder)
            .callStatic['increaseAllowance(address,uint256)'](
              instance.address,
              hardhat_1.ethers.constants.Zero,
            ),
        ).to.be.true;
      });
      it('increases approval of spender with respect to holder by given amount', async function () {
        let amount = hardhat_1.ethers.constants.Two;
        await instance
          .connect(holder)
          ['increaseAllowance(address,uint256)'](spender.address, amount);
        await (0, chai_1.expect)(
          await allowance(holder.address, spender.address),
        ).to.equal(amount);
        await instance
          .connect(holder)
          ['increaseAllowance(address,uint256)'](spender.address, amount);
        await (0, chai_1.expect)(
          await allowance(holder.address, spender.address),
        ).to.equal(amount.add(amount));
        // TODO: test case is no different from #allowance test; tested further by #transferFrom tests
      });
      it('emits Approval event', async function () {
        let amount = hardhat_1.ethers.constants.Two;
        await (0, chai_1.expect)(
          instance
            .connect(holder)
            ['increaseAllowance(address,uint256)'](spender.address, amount),
        )
          .to.emit(instance, 'Approval')
          .withArgs(holder.address, spender.address, amount);
      });
      describe('reverts if', function () {
        it('approval amount overflows uint256', async function () {
          await instance
            .connect(holder)
            ['increaseAllowance(address,uint256)'](
              spender.address,
              hardhat_1.ethers.constants.MaxUint256,
            );
          await (0, chai_1.expect)(
            instance
              .connect(holder)
              ['increaseAllowance(address,uint256)'](
                spender.address,
                hardhat_1.ethers.constants.One,
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC20Extended__ExcessiveAllowance',
          );
        });
      });
    });
    describe('#decreaseAllowance(address,uint256)', function () {
      it('returns true', async () => {
        (0, chai_1.expect)(
          await instance
            .connect(holder)
            .callStatic['decreaseAllowance(address,uint256)'](
              instance.address,
              hardhat_1.ethers.constants.Zero,
            ),
        ).to.be.true;
      });
      it('decreases approval of spender with respect to holder by given amount', async function () {
        let amount = hardhat_1.ethers.constants.Two;
        await instance
          .connect(holder)
          ['increaseAllowance(address,uint256)'](
            spender.address,
            amount.mul(hardhat_1.ethers.constants.Two),
          );
        await instance
          .connect(holder)
          ['decreaseAllowance(address,uint256)'](spender.address, amount);
        await (0, chai_1.expect)(
          await allowance(holder.address, spender.address),
        ).to.equal(amount);
        await instance
          .connect(holder)
          ['decreaseAllowance(address,uint256)'](spender.address, amount);
        await (0, chai_1.expect)(
          await allowance(holder.address, spender.address),
        ).to.equal(hardhat_1.ethers.constants.Zero);
        // TODO: test case is no different from #allowance test; tested further by #transferFrom tests
      });
      it('emits Approval event', async function () {
        let amount = hardhat_1.ethers.constants.Two;
        await instance
          .connect(holder)
          ['increaseAllowance(address,uint256)'](spender.address, amount);
        await (0, chai_1.expect)(
          instance
            .connect(holder)
            ['decreaseAllowance(address,uint256)'](spender.address, amount),
        )
          .to.emit(instance, 'Approval')
          .withArgs(
            holder.address,
            spender.address,
            hardhat_1.ethers.constants.Zero,
          );
      });
      describe('reverts if', function () {
        it('approval amount underflows uint256', async function () {
          await (0, chai_1.expect)(
            instance
              .connect(holder)
              ['decreaseAllowance(address,uint256)'](
                spender.address,
                hardhat_1.ethers.constants.One,
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC20Base__InsufficientAllowance',
          );
        });
      });
    });
  });
}
exports.describeBehaviorOfERC20Extended = describeBehaviorOfERC20Extended;
