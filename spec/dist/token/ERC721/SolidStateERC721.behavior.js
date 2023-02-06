'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfSolidStateERC721 = void 0;
const ERC721Base_behavior_1 = require('./ERC721Base.behavior');
const ERC721Enumerable_behavior_1 = require('./ERC721Enumerable.behavior');
const ERC721Metadata_behavior_1 = require('./ERC721Metadata.behavior');
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfSolidStateERC721(
  deploy,
  { supply, mint, burn, name, symbol, tokenURI },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::SolidStateERC721', function () {
    let holder;
    let instance;
    before(async function () {
      [holder] = await hardhat_1.ethers.getSigners();
    });
    beforeEach(async function () {
      instance = await deploy();
    });
    (0, ERC721Base_behavior_1.describeBehaviorOfERC721Base)(
      deploy,
      {
        supply,
        mint,
        burn,
      },
      skips,
    );
    (0, ERC721Enumerable_behavior_1.describeBehaviorOfERC721Enumerable)(
      deploy,
      {
        supply,
        mint,
        burn,
      },
      skips,
    );
    (0, ERC721Metadata_behavior_1.describeBehaviorOfERC721Metadata)(
      deploy,
      {
        name,
        symbol,
        tokenURI,
      },
      skips,
    );
    describe('#transferFrom(address,address,uint256)', function () {
      describe('reverts if', function () {
        it('value is included in transaction', async function () {
          const tokenId = hardhat_1.ethers.constants.Two;
          await mint(holder.address, tokenId);
          await (0, chai_1.expect)(
            instance
              .connect(holder)
              .transferFrom(holder.address, holder.address, tokenId, {
                value: hardhat_1.ethers.constants.One,
              }),
          ).to.be.revertedWithCustomError(
            instance,
            'SolidStateERC721__PayableTransferNotSupported',
          );
        });
      });
    });
    describe('#safeTransferFrom(address,address,uint256)', function () {
      describe('reverts if', function () {
        it('value is included in transaction', async function () {
          const tokenId = hardhat_1.ethers.constants.Two;
          await mint(holder.address, tokenId);
          await (0, chai_1.expect)(
            instance
              .connect(holder)
              ['safeTransferFrom(address,address,uint256)'](
                holder.address,
                holder.address,
                tokenId,
                { value: hardhat_1.ethers.constants.One },
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'SolidStateERC721__PayableTransferNotSupported',
          );
        });
      });
    });
    describe('#safeTransferFrom(address,address,uint256,bytes)', function () {
      describe('reverts if', function () {
        it('value is included in transaction', async function () {
          const tokenId = hardhat_1.ethers.constants.Two;
          await mint(holder.address, tokenId);
          await (0, chai_1.expect)(
            instance
              .connect(holder)
              ['safeTransferFrom(address,address,uint256,bytes)'](
                holder.address,
                holder.address,
                tokenId,
                '0x',
                { value: hardhat_1.ethers.constants.One },
              ),
          ).to.be.revertedWithCustomError(
            instance,
            'SolidStateERC721__PayableTransferNotSupported',
          );
        });
      });
    });
    describe('#approve(address,uint256)', function () {
      describe('reverts if', function () {
        it('value is included in transaction', async function () {
          const tokenId = hardhat_1.ethers.constants.Two;
          await mint(holder.address, tokenId);
          await (0, chai_1.expect)(
            instance
              .connect(holder)
              .approve(hardhat_1.ethers.constants.AddressZero, tokenId, {
                value: hardhat_1.ethers.constants.One,
              }),
          ).to.be.revertedWithCustomError(
            instance,
            'SolidStateERC721__PayableApproveNotSupported',
          );
        });
      });
    });
  });
}
exports.describeBehaviorOfSolidStateERC721 = describeBehaviorOfSolidStateERC721;
