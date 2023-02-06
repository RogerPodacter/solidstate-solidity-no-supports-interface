'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfERC1155Enumerable = void 0;
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfERC1155Enumerable(
  deploy,
  { transfer, mint, burn, tokenId },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ERC1155Enumerable', function () {
    let instance;
    beforeEach(async function () {
      instance = await deploy();
    });
    describe('#totalSupply(uint256)', function () {
      it('returns supply of given token', async function () {
        const [holder0, holder1] = await hardhat_1.ethers.getSigners();
        const id =
          tokenId !== null && tokenId !== void 0
            ? tokenId
            : hardhat_1.ethers.constants.Zero;
        const amount = hardhat_1.ethers.constants.Two;
        (0, chai_1.expect)(
          await instance.callStatic['totalSupply(uint256)'](id),
        ).to.equal(0);
        await mint(holder0.address, id, amount);
        (0, chai_1.expect)(
          await instance.callStatic['totalSupply(uint256)'](id),
        ).to.equal(amount);
        await transfer(holder0, holder1, id, amount);
        (0, chai_1.expect)(
          await instance.callStatic['totalSupply(uint256)'](id),
        ).to.equal(amount);
        await burn(holder1.address, id, amount);
        (0, chai_1.expect)(
          await instance.callStatic['totalSupply(uint256)'](id),
        ).to.equal(0);
      });
    });
    describe('#totalHolders(uint256)', function () {
      it('returns number of holders of given token', async function () {
        const [holder0, holder1] = await hardhat_1.ethers.getSigners();
        const id =
          tokenId !== null && tokenId !== void 0
            ? tokenId
            : hardhat_1.ethers.constants.Zero;
        const amount = hardhat_1.ethers.constants.Two;
        (0, chai_1.expect)(
          await instance.callStatic['totalHolders(uint256)'](id),
        ).to.equal(0);
        await mint(holder0.address, id, amount);
        (0, chai_1.expect)(
          await instance.callStatic['totalHolders(uint256)'](id),
        ).to.equal(1);
        await transfer(holder0, holder1, id, amount);
        (0, chai_1.expect)(
          await instance.callStatic['totalHolders(uint256)'](id),
        ).to.equal(1);
        await burn(holder1.address, id, amount);
        (0, chai_1.expect)(
          await instance.callStatic['totalHolders(uint256)'](id),
        ).to.equal(0);
      });
    });
    describe('#accountsByToken(uint256)', function () {
      it('returns list of addresses holding given token', async function () {
        const [holder0, holder1] = await hardhat_1.ethers.getSigners();
        const id =
          tokenId !== null && tokenId !== void 0
            ? tokenId
            : hardhat_1.ethers.constants.Zero;
        const amount = hardhat_1.ethers.constants.Two;
        (0, chai_1.expect)(
          await instance.callStatic['accountsByToken(uint256)'](id),
        ).to.eql([]);
        await mint(holder0.address, id, amount);
        (0, chai_1.expect)(
          await instance.callStatic['accountsByToken(uint256)'](id),
        ).to.eql([holder0.address]);
        await transfer(holder0, holder1, id, amount);
        (0, chai_1.expect)(
          await instance.callStatic['accountsByToken(uint256)'](id),
        ).to.eql([holder1.address]);
        await burn(holder1.address, id, amount);
        (0, chai_1.expect)(
          await instance.callStatic['accountsByToken(uint256)'](id),
        ).to.eql([]);
      });
    });
    describe('#tokensByAccount(address)', function () {
      it('returns list of tokens held by given address', async function () {
        const [holder0, holder1] = await hardhat_1.ethers.getSigners();
        const id =
          tokenId !== null && tokenId !== void 0
            ? tokenId
            : hardhat_1.ethers.constants.Zero;
        const amount = hardhat_1.ethers.constants.Two;
        (0, chai_1.expect)(
          await instance.callStatic['tokensByAccount(address)'](
            holder0.address,
          ),
        ).to.eql([]);
        (0, chai_1.expect)(
          await instance.callStatic['tokensByAccount(address)'](
            holder1.address,
          ),
        ).to.eql([]);
        await mint(holder0.address, id, amount);
        (0, chai_1.expect)(
          await instance.callStatic['tokensByAccount(address)'](
            holder0.address,
          ),
        ).to.eql([id]);
        (0, chai_1.expect)(
          await instance.callStatic['tokensByAccount(address)'](
            holder1.address,
          ),
        ).to.eql([]);
        await transfer(holder0, holder1, id, amount);
        (0, chai_1.expect)(
          await instance.callStatic['tokensByAccount(address)'](
            holder0.address,
          ),
        ).to.eql([]);
        (0, chai_1.expect)(
          await instance.callStatic['tokensByAccount(address)'](
            holder1.address,
          ),
        ).to.eql([id]);
        await burn(holder1.address, id, amount);
        (0, chai_1.expect)(
          await instance.callStatic['tokensByAccount(address)'](
            holder0.address,
          ),
        ).to.eql([]);
        (0, chai_1.expect)(
          await instance.callStatic['tokensByAccount(address)'](
            holder1.address,
          ),
        ).to.eql([]);
      });
    });
  });
}
exports.describeBehaviorOfERC1155Enumerable =
  describeBehaviorOfERC1155Enumerable;
