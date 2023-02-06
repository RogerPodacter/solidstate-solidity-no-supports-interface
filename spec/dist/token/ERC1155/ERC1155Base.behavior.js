'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfERC1155Base = void 0;
const introspection_1 = require('../../introspection');
const mock_contract_1 = require('@ethereum-waffle/mock-contract');
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfERC1155Base(deploy, { mint, burn, tokenId }, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ERC1155Base', function () {
    let holder;
    let spender;
    let instance;
    before(async function () {
      [holder, spender] = await hardhat_1.ethers.getSigners();
    });
    beforeEach(async function () {
      instance = await deploy();
    });
    // TODO: nonstandard usage
    (0, introspection_1.describeBehaviorOfERC165Base)(
      deploy,
      {
        interfaceIds: ['0xd9b67a26'],
      },
      skips,
    );
    describe('#balanceOf(address,uint256)', function () {
      it('returns the balance of given token held by given address', async function () {
        const id =
          tokenId !== null && tokenId !== void 0
            ? tokenId
            : hardhat_1.ethers.constants.Zero;
        (0, chai_1.expect)(
          await instance.callStatic['balanceOf(address,uint256)'](
            holder.address,
            id,
          ),
        ).to.equal(0);
        const amount = hardhat_1.ethers.constants.Two;
        await mint(holder.address, id, amount);
        (0, chai_1.expect)(
          await instance.callStatic['balanceOf(address,uint256)'](
            holder.address,
            id,
          ),
        ).to.equal(amount);
        await burn(holder.address, id, amount);
        (0, chai_1.expect)(
          await instance.callStatic['balanceOf(address,uint256)'](
            holder.address,
            id,
          ),
        ).to.equal(0);
      });
      describe('reverts if', function () {
        it('balance of zero address is queried', async function () {
          await (0, chai_1.expect)(
            instance.callStatic['balanceOf(address,uint256)'](
              hardhat_1.ethers.constants.AddressZero,
              hardhat_1.ethers.constants.Zero,
            ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC1155Base__BalanceQueryZeroAddress',
          );
        });
      });
    });
    describe('#balanceOfBatch(address[],uint256[])', function () {
      it('returns the balances of given tokens held by given addresses', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['balanceOfBatch(address[],uint256[])'](
            [holder.address],
            [hardhat_1.ethers.constants.Zero],
          ),
        ).to.have.deep.members([hardhat_1.ethers.constants.Zero]);
        // TODO: test delta
      });
      describe('reverts if', function () {
        it('input array lengths do not match', async function () {
          await (0, chai_1.expect)(
            instance.callStatic['balanceOfBatch(address[],uint256[])'](
              [holder.address],
              [],
            ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC1155Base__ArrayLengthMismatch',
          );
        });
        it('balance of zero address is queried', async function () {
          await (0, chai_1.expect)(
            instance.callStatic['balanceOfBatch(address[],uint256[])'](
              [hardhat_1.ethers.constants.AddressZero],
              [hardhat_1.ethers.constants.Zero],
            ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC1155Base__BalanceQueryZeroAddress',
          );
        });
      });
    });
    describe('#isApprovedForAll(address,address)', function () {
      it('returns whether given operator is approved to spend tokens of given account', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['isApprovedForAll(address,address)'](
            holder.address,
            spender.address,
          ),
        ).to.be.false;
        await instance
          .connect(holder)
          ['setApprovalForAll(address,bool)'](spender.address, true);
        (0, chai_1.expect)(
          await instance.callStatic['isApprovedForAll(address,address)'](
            holder.address,
            spender.address,
          ),
        ).to.be.true;
      });
    });
    describe('#setApprovalForAll(address,bool)', function () {
      it('approves given operator to spend tokens on behalf of sender', async function () {
        await instance
          .connect(holder)
          ['setApprovalForAll(address,bool)'](spender.address, true);
        (0, chai_1.expect)(
          await instance.callStatic['isApprovedForAll(address,address)'](
            holder.address,
            spender.address,
          ),
        ).to.be.true;
        // TODO: test case is no different from #isApprovedForAll test; tested further by #safeTransferFrom and #safeBatchTransferFrom tests
      });
      describe('reverts if', function () {
        it('given operator is sender', async function () {
          await (0, chai_1.expect)(
            instance
              .connect(holder)
              ['setApprovalForAll(address,bool)'](holder.address, true),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC1155Base__SelfApproval',
          );
        });
      });
    });
    describe('#safeTransferFrom(address,address,uint256,uint256,bytes)', function () {
      it('sends amount from A to B', async function () {
        const id =
          tokenId !== null && tokenId !== void 0
            ? tokenId
            : hardhat_1.ethers.constants.Zero;
        const amount = hardhat_1.ethers.constants.Two;
        await mint(spender.address, id, amount);
        (0, chai_1.expect)(
          await instance.callStatic['balanceOf(address,uint256)'](
            spender.address,
            id,
          ),
        ).to.equal(amount);
        await instance
          .connect(spender)
          ['safeTransferFrom(address,address,uint256,uint256,bytes)'](
            spender.address,
            holder.address,
            id,
            amount,
            hardhat_1.ethers.utils.randomBytes(0),
          );
        (0, chai_1.expect)(
          await instance.callStatic['balanceOf(address,uint256)'](
            spender.address,
            id,
          ),
        ).to.equal(hardhat_1.ethers.constants.Zero);
        (0, chai_1.expect)(
          await instance.callStatic['balanceOf(address,uint256)'](
            holder.address,
            id,
          ),
        ).to.equal(amount);
      });
      describe('reverts if', function () {
        it('sender has insufficient balance', async function () {
          const id =
            tokenId !== null && tokenId !== void 0
              ? tokenId
              : hardhat_1.ethers.constants.Zero;
          const amount = hardhat_1.ethers.constants.Two;
          await (0, chai_1.expect)(
            instance
              .connect(spender)
              ['safeTransferFrom(address,address,uint256,uint256,bytes)'](
                spender.address,
                holder.address,
                id,
                amount,
                hardhat_1.ethers.utils.randomBytes(0),
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC1155Base__TransferExceedsBalance',
          );
        });
        it('operator is not approved to act on behalf of sender', async function () {
          await (0, chai_1.expect)(
            instance
              .connect(holder)
              ['safeTransferFrom(address,address,uint256,uint256,bytes)'](
                spender.address,
                holder.address,
                hardhat_1.ethers.constants.Zero,
                hardhat_1.ethers.constants.Zero,
                hardhat_1.ethers.utils.randomBytes(0),
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC1155Base__NotOwnerOrApproved',
          );
        });
        it('receiver is invalid ERC1155Receiver', async function () {
          const mock = await (0, mock_contract_1.deployMockContract)(holder, [
            /* no functions */
          ]);
          await (0, chai_1.expect)(
            instance
              .connect(spender)
              ['safeTransferFrom(address,address,uint256,uint256,bytes)'](
                spender.address,
                mock.address,
                hardhat_1.ethers.constants.Zero,
                hardhat_1.ethers.constants.Zero,
                hardhat_1.ethers.utils.randomBytes(0),
              ),
          ).to.be.revertedWith('Mock on the method is not initialized');
        });
        it('receiver rejects transfer', async function () {
          const mock = await (0, mock_contract_1.deployMockContract)(holder, [
            'function onERC1155Received (address, address, uint, uint, bytes) external view returns (bytes4)',
          ]);
          await mock.mock.onERC1155Received.returns('0x00000000');
          await (0, chai_1.expect)(
            instance
              .connect(spender)
              ['safeTransferFrom(address,address,uint256,uint256,bytes)'](
                spender.address,
                mock.address,
                hardhat_1.ethers.constants.Zero,
                hardhat_1.ethers.constants.Zero,
                hardhat_1.ethers.utils.randomBytes(0),
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC1155Base__ERC1155ReceiverRejected',
          );
        });
      });
    });
    describe('#safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)', function () {
      it('sends amount from A to B, batch version', async function () {
        const id =
          tokenId !== null && tokenId !== void 0
            ? tokenId
            : hardhat_1.ethers.constants.Zero;
        const amount = hardhat_1.ethers.constants.Two;
        await mint(spender.address, id, amount);
        (0, chai_1.expect)(
          await instance.callStatic['balanceOfBatch(address[],uint256[])'](
            [spender.address],
            [id],
          ),
        ).to.have.deep.members([amount]);
        await instance
          .connect(spender)
          ['safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)'](
            spender.address,
            holder.address,
            [id],
            [amount],
            hardhat_1.ethers.utils.randomBytes(0),
          );
        (0, chai_1.expect)(
          await instance.callStatic['balanceOfBatch(address[],uint256[])'](
            [spender.address],
            [id],
          ),
        ).to.have.deep.members([hardhat_1.ethers.constants.Zero]);
        (0, chai_1.expect)(
          await instance.callStatic['balanceOfBatch(address[],uint256[])'](
            [holder.address],
            [id],
          ),
        ).to.have.deep.members([amount]);
      });
      describe('reverts if', function () {
        it('sender has insufficient balance', async function () {
          const id =
            tokenId !== null && tokenId !== void 0
              ? tokenId
              : hardhat_1.ethers.constants.Zero;
          const amount = hardhat_1.ethers.constants.Two;
          await (0, chai_1.expect)(
            instance
              .connect(spender)
              [
                'safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)'
              ](
                spender.address,
                holder.address,
                [id],
                [amount],
                hardhat_1.ethers.utils.randomBytes(0),
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC1155Base__TransferExceedsBalance',
          );
        });
        it('operator is not approved to act on behalf of sender', async function () {
          await (0, chai_1.expect)(
            instance
              .connect(holder)
              [
                'safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)'
              ](
                spender.address,
                holder.address,
                [],
                [],
                hardhat_1.ethers.utils.randomBytes(0),
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC1155Base__NotOwnerOrApproved',
          );
        });
        it('receiver is invalid ERC1155Receiver', async function () {
          const mock = await (0, mock_contract_1.deployMockContract)(holder, [
            /* no functions */
          ]);
          await (0, chai_1.expect)(
            instance
              .connect(spender)
              [
                'safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)'
              ](
                spender.address,
                mock.address,
                [],
                [],
                hardhat_1.ethers.utils.randomBytes(0),
              ),
          ).to.be.revertedWith('Mock on the method is not initialized');
        });
        it('receiver rejects transfer', async function () {
          const mock = await (0, mock_contract_1.deployMockContract)(holder, [
            'function onERC1155BatchReceived (address, address, uint[], uint[], bytes) external view returns (bytes4)',
          ]);
          await mock.mock.onERC1155BatchReceived.returns('0x00000000');
          await (0, chai_1.expect)(
            instance
              .connect(spender)
              [
                'safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)'
              ](
                spender.address,
                mock.address,
                [],
                [],
                hardhat_1.ethers.utils.randomBytes(0),
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC1155Base__ERC1155ReceiverRejected',
          );
        });
      });
    });
  });
}
exports.describeBehaviorOfERC1155Base = describeBehaviorOfERC1155Base;
