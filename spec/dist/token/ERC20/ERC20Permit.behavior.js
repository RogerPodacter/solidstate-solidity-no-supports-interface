'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfERC20Permit = void 0;
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfERC20Permit(deploy, args, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ERC20Permit', function () {
    let holder;
    let spender;
    let thirdParty;
    let instance;
    beforeEach(async function () {
      [holder, spender, thirdParty] = await hardhat_1.ethers.getSigners();
      instance = await deploy();
    });
    describe('#DOMAIN_SEPARATOR()', () => {
      it('todo');
    });
    describe('#nonces(address)', () => {
      it('todo');
    });
    describe('#permit(address,address,uint256,uint256,uint8,bytes32,bytes32)', function () {
      it('should increase allowance using permit', async () => {
        const { timestamp } = await hardhat_1.ethers.provider.getBlock(
          'latest',
        );
        const amount = hardhat_1.ethers.constants.Two;
        const deadline = timestamp + 100;
        const permit = await (0, library_1.signERC2612Permit)(
          hardhat_1.ethers.provider,
          instance.address,
          holder.address,
          spender.address,
          amount.toString(),
          deadline,
        );
        await hardhat_1.ethers.provider.send('evm_setNextBlockTimestamp', [
          deadline,
        ]);
        await instance
          .connect(thirdParty)
          .permit(
            holder.address,
            spender.address,
            amount,
            deadline,
            permit.v,
            permit.r,
            permit.s,
          );
        (0, chai_1.expect)(
          await args.allowance(holder.address, spender.address),
        ).to.eq(amount);
      });
      describe('reverts if', () => {
        it('deadline has passed', async () => {
          const { timestamp } = await hardhat_1.ethers.provider.getBlock(
            'latest',
          );
          const amount = hardhat_1.ethers.constants.Two;
          const deadline = timestamp + 100;
          const permit = await (0, library_1.signERC2612Permit)(
            hardhat_1.ethers.provider,
            instance.address,
            holder.address,
            spender.address,
            amount.toString(),
            deadline,
          );
          await hardhat_1.ethers.provider.send('evm_setNextBlockTimestamp', [
            deadline + 1,
          ]);
          await (0, chai_1.expect)(
            instance
              .connect(thirdParty)
              .permit(
                holder.address,
                spender.address,
                amount,
                deadline,
                permit.v,
                permit.r,
                permit.s,
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC20Permit__ExpiredDeadline',
          );
        });
        it('signature is invalid', async () => {
          const { timestamp } = await hardhat_1.ethers.provider.getBlock(
            'latest',
          );
          const amount = hardhat_1.ethers.constants.Two;
          const deadline = timestamp + 100;
          const permit = await (0, library_1.signERC2612Permit)(
            hardhat_1.ethers.provider,
            instance.address,
            holder.address,
            spender.address,
            amount.toString(),
            deadline,
          );
          await hardhat_1.ethers.provider.send('evm_setNextBlockTimestamp', [
            deadline,
          ]);
          await (0, chai_1.expect)(
            instance
              .connect(thirdParty)
              .permit(
                holder.address,
                spender.address,
                amount,
                deadline,
                permit.v,
                '0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
                permit.s,
              ),
          ).to.be.revertedWithCustomError(instance, 'ECDSA__InvalidSignature');
        });
        it('signature has already been used', async () => {
          const { timestamp } = await hardhat_1.ethers.provider.getBlock(
            'latest',
          );
          const amount = hardhat_1.ethers.constants.Two;
          const deadline = timestamp + 100;
          const permit = await (0, library_1.signERC2612Permit)(
            hardhat_1.ethers.provider,
            instance.address,
            holder.address,
            spender.address,
            amount.toString(),
            deadline,
          );
          await hardhat_1.ethers.provider.send('evm_setNextBlockTimestamp', [
            deadline - 1,
          ]);
          await instance
            .connect(thirdParty)
            .permit(
              holder.address,
              spender.address,
              amount,
              deadline,
              permit.v,
              permit.r,
              permit.s,
            );
          await hardhat_1.ethers.provider.send('evm_setNextBlockTimestamp', [
            deadline,
          ]);
          await (0, chai_1.expect)(
            instance
              .connect(thirdParty)
              .permit(
                holder.address,
                spender.address,
                amount,
                deadline,
                permit.v,
                permit.r,
                permit.s,
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC20Permit__InvalidSignature',
          );
        });
      });
    });
  });
}
exports.describeBehaviorOfERC20Permit = describeBehaviorOfERC20Permit;
