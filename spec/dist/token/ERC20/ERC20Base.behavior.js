'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfERC20Base = void 0;
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfERC20Base(deploy, { supply, mint, burn }, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ERC20Base', function () {
    // note: holder gets supply (1e18) amount of tokens so use spender/receiver for easier testing
    let holder;
    let spender;
    let receiver;
    let sender;
    let instance;
    before(async function () {
      [holder, spender, receiver, sender] = await hardhat_1.ethers.getSigners();
    });
    beforeEach(async function () {
      instance = await deploy();
    });
    describe('#totalSupply()', function () {
      it('returns the total supply of tokens', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['totalSupply()'](),
        ).to.equal(supply);
        const amount = hardhat_1.ethers.constants.Two;
        await mint(holder.address, amount);
        (0, chai_1.expect)(
          await instance.callStatic['totalSupply()'](),
        ).to.equal(supply.add(amount));
        await burn(holder.address, amount);
        (0, chai_1.expect)(
          await instance.callStatic['totalSupply()'](),
        ).to.equal(supply);
      });
    });
    describe('#balanceOf(address)', function () {
      it('returns the token balance of given address', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['balanceOf(address)'](
            hardhat_1.ethers.constants.AddressZero,
          ),
        ).to.equal(hardhat_1.ethers.constants.Zero);
        const amount = hardhat_1.ethers.constants.Two;
        await (0, chai_1.expect)(() =>
          mint(holder.address, amount),
        ).to.changeTokenBalance(instance, holder, amount);
        await (0, chai_1.expect)(() =>
          burn(holder.address, amount),
        ).to.changeTokenBalance(instance, holder, -amount);
      });
    });
    describe('#allowance(address,address)', function () {
      it('returns the allowance given holder has granted to given spender', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['allowance(address,address)'](
            holder.address,
            spender.address,
          ),
        ).to.equal(hardhat_1.ethers.constants.Zero);
        let amount = hardhat_1.ethers.constants.Two;
        await instance
          .connect(holder)
          ['approve(address,uint256)'](spender.address, amount);
        (0, chai_1.expect)(
          await instance.callStatic['allowance(address,address)'](
            holder.address,
            spender.address,
          ),
        ).to.equal(amount);
      });
    });
    describe('#approve(address,uint256)', function () {
      it('returns true', async () => {
        const amount = hardhat_1.ethers.constants.Two;
        (0, chai_1.expect)(
          await instance
            .connect(holder)
            .callStatic['approve(address,uint256)'](spender.address, amount),
        ).to.be.true;
      });
      it('enables given spender to spend tokens on behalf of sender', async function () {
        let amount = hardhat_1.ethers.constants.Two;
        await instance
          .connect(holder)
          ['approve(address,uint256)'](spender.address, amount);
        (0, chai_1.expect)(
          await instance.callStatic['allowance(address,address)'](
            holder.address,
            spender.address,
          ),
        ).to.equal(amount);
        // TODO: test case is no different from #allowance test; tested further by #transferFrom tests
      });
      it('emits Approval event', async function () {
        let amount = hardhat_1.ethers.constants.Two;
        await (0, chai_1.expect)(
          instance
            .connect(holder)
            ['approve(address,uint256)'](spender.address, amount),
        )
          .to.emit(instance, 'Approval')
          .withArgs(holder.address, spender.address, amount);
      });
    });
    describe('#transfer(address,uint256)', function () {
      it('returns true', async () => {
        (0, chai_1.expect)(
          await instance
            .connect(holder)
            .callStatic['transfer(address,uint256)'](
              receiver.address,
              hardhat_1.ethers.constants.Zero,
            ),
        ).to.be.true;
      });
      it('transfers amount from holder to receiver', async function () {
        const amount = hardhat_1.ethers.constants.Two;
        await mint(holder.address, amount);
        await (0, chai_1.expect)(() =>
          instance
            .connect(holder)
            ['transfer(address,uint256)'](receiver.address, amount),
        ).to.changeTokenBalances(
          instance,
          [holder, receiver],
          [-amount, amount],
        );
      });
      describe('reverts if', function () {
        it('has insufficient balance', async function () {
          const amount = hardhat_1.ethers.constants.Two;
          await (0, chai_1.expect)(
            instance
              .connect(spender)
              ['transfer(address,uint256)'](holder.address, amount),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC20Base__TransferExceedsBalance',
          );
        });
      });
    });
    describe('#transferFrom(address,address,uint256)', function () {
      it('returns true', async () => {
        (0, chai_1.expect)(
          await instance
            .connect(spender)
            .callStatic['transferFrom(address,address,uint256)'](
              holder.address,
              receiver.address,
              hardhat_1.ethers.constants.Zero,
            ),
        ).to.be.true;
      });
      it('transfers amount on behalf of holder', async function () {
        const amount = hardhat_1.ethers.constants.Two;
        await mint(holder.address, amount);
        await instance
          .connect(holder)
          ['approve(address,uint256)'](spender.address, amount);
        await (0, chai_1.expect)(() =>
          instance
            .connect(spender)
            ['transferFrom(address,address,uint256)'](
              holder.address,
              receiver.address,
              amount,
            ),
        ).to.changeTokenBalances(
          instance,
          [holder, receiver],
          [-amount, amount],
        );
      });
      describe('reverts if', function () {
        it('has insufficient balance', async function () {
          const amount = hardhat_1.ethers.constants.Two;
          await (0, chai_1.expect)(
            instance
              .connect(spender)
              ['transfer(address,uint256)'](holder.address, amount),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC20Base__TransferExceedsBalance',
          );
        });
        it('spender not approved', async function () {
          const amount = hardhat_1.ethers.constants.Two;
          await mint(sender.address, amount);
          await (0, chai_1.expect)(
            instance
              .connect(spender)
              ['transferFrom(address,address,uint256)'](
                sender.address,
                receiver.address,
                amount,
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
exports.describeBehaviorOfERC20Base = describeBehaviorOfERC20Base;
