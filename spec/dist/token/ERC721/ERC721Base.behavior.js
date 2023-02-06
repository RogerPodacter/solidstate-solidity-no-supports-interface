'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfERC721Base = void 0;
const introspection_1 = require('../../introspection');
const mock_contract_1 = require('@ethereum-waffle/mock-contract');
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfERC721Base(deploy, { mint, burn }, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ERC721Base', function () {
    let holder;
    let spender;
    let receiver;
    let sender;
    let instance;
    before(async function () {
      // TODO: move to behavior args
      [holder, spender, receiver, sender] = await hardhat_1.ethers.getSigners();
    });
    beforeEach(async function () {
      instance = await deploy();
    });
    // TODO: nonstandard usage
    (0, introspection_1.describeBehaviorOfERC165Base)(
      deploy,
      {
        interfaceIds: ['0x80ac58cd'],
      },
      skips,
    );
    describe('#balanceOf(address)', function () {
      it('returns the token balance of given address', async function () {
        (0, chai_1.expect)(
          await instance.callStatic['balanceOf(address)'](holder.address),
        ).to.equal(hardhat_1.ethers.constants.Zero);
        const tokenId = hardhat_1.ethers.constants.Two;
        await (0, chai_1.expect)(() =>
          mint(holder.address, tokenId),
        ).to.changeTokenBalance(
          instance,
          holder,
          hardhat_1.ethers.constants.One,
        );
        await (0, chai_1.expect)(() => burn(tokenId)).to.changeTokenBalance(
          instance,
          holder,
          -hardhat_1.ethers.constants.One,
        );
      });
      describe('reverts if', function () {
        it('queried address is the zero address', async function () {
          await (0, chai_1.expect)(
            instance.callStatic.balanceOf(
              hardhat_1.ethers.constants.AddressZero,
            ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC721Base__BalanceQueryZeroAddress',
          );
        });
      });
    });
    describe('#ownerOf(uint256)', function () {
      it('returns the owner of given token', async function () {
        const tokenId = hardhat_1.ethers.constants.Two;
        await mint(holder.address, tokenId);
        (0, chai_1.expect)(await instance.callStatic.ownerOf(tokenId)).to.equal(
          holder.address,
        );
      });
      describe('reverts if', function () {
        it('token does not exist', async function () {
          await (0, chai_1.expect)(
            instance.callStatic.ownerOf(hardhat_1.ethers.constants.Two),
          ).to.be.revertedWithCustomError(
            instance,
            'EnumerableMap__NonExistentKey',
          );
        });
        it('owner is zero address');
      });
    });
    describe('#getApproved(uint256)', function () {
      it('returns approved spender of given token', async function () {
        const tokenId = hardhat_1.ethers.constants.Two;
        await mint(holder.address, tokenId);
        (0, chai_1.expect)(
          await instance.callStatic.getApproved(tokenId),
        ).to.equal(hardhat_1.ethers.constants.AddressZero);
        await instance.connect(holder).approve(instance.address, tokenId);
        (0, chai_1.expect)(
          await instance.callStatic.getApproved(tokenId),
        ).to.equal(instance.address);
        await instance
          .connect(holder)
          .approve(hardhat_1.ethers.constants.AddressZero, tokenId);
        (0, chai_1.expect)(
          await instance.callStatic.getApproved(tokenId),
        ).to.equal(hardhat_1.ethers.constants.AddressZero);
      });
      describe('reverts if', function () {
        it('token does not exist', async function () {
          await (0, chai_1.expect)(
            instance.callStatic.getApproved(hardhat_1.ethers.constants.Two),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC721Base__NonExistentToken',
          );
        });
      });
    });
    describe('#isApprovedForAll(address,address)', function () {
      it('returns whether given operator is approved to spend all tokens of given holder', async function () {
        (0, chai_1.expect)(
          await instance.callStatic.isApprovedForAll(
            holder.address,
            spender.address,
          ),
        ).to.be.false;
        await instance.connect(holder).setApprovalForAll(spender.address, true);
        (0, chai_1.expect)(
          await instance.callStatic.isApprovedForAll(
            holder.address,
            spender.address,
          ),
        ).to.be.true;
        await instance
          .connect(holder)
          .setApprovalForAll(spender.address, false);
        (0, chai_1.expect)(
          await instance.callStatic.isApprovedForAll(
            holder.address,
            spender.address,
          ),
        ).to.be.false;
      });
    });
    describe('#transferFrom(address,address,uint256)', function () {
      it('transfers token on behalf of holder', async function () {
        const tokenId = hardhat_1.ethers.constants.Two;
        await mint(holder.address, tokenId);
        await instance.connect(holder).approve(spender.address, tokenId);
        await (0, chai_1.expect)(() =>
          instance
            .connect(spender)
            .transferFrom(holder.address, receiver.address, tokenId),
        ).to.changeTokenBalances(
          instance,
          [holder, receiver],
          [
            hardhat_1.ethers.constants.NegativeOne,
            hardhat_1.ethers.constants.One,
          ],
        );
      });
      it('updates owner of token', async function () {
        const tokenId = hardhat_1.ethers.constants.Two;
        await mint(holder.address, tokenId);
        await instance.connect(holder).approve(spender.address, tokenId);
        (0, chai_1.expect)(await instance.callStatic.ownerOf(tokenId)).to.equal(
          holder.address,
        );
        await instance
          .connect(spender)
          .transferFrom(holder.address, receiver.address, tokenId);
        (0, chai_1.expect)(await instance.callStatic.ownerOf(tokenId)).to.equal(
          receiver.address,
        );
      });
      it('emits Transfer event', async function () {
        const tokenId = hardhat_1.ethers.constants.Two;
        await mint(holder.address, tokenId);
        await instance.connect(holder).approve(spender.address, tokenId);
        await (0, chai_1.expect)(
          instance
            .connect(spender)
            .transferFrom(holder.address, receiver.address, tokenId),
        )
          .to.emit(instance, 'Transfer')
          .withArgs(holder.address, receiver.address, tokenId);
      });
      it('does not revert if recipient is not ERC721Receiver implementer', async function () {
        const tokenId = hardhat_1.ethers.constants.Two;
        await mint(holder.address, tokenId);
        // TODO: test against contract other than self
        await (0, chai_1.expect)(
          instance
            .connect(holder)
            .transferFrom(holder.address, instance.address, tokenId),
        ).not.to.be.reverted;
      });
      it('does not revert if recipient is ERC721Receiver implementer but does not accept transfer', async function () {
        const tokenId = hardhat_1.ethers.constants.Two;
        await mint(holder.address, tokenId);
        const receiverContract = await (0, mock_contract_1.deployMockContract)(
          sender,
          [
            'function onERC721Received (address, address, uint256, bytes) returns (bytes4)',
          ],
        );
        await receiverContract.mock.onERC721Received.returns(
          hardhat_1.ethers.utils.randomBytes(4),
        );
        await (0, chai_1.expect)(
          instance
            .connect(holder)
            .transferFrom(holder.address, receiverContract.address, tokenId),
        ).not.to.be.reverted;
      });
      describe('reverts if', function () {
        it('caller is neither owner of token nor authorized to spend it', async function () {
          const tokenId = hardhat_1.ethers.constants.Two;
          await mint(holder.address, tokenId);
          await (0, chai_1.expect)(
            instance
              .connect(spender)
              .transferFrom(
                holder.address,
                hardhat_1.ethers.constants.AddressZero,
                tokenId,
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC721Base__NotOwnerOrApproved',
          );
        });
        it('receiver is the zero address', async function () {
          const tokenId = hardhat_1.ethers.constants.Two;
          await mint(holder.address, tokenId);
          await instance.connect(holder).approve(spender.address, tokenId);
          await (0, chai_1.expect)(
            instance
              .connect(spender)
              .transferFrom(
                holder.address,
                hardhat_1.ethers.constants.AddressZero,
                tokenId,
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC721Base__TransferToZeroAddress',
          );
        });
      });
    });
    describe('#safeTransferFrom(address,address,uint256)', function () {
      it('transfers token on behalf of holder', async function () {
        const tokenId = hardhat_1.ethers.constants.Two;
        await mint(holder.address, tokenId);
        await instance.connect(holder).approve(spender.address, tokenId);
        await (0, chai_1.expect)(() =>
          instance
            .connect(spender)
            ['safeTransferFrom(address,address,uint256)'](
              holder.address,
              receiver.address,
              tokenId,
            ),
        ).to.changeTokenBalances(
          instance,
          [holder, receiver],
          [
            hardhat_1.ethers.constants.NegativeOne,
            hardhat_1.ethers.constants.One,
          ],
        );
      });
      it('updates owner of token', async function () {
        const tokenId = hardhat_1.ethers.constants.Two;
        await mint(holder.address, tokenId);
        await instance.connect(holder).approve(spender.address, tokenId);
        (0, chai_1.expect)(await instance.callStatic.ownerOf(tokenId)).to.equal(
          holder.address,
        );
        await instance
          .connect(spender)
          ['safeTransferFrom(address,address,uint256)'](
            holder.address,
            receiver.address,
            tokenId,
          );
        (0, chai_1.expect)(await instance.callStatic.ownerOf(tokenId)).to.equal(
          receiver.address,
        );
      });
      it('emits Transfer event', async function () {
        const tokenId = hardhat_1.ethers.constants.Two;
        await mint(holder.address, tokenId);
        await instance.connect(holder).approve(spender.address, tokenId);
        await (0, chai_1.expect)(
          instance
            .connect(spender)
            ['safeTransferFrom(address,address,uint256)'](
              holder.address,
              receiver.address,
              tokenId,
            ),
        )
          .to.emit(instance, 'Transfer')
          .withArgs(holder.address, receiver.address, tokenId);
      });
      describe('reverts if', function () {
        it('caller is neither owner of token nor authorized to spend it', async function () {
          const tokenId = hardhat_1.ethers.constants.Two;
          await mint(holder.address, tokenId);
          await (0, chai_1.expect)(
            instance
              .connect(spender)
              ['safeTransferFrom(address,address,uint256)'](
                holder.address,
                hardhat_1.ethers.constants.AddressZero,
                tokenId,
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC721Base__NotOwnerOrApproved',
          );
        });
        it('receiver is the zero address', async function () {
          const tokenId = hardhat_1.ethers.constants.Two;
          await mint(holder.address, tokenId);
          await instance.connect(holder).approve(spender.address, tokenId);
          await (0, chai_1.expect)(
            instance
              .connect(spender)
              ['safeTransferFrom(address,address,uint256)'](
                holder.address,
                hardhat_1.ethers.constants.AddressZero,
                tokenId,
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC721Base__TransferToZeroAddress',
          );
        });
        it('recipient is not ERC721Receiver implementer', async function () {
          const tokenId = hardhat_1.ethers.constants.Two;
          await mint(holder.address, tokenId);
          // TODO: test against contract other than self
          await (0, chai_1.expect)(
            instance
              .connect(holder)
              ['safeTransferFrom(address,address,uint256)'](
                holder.address,
                instance.address,
                tokenId,
              ),
          ).to.be.revertedWith(
            'ERC721: transfer to non ERC721Receiver implementer',
          );
        });
        it('recipient is ERC721Receiver implementer but does not accept transfer', async function () {
          const tokenId = hardhat_1.ethers.constants.Two;
          await mint(holder.address, tokenId);
          const receiverContract = await (0,
          mock_contract_1.deployMockContract)(sender, [
            'function onERC721Received (address, address, uint256, bytes) returns (bytes4)',
          ]);
          await receiverContract.mock.onERC721Received.returns(
            hardhat_1.ethers.utils.randomBytes(4),
          );
          await (0, chai_1.expect)(
            instance
              .connect(holder)
              ['safeTransferFrom(address,address,uint256)'](
                holder.address,
                receiverContract.address,
                tokenId,
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC721Base__ERC721ReceiverNotImplemented',
          );
        });
      });
    });
    describe('#safeTransferFrom(address,address,uint256,bytes)', function () {
      it('transfers token on behalf of holder', async function () {
        const tokenId = hardhat_1.ethers.constants.Two;
        await mint(holder.address, tokenId);
        await instance.connect(holder).approve(spender.address, tokenId);
        await (0, chai_1.expect)(() =>
          instance
            .connect(spender)
            ['safeTransferFrom(address,address,uint256,bytes)'](
              holder.address,
              receiver.address,
              tokenId,
              '0x',
            ),
        ).to.changeTokenBalances(
          instance,
          [holder, receiver],
          [
            hardhat_1.ethers.constants.NegativeOne,
            hardhat_1.ethers.constants.One,
          ],
        );
      });
      it('updates owner of token', async function () {
        const tokenId = hardhat_1.ethers.constants.Two;
        await mint(holder.address, tokenId);
        await instance.connect(holder).approve(spender.address, tokenId);
        (0, chai_1.expect)(await instance.callStatic.ownerOf(tokenId)).to.equal(
          holder.address,
        );
        await instance
          .connect(spender)
          ['safeTransferFrom(address,address,uint256,bytes)'](
            holder.address,
            receiver.address,
            tokenId,
            '0x',
          );
        (0, chai_1.expect)(await instance.callStatic.ownerOf(tokenId)).to.equal(
          receiver.address,
        );
      });
      it('emits Transfer event', async function () {
        const tokenId = hardhat_1.ethers.constants.Two;
        await mint(holder.address, tokenId);
        await instance.connect(holder).approve(spender.address, tokenId);
        await (0, chai_1.expect)(
          instance
            .connect(spender)
            ['safeTransferFrom(address,address,uint256,bytes)'](
              holder.address,
              receiver.address,
              tokenId,
              '0x',
            ),
        )
          .to.emit(instance, 'Transfer')
          .withArgs(holder.address, receiver.address, tokenId);
      });
      describe('reverts if', function () {
        it('caller is neither owner of token nor authorized to spend it', async function () {
          const tokenId = hardhat_1.ethers.constants.Two;
          await mint(holder.address, tokenId);
          await (0, chai_1.expect)(
            instance
              .connect(spender)
              ['safeTransferFrom(address,address,uint256,bytes)'](
                holder.address,
                hardhat_1.ethers.constants.AddressZero,
                tokenId,
                '0x',
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC721Base__NotOwnerOrApproved',
          );
        });
        it('receiver is the zero address', async function () {
          const tokenId = hardhat_1.ethers.constants.Two;
          await mint(holder.address, tokenId);
          await instance.connect(holder).approve(spender.address, tokenId);
          await (0, chai_1.expect)(
            instance
              .connect(spender)
              ['safeTransferFrom(address,address,uint256,bytes)'](
                holder.address,
                hardhat_1.ethers.constants.AddressZero,
                tokenId,
                '0x',
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC721Base__TransferToZeroAddress',
          );
        });
        it('recipient is not ERC721Receiver implementer', async function () {
          const tokenId = hardhat_1.ethers.constants.Two;
          await mint(holder.address, tokenId);
          // TODO: test against contract other than self
          await (0, chai_1.expect)(
            instance
              .connect(holder)
              ['safeTransferFrom(address,address,uint256,bytes)'](
                holder.address,
                instance.address,
                tokenId,
                '0x',
              ),
          ).to.be.revertedWith(
            'ERC721: transfer to non ERC721Receiver implementer',
          );
        });
        it('recipient is ERC721Receiver implementer but does not accept transfer', async function () {
          const tokenId = hardhat_1.ethers.constants.Two;
          await mint(holder.address, tokenId);
          const receiverContract = await (0,
          mock_contract_1.deployMockContract)(sender, [
            'function onERC721Received (address, address, uint256, bytes) returns (bytes4)',
          ]);
          await receiverContract.mock.onERC721Received.returns(
            hardhat_1.ethers.utils.randomBytes(4),
          );
          await (0, chai_1.expect)(
            instance
              .connect(holder)
              ['safeTransferFrom(address,address,uint256,bytes)'](
                holder.address,
                receiverContract.address,
                tokenId,
                '0x',
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC721Base__ERC721ReceiverNotImplemented',
          );
        });
      });
    });
    describe('#approve(address,uint256)', function () {
      it('grants approval to spend given token on behalf of holder', async function () {
        const tokenId = hardhat_1.ethers.constants.Two;
        await mint(holder.address, tokenId);
        (0, chai_1.expect)(
          await instance.callStatic.getApproved(tokenId),
        ).to.equal(hardhat_1.ethers.constants.AddressZero);
        await instance.connect(holder).approve(spender.address, tokenId);
        (0, chai_1.expect)(
          await instance.callStatic.getApproved(tokenId),
        ).to.equal(spender.address);
        await (0, chai_1.expect)(
          instance
            .connect(spender)
            .callStatic.transferFrom(holder.address, spender.address, tokenId),
        ).not.to.be.reverted;
        await instance
          .connect(holder)
          .approve(hardhat_1.ethers.constants.AddressZero, tokenId);
        await (0, chai_1.expect)(
          instance
            .connect(spender)
            .callStatic.transferFrom(holder.address, spender.address, tokenId),
        ).to.be.reverted;
      });
      it('emits Approval event', async function () {
        const tokenId = hardhat_1.ethers.constants.Two;
        await mint(holder.address, tokenId);
        await (0, chai_1.expect)(
          instance.connect(holder).approve(spender.address, tokenId),
        )
          .to.emit(instance, 'Approval')
          .withArgs(holder.address, spender.address, tokenId);
      });
      it('does not revert if sender is approved to spend all tokens held by owner', async function () {
        const tokenId = hardhat_1.ethers.constants.Two;
        await mint(holder.address, tokenId);
        await instance
          .connect(holder)
          .setApprovalForAll(receiver.address, true);
        await (0, chai_1.expect)(
          instance.connect(receiver).approve(receiver.address, tokenId),
        ).not.to.be.reverted;
      });
      describe('reverts if', function () {
        it('spender is current owner of given token', async function () {
          const tokenId = hardhat_1.ethers.constants.Two;
          await mint(holder.address, tokenId);
          await (0, chai_1.expect)(
            instance.connect(holder).approve(holder.address, tokenId),
          ).to.be.revertedWithCustomError(instance, 'ERC721Base__SelfApproval');
        });
        it('sender is not owner of given token', async function () {
          const tokenId = hardhat_1.ethers.constants.Two;
          await mint(holder.address, tokenId);
          await (0, chai_1.expect)(
            instance.connect(receiver).approve(receiver.address, tokenId),
          ).to.be.revertedWithCustomError(
            instance,
            'ERC721Base__NotOwnerOrApproved',
          );
        });
      });
    });
    describe('#setApprovalForAll(address,bool)', function () {
      it('grants and revokes approval to spend tokens on behalf of holder', async function () {
        const tokenId = hardhat_1.ethers.constants.Two;
        await mint(holder.address, tokenId);
        await instance.connect(holder).setApprovalForAll(spender.address, true);
        await (0, chai_1.expect)(
          instance
            .connect(spender)
            .callStatic.transferFrom(holder.address, spender.address, tokenId),
        ).not.to.be.reverted;
        await instance
          .connect(holder)
          .setApprovalForAll(spender.address, false);
        await (0, chai_1.expect)(
          instance
            .connect(spender)
            .callStatic.transferFrom(holder.address, spender.address, tokenId),
        ).to.be.reverted;
      });
      it('emits ApprovalForAll event', async function () {
        await (0, chai_1.expect)(
          instance.connect(holder).setApprovalForAll(spender.address, true),
        )
          .to.emit(instance, 'ApprovalForAll')
          .withArgs(holder.address, spender.address, true);
        await (0, chai_1.expect)(
          instance.connect(holder).setApprovalForAll(spender.address, true),
        )
          .to.emit(instance, 'ApprovalForAll')
          .withArgs(holder.address, spender.address, true);
      });
      describe('reverts if', function () {
        it('given operator is sender', async function () {
          await (0, chai_1.expect)(
            instance.connect(holder).setApprovalForAll(holder.address, true),
          ).to.be.revertedWithCustomError(instance, 'ERC721Base__SelfApproval');
        });
      });
    });
  });
}
exports.describeBehaviorOfERC721Base = describeBehaviorOfERC721Base;
