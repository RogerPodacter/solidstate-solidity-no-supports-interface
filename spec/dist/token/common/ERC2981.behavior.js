'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfERC2981 = void 0;
const introspection_1 = require('../../introspection');
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const ethers_1 = require('ethers');
const hardhat_1 = require('hardhat');
function describeBehaviorOfERC2981(deploy, skips) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ERC2981', function () {
    let tokenIdOne = ethers_1.BigNumber.from(1);
    let tokenIdTwo = ethers_1.BigNumber.from(2);
    let tokenIdThree = ethers_1.BigNumber.from(3);
    let receiver;
    let instance;
    before(async function () {
      receiver = (await hardhat_1.ethers.getSigners())[1];
      instance = await deploy();
    });
    (0, introspection_1.describeBehaviorOfERC165Base)(
      deploy,
      {
        interfaceIds: ['0x2a55205a'],
      },
      skips,
    );
    describe('#royaltyInfo()', () => {
      it('returns 0 if salePrice is 0', async function () {
        const [, royaltyAmount] = await instance.royaltyInfo(
          0,
          ethers_1.BigNumber.from(0),
        );
        (0, chai_1.expect)(royaltyAmount).to.equal(ethers_1.BigNumber.from(0));
      });
      it('returns receiver address', async function () {
        const [recipient] = await instance.royaltyInfo(
          0,
          ethers_1.BigNumber.from(0),
        );
        (0, chai_1.expect)(recipient).to.equal(await receiver.getAddress());
      });
      it('calculates royalty using global if local does not exist', async function () {
        let [, royaltyAmount] = await instance.royaltyInfo(0, 10000);
        (0, chai_1.expect)(royaltyAmount).to.equal(
          ethers_1.BigNumber.from(10000),
        );
      });
      it('calculates royalty using local', async function () {
        let [, royaltyAmount] = await instance.royaltyInfo(tokenIdOne, 10000);
        (0, chai_1.expect)(royaltyAmount).to.equal(
          ethers_1.BigNumber.from(100),
        );
        [, royaltyAmount] = await instance.royaltyInfo(tokenIdTwo, 10000);
        (0, chai_1.expect)(royaltyAmount).to.equal(
          ethers_1.BigNumber.from(1000),
        );
      });
    });
  });
}
exports.describeBehaviorOfERC2981 = describeBehaviorOfERC2981;
