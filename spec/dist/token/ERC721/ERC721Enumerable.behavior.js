'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfERC721Enumerable = void 0;
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfERC721Enumerable(
  deploy,
  { mint, burn, supply },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ERC721Enumerable', function () {
    let instance;
    beforeEach(async function () {
      instance = await deploy();
    });
    describe('#totalSupply()', function () {
      it('returns total token supply', async function () {
        (0, chai_1.expect)(await instance.totalSupply()).to.equal(supply);
        await mint(instance.address, hardhat_1.ethers.constants.Two);
        (0, chai_1.expect)(await instance.totalSupply()).to.equal(
          supply.add(hardhat_1.ethers.constants.One),
        );
        await burn(hardhat_1.ethers.constants.Two);
        (0, chai_1.expect)(await instance.totalSupply()).to.equal(supply);
      });
    });
    describe('#tokenOfOwnerByIndex(address,uint256)', function () {
      it('returns token id held by given account at given index', async function () {
        // TODO: query balance to determine starting index
        await (0, chai_1.expect)(
          instance.callStatic.tokenOfOwnerByIndex(
            instance.address,
            hardhat_1.ethers.constants.Zero,
          ),
        ).to.be.revertedWithCustomError(
          instance,
          'EnumerableSet__IndexOutOfBounds',
        );
        await (0, chai_1.expect)(
          instance.callStatic.tokenOfOwnerByIndex(
            instance.address,
            hardhat_1.ethers.constants.One,
          ),
        ).to.be.revertedWithCustomError(
          instance,
          'EnumerableSet__IndexOutOfBounds',
        );
        await mint(instance.address, hardhat_1.ethers.constants.One);
        await mint(instance.address, hardhat_1.ethers.constants.Two);
        (0, chai_1.expect)(
          await instance.callStatic.tokenOfOwnerByIndex(
            instance.address,
            hardhat_1.ethers.constants.Zero,
          ),
        ).to.equal(hardhat_1.ethers.constants.One);
        (0, chai_1.expect)(
          await instance.callStatic.tokenOfOwnerByIndex(
            instance.address,
            hardhat_1.ethers.constants.One,
          ),
        ).to.equal(hardhat_1.ethers.constants.Two);
      });
    });
    describe('#tokenByIndex(uint256)', function () {
      it('returns token id held globally at given index', async function () {
        const index = await instance.callStatic.totalSupply();
        await (0, chai_1.expect)(
          instance.callStatic.tokenByIndex(
            index.add(hardhat_1.ethers.constants.Zero),
          ),
        ).to.be.revertedWithCustomError(
          instance,
          'EnumerableMap__IndexOutOfBounds',
        );
        await (0, chai_1.expect)(
          instance.callStatic.tokenByIndex(
            index.add(hardhat_1.ethers.constants.One),
          ),
        ).to.be.revertedWithCustomError(
          instance,
          'EnumerableMap__IndexOutOfBounds',
        );
        // TODO: mint to different addresses
        await mint(instance.address, hardhat_1.ethers.constants.One);
        await mint(instance.address, hardhat_1.ethers.constants.Two);
        (0, chai_1.expect)(
          await instance.callStatic.tokenByIndex(
            index.add(hardhat_1.ethers.constants.Zero),
          ),
        ).to.equal(hardhat_1.ethers.constants.One);
        (0, chai_1.expect)(
          await instance.callStatic.tokenByIndex(
            index.add(hardhat_1.ethers.constants.One),
          ),
        ).to.equal(hardhat_1.ethers.constants.Two);
      });
    });
  });
}
exports.describeBehaviorOfERC721Enumerable = describeBehaviorOfERC721Enumerable;
