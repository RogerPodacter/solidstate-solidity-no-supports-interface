'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfERC4626Base = void 0;
const ERC20_1 = require('../ERC20');
const ERC20_2 = require('../ERC20');
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const ethers_1 = require('ethers');
const hardhat_1 = require('hardhat');
function describeBehaviorOfERC4626Base(deploy, args, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ERC4626Base', function () {
    let caller;
    let depositor;
    let recipient;
    let assetInstance;
    let instance;
    before(async () => {
      [caller, depositor, recipient] = await hardhat_1.ethers.getSigners();
    });
    beforeEach(async function () {
      assetInstance = await args.getAsset();
      instance = await deploy();
    });
    (0, ERC20_1.describeBehaviorOfERC20Base)(deploy, args, skips);
    (0, ERC20_2.describeBehaviorOfERC20Metadata)(deploy, args, skips);
    describe('#asset()', () => {
      it('returns the address of the base asset', async () => {
        (0, chai_1.expect)(await instance.callStatic.asset()).to.eq(
          assetInstance.address,
        );
      });
    });
    describe('#convertToShares(uint256)', () => {
      it('returns input amount if share supply is zero', async () => {
        (0, chai_1.expect)(
          await instance.callStatic.convertToShares(
            hardhat_1.ethers.constants.Two,
          ),
        ).to.eq(hardhat_1.ethers.constants.Two);
      });
      it('returns the correct amount of shares if totalSupply is non-zero', async () => {
        await args.mint(instance.address, ethers_1.BigNumber.from('10'));
        const supply = await instance.callStatic.totalSupply();
        const assets = await instance.callStatic.totalAssets();
        const assetAmount = ethers_1.BigNumber.from('3');
        // result is rounded down
        (0, chai_1.expect)(
          await instance.callStatic.convertToShares(assetAmount),
        ).to.eq(assetAmount.mul(supply).div(assets));
      });
    });
    describe('#convertToAssets(uint256)', () => {
      it('returns input amount if share supply is zero', async () => {
        (0, chai_1.expect)(
          await instance.callStatic.convertToAssets(
            hardhat_1.ethers.constants.Two,
          ),
        ).to.eq(hardhat_1.ethers.constants.Two);
      });
      it('returns the correct amount of assets if totalSupply is non-zero', async () => {
        await args.mint(instance.address, ethers_1.BigNumber.from('10'));
        const supply = await instance.callStatic.totalSupply();
        const assets = await instance.callStatic.totalAssets();
        const shareAmount = ethers_1.BigNumber.from('3');
        // result is rounded down
        (0, chai_1.expect)(
          await instance.callStatic.convertToAssets(shareAmount),
        ).to.eq(shareAmount.mul(assets).div(supply));
      });
    });
    describe('#maxDeposit(address)', () => {
      it('returns maximum uint256', async () => {
        (0, chai_1.expect)(
          await instance.callStatic.maxDeposit(depositor.address),
        ).to.eq(hardhat_1.ethers.constants.MaxUint256);
      });
    });
    describe('#maxMint(address)', () => {
      it('returns maximum uint256', async () => {
        (0, chai_1.expect)(
          await instance.callStatic.maxMint(depositor.address),
        ).to.eq(hardhat_1.ethers.constants.MaxUint256);
      });
    });
    describe('#maxWithdraw(address)', () => {
      it('returns asset value of share balance of given account', async () => {
        await args.mint(depositor.address, hardhat_1.ethers.constants.Two);
        const balance = await instance.callStatic.balanceOf(depositor.address);
        (0, chai_1.expect)(
          await instance.callStatic.maxWithdraw(depositor.address),
        ).to.eq(await instance.callStatic.convertToAssets(balance));
      });
    });
    describe('#maxRedeem(address)', () => {
      it('returns share balance of given account', async () => {
        await args.mint(depositor.address, hardhat_1.ethers.constants.Two);
        const balance = await instance.callStatic.balanceOf(depositor.address);
        (0, chai_1.expect)(
          await instance.callStatic.maxRedeem(depositor.address),
        ).to.eq(balance);
      });
    });
    describe('#previewDeposit(uint256)', () => {
      it('returns the deposit input amount converted to shares', async () => {
        const assetAmount = hardhat_1.ethers.utils.parseUnits('1', 18);
        // result is rounded down
        (0, chai_1.expect)(
          await instance
            .connect(depositor)
            .callStatic.previewDeposit(assetAmount),
        ).to.eq(await instance.callStatic.convertToShares(assetAmount));
      });
    });
    describe('#previewMint(uint256)', () => {
      it('todo: supply is 0');
      it('returns the mint input amount converted to assets', async () => {
        await args.mint(instance.address, ethers_1.BigNumber.from('10'));
        const supply = await instance.callStatic.totalSupply();
        const assets = await instance.callStatic.totalAssets();
        const shareAmount = ethers_1.BigNumber.from('3');
        const err = shareAmount.mul(assets).mod(supply).isZero()
          ? hardhat_1.ethers.constants.Zero
          : hardhat_1.ethers.constants.One;
        // result is rounded up
        (0, chai_1.expect)(
          await instance.connect(depositor).callStatic.previewMint(shareAmount),
        ).to.eq(
          (await instance.callStatic.convertToAssets(shareAmount)).add(err),
        );
      });
    });
    describe('#previewWithdraw(uint256)', () => {
      it('todo: supply is 0');
      it('returns the withdraw input amount converted to shares', async () => {
        await args.mint(instance.address, ethers_1.BigNumber.from('10'));
        const supply = await instance.callStatic.totalSupply();
        const assets = await instance.callStatic.totalAssets();
        const assetAmount = ethers_1.BigNumber.from('3');
        const err = assetAmount.mul(supply).mod(assets).isZero()
          ? hardhat_1.ethers.constants.Zero
          : hardhat_1.ethers.constants.One;
        // result is rounded up
        (0, chai_1.expect)(
          await instance
            .connect(depositor)
            .callStatic.previewWithdraw(assetAmount),
        ).to.eq(
          (await instance.callStatic.convertToShares(assetAmount)).add(err),
        );
      });
    });
    describe('#previewRedeem(uint256)', () => {
      it('returns the redeem input amount converted to assets', async () => {
        const shareAmount = hardhat_1.ethers.utils.parseUnits('1', 18);
        // result is rounded down
        (0, chai_1.expect)(
          await instance
            .connect(depositor)
            .callStatic.previewRedeem(shareAmount),
        ).to.eq(await instance.callStatic.convertToAssets(shareAmount));
      });
    });
    describe('#deposit(uint256,address)', () => {
      it('transfers assets from caller', async () => {
        const assetAmount = hardhat_1.ethers.constants.Two;
        await args.mint(caller.address, assetAmount);
        await args.mintAsset(depositor.address, assetAmount);
        await assetInstance
          .connect(depositor)
          .approve(instance.address, assetAmount);
        await (0, chai_1.expect)(() =>
          instance
            .connect(depositor)
            ['deposit(uint256,address)'](assetAmount, depositor.address),
        ).to.changeTokenBalances(
          assetInstance,
          [depositor, instance],
          [
            assetAmount.mul(hardhat_1.ethers.constants.NegativeOne),
            assetAmount,
          ],
        );
      });
      it('mints shares for receiver', async () => {
        const assetAmount = hardhat_1.ethers.constants.Two;
        await args.mint(caller.address, assetAmount);
        await args.mintAsset(depositor.address, assetAmount);
        await assetInstance
          .connect(depositor)
          .approve(instance.address, assetAmount);
        const shareAmount = await instance
          .connect(depositor)
          .callStatic.previewDeposit(assetAmount);
        const oldBalance = await instance.callStatic.balanceOf(
          depositor.address,
        );
        await instance
          .connect(depositor)
          ['deposit(uint256,address)'](assetAmount, depositor.address);
        const newBalance = await instance.callStatic.balanceOf(
          depositor.address,
        );
        const deltaBalance = newBalance.sub(oldBalance);
        (0, chai_1.expect)(deltaBalance).to.be.closeTo(shareAmount, 1);
        (0, chai_1.expect)(deltaBalance.gte(shareAmount));
      });
      it('emits Deposit event', async () => {
        const assetAmount = hardhat_1.ethers.constants.Two;
        await args.mint(caller.address, assetAmount);
        await args.mintAsset(depositor.address, assetAmount);
        await assetInstance
          .connect(depositor)
          .approve(instance.address, assetAmount);
        const shareAmount = await instance
          .connect(depositor)
          .callStatic.previewDeposit(assetAmount);
        await (0, chai_1.expect)(
          instance
            .connect(depositor)
            ['deposit(uint256,address)'](assetAmount, depositor.address),
        )
          .to.emit(instance, 'Deposit')
          .withArgs(
            depositor.address,
            depositor.address,
            assetAmount,
            shareAmount,
          );
      });
      describe('reverts if', () => {
        it.skip('deposit amount is too large', async () => {
          await (0, chai_1.expect)(
            instance['deposit(uint256,address)'](
              hardhat_1.ethers.constants.MaxUint256,
              depositor.address,
            ),
          ).to.be.revertedWith('ERC4626: maximum amount exceeded');
        });
      });
    });
    describe('#mint(uint256,address)', () => {
      it('transfers assets from caller', async () => {
        const shareAmount = ethers_1.BigNumber.from('10');
        const assetAmount = await instance
          .connect(depositor)
          .callStatic.previewMint(shareAmount);
        await args.mintAsset(depositor.address, assetAmount);
        await assetInstance
          .connect(depositor)
          .approve(instance.address, assetAmount);
        const oldCallerBalance = await assetInstance.callStatic.balanceOf(
          depositor.address,
        );
        const oldInstanceBalance = await assetInstance.callStatic.balanceOf(
          instance.address,
        );
        await instance.connect(depositor).mint(shareAmount, depositor.address);
        const newCallerBalance = await assetInstance.callStatic.balanceOf(
          depositor.address,
        );
        const newInstanceBalance = await assetInstance.callStatic.balanceOf(
          instance.address,
        );
        const deltaCallerBalance = oldCallerBalance.sub(newCallerBalance);
        const deltaInstanceBalance = newInstanceBalance.sub(oldInstanceBalance);
        (0, chai_1.expect)(deltaCallerBalance).to.be.closeTo(assetAmount, 1);
        (0, chai_1.expect)(deltaInstanceBalance).to.be.closeTo(assetAmount, 1);
        (0, chai_1.expect)(deltaCallerBalance.lte(assetAmount));
        (0, chai_1.expect)(deltaInstanceBalance.lte(assetAmount));
      });
      it('mints shares for receiver', async () => {
        const shareAmount = ethers_1.BigNumber.from('10');
        const assetAmount = await instance
          .connect(depositor)
          .callStatic.previewMint(shareAmount);
        await args.mintAsset(depositor.address, assetAmount);
        await assetInstance
          .connect(depositor)
          .approve(instance.address, assetAmount);
        await (0, chai_1.expect)(() =>
          instance.connect(depositor).mint(shareAmount, depositor.address),
        ).to.changeTokenBalance(instance, depositor, shareAmount);
      });
      it('emits Deposit event', async () => {
        const shareAmount = ethers_1.BigNumber.from('10');
        const assetAmount = await instance
          .connect(depositor)
          .callStatic.previewMint(shareAmount);
        await args.mintAsset(depositor.address, assetAmount);
        await assetInstance
          .connect(depositor)
          .approve(instance.address, assetAmount);
        await (0, chai_1.expect)(
          instance.connect(depositor).mint(shareAmount, depositor.address),
        )
          .to.emit(instance, 'Deposit')
          .withArgs(
            depositor.address,
            depositor.address,
            assetAmount,
            shareAmount,
          );
      });
      describe('reverts if', () => {
        it.skip('mint amount is too large', async () => {
          await (0, chai_1.expect)(
            instance.mint(
              hardhat_1.ethers.constants.MaxUint256,
              depositor.address,
            ),
          ).to.be.revertedWith('ERC4626: maximum amount exceeded');
        });
      });
    });
    describe('#withdraw(uint256,address,address)', () => {
      it('transfers assets to receiver', async () => {
        const assetAmountIn = ethers_1.BigNumber.from('10');
        await args.mintAsset(depositor.address, assetAmountIn);
        await assetInstance
          .connect(depositor)
          .approve(instance.address, assetAmountIn);
        await instance
          .connect(depositor)
          ['deposit(uint256,address)'](assetAmountIn, depositor.address);
        const assetAmountOut = await instance.callStatic.convertToAssets(
          await instance.callStatic.balanceOf(depositor.address),
        );
        const shareAmount = await instance
          .connect(depositor)
          .callStatic.previewWithdraw(assetAmountOut);
        await (0, chai_1.expect)(() =>
          instance
            .connect(depositor)
            .withdraw(assetAmountOut, recipient.address, depositor.address),
        ).to.changeTokenBalances(
          assetInstance,
          [recipient, instance],
          [
            assetAmountOut,
            assetAmountOut.mul(hardhat_1.ethers.constants.NegativeOne),
          ],
        );
      });
      it('burns shares held by depositor', async () => {
        const assetAmountIn = ethers_1.BigNumber.from('10');
        await args.mintAsset(depositor.address, assetAmountIn);
        await assetInstance
          .connect(depositor)
          .approve(instance.address, assetAmountIn);
        await instance
          .connect(depositor)
          ['deposit(uint256,address)'](assetAmountIn, depositor.address);
        const assetAmountOut = await instance.callStatic.convertToAssets(
          await instance.callStatic.balanceOf(depositor.address),
        );
        const shareAmount = await instance
          .connect(depositor)
          .callStatic.previewWithdraw(assetAmountOut);
        const oldBalance = await instance.callStatic.balanceOf(
          depositor.address,
        );
        await instance
          .connect(depositor)
          .withdraw(assetAmountOut, recipient.address, depositor.address);
        const newBalance = await instance.callStatic.balanceOf(
          depositor.address,
        );
        const deltaBalance = oldBalance.sub(newBalance);
        (0, chai_1.expect)(deltaBalance).to.be.closeTo(shareAmount, 1);
        (0, chai_1.expect)(deltaBalance.lte(shareAmount));
      });
      it('emits Withdraw event', async () => {
        const assetAmountIn = ethers_1.BigNumber.from('10');
        await args.mintAsset(depositor.address, assetAmountIn);
        await assetInstance
          .connect(depositor)
          .approve(instance.address, assetAmountIn);
        await instance
          .connect(depositor)
          ['deposit(uint256,address)'](assetAmountIn, depositor.address);
        await instance
          .connect(depositor)
          .approve(caller.address, hardhat_1.ethers.constants.MaxUint256);
        const assetAmountOut = await instance.callStatic.convertToAssets(
          await instance.callStatic.balanceOf(depositor.address),
        );
        const shareAmount = await instance
          .connect(depositor)
          .callStatic.previewWithdraw(assetAmountOut);
        await (0, chai_1.expect)(
          instance
            .connect(caller)
            .withdraw(assetAmountOut, recipient.address, depositor.address),
        )
          .to.emit(instance, 'Withdraw')
          .withArgs(
            caller.address,
            recipient.address,
            depositor.address,
            assetAmountOut,
            shareAmount,
          );
      });
      describe('reverts if', () => {
        it('withdraw amount is too large', async () => {
          const assetAmount = ethers_1.BigNumber.from('10');
          const shareAmount = await instance.callStatic.convertToShares(
            assetAmount,
          );
          await args.mint(depositor.address, shareAmount);
          const max = await instance.callStatic.maxWithdraw(depositor.address);
          await (0, chai_1.expect)(
            instance.withdraw(
              max.add(hardhat_1.ethers.constants.One),
              recipient.address,
              depositor.address,
            ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC4626Base__MaximumAmountExceeded',
          );
        });
        it('share amount exceeds allowance', async () => {
          const assetAmountIn = ethers_1.BigNumber.from('10');
          await args.mintAsset(depositor.address, assetAmountIn);
          await assetInstance
            .connect(depositor)
            .approve(instance.address, assetAmountIn);
          await instance
            .connect(depositor)
            ['deposit(uint256,address)'](assetAmountIn, depositor.address);
          const assetAmountOut = await instance.callStatic.convertToAssets(
            await instance.callStatic.balanceOf(depositor.address),
          );
          await (0, chai_1.expect)(
            instance
              .connect(caller)
              .withdraw(assetAmountOut, recipient.address, depositor.address),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC4626Base__AllowanceExceeded',
          );
        });
      });
    });
    describe('#redeem(uint256,address,address)', () => {
      it('transfers assets to receiver', async () => {
        const assetAmountIn = ethers_1.BigNumber.from('10');
        await args.mintAsset(depositor.address, assetAmountIn);
        await assetInstance
          .connect(depositor)
          .approve(instance.address, assetAmountIn);
        await instance
          .connect(depositor)
          ['deposit(uint256,address)'](assetAmountIn, depositor.address);
        const shareAmount = await instance.callStatic.balanceOf(
          depositor.address,
        );
        const assetAmountOut = await instance
          .connect(depositor)
          .callStatic.previewRedeem(shareAmount);
        const oldInstanceBalance = await assetInstance.callStatic.balanceOf(
          instance.address,
        );
        const oldReceiverBalance = await assetInstance.callStatic.balanceOf(
          recipient.address,
        );
        await instance
          .connect(depositor)
          ['redeem(uint256,address,address)'](
            shareAmount,
            recipient.address,
            depositor.address,
          );
        const newInstanceBalance = await assetInstance.callStatic.balanceOf(
          instance.address,
        );
        const newReceiverBalance = await assetInstance.callStatic.balanceOf(
          recipient.address,
        );
        const deltaInstanceBalance = oldInstanceBalance.sub(newInstanceBalance);
        const deltaReceiverBalance = newReceiverBalance.sub(oldReceiverBalance);
        (0, chai_1.expect)(deltaInstanceBalance).to.be.closeTo(
          assetAmountOut,
          1,
        );
        (0, chai_1.expect)(deltaReceiverBalance).to.be.closeTo(
          assetAmountOut,
          1,
        );
        (0, chai_1.expect)(deltaInstanceBalance.gte(assetAmountOut));
        (0, chai_1.expect)(deltaReceiverBalance.gte(assetAmountOut));
      });
      it('burns shares held by depositor', async () => {
        const assetAmountIn = ethers_1.BigNumber.from('10');
        await args.mintAsset(depositor.address, assetAmountIn);
        await assetInstance
          .connect(depositor)
          .approve(instance.address, assetAmountIn);
        await instance
          .connect(depositor)
          ['deposit(uint256,address)'](assetAmountIn, depositor.address);
        const shareAmount = await instance.callStatic.balanceOf(
          depositor.address,
        );
        await (0, chai_1.expect)(() =>
          instance
            .connect(depositor)
            ['redeem(uint256,address,address)'](
              shareAmount,
              recipient.address,
              depositor.address,
            ),
        ).to.changeTokenBalance(
          instance,
          depositor,
          shareAmount.mul(hardhat_1.ethers.constants.NegativeOne),
        );
      });
      it('emits Withdraw event', async () => {
        const assetAmountIn = ethers_1.BigNumber.from('10');
        await args.mintAsset(depositor.address, assetAmountIn);
        await assetInstance
          .connect(depositor)
          .approve(instance.address, assetAmountIn);
        await instance
          .connect(depositor)
          ['deposit(uint256,address)'](assetAmountIn, depositor.address);
        await instance
          .connect(depositor)
          .approve(caller.address, hardhat_1.ethers.constants.MaxUint256);
        const shareAmount = await instance.callStatic.balanceOf(
          depositor.address,
        );
        const assetAmountOut = await instance
          .connect(depositor)
          .callStatic.previewRedeem(shareAmount);
        await (0, chai_1.expect)(
          instance
            .connect(caller)
            ['redeem(uint256,address,address)'](
              shareAmount,
              recipient.address,
              depositor.address,
            ),
        )
          .to.emit(instance, 'Withdraw')
          .withArgs(
            caller.address,
            recipient.address,
            depositor.address,
            assetAmountOut,
            shareAmount,
          );
      });
      describe('reverts if', () => {
        it('redeem amount is too large', async () => {
          const shareAmount = hardhat_1.ethers.constants.Two;
          await args.mint(depositor.address, shareAmount);
          const max = await instance.callStatic.maxRedeem(depositor.address);
          await (0, chai_1.expect)(
            instance['redeem(uint256,address,address)'](
              max.add(hardhat_1.ethers.constants.One),
              recipient.address,
              depositor.address,
            ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC4626Base__MaximumAmountExceeded',
          );
        });
        it('share amount exceeds allowance', async () => {
          const shareAmount = hardhat_1.ethers.constants.Two;
          await args.mint(depositor.address, shareAmount);
          await (0, chai_1.expect)(
            instance
              .connect(caller)
              ['redeem(uint256,address,address)'](
                shareAmount,
                recipient.address,
                depositor.address,
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC4626Base__AllowanceExceeded',
          );
        });
      });
    });
  });
}
exports.describeBehaviorOfERC4626Base = describeBehaviorOfERC4626Base;
