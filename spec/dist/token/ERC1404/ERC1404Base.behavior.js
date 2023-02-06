'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.describeBehaviorOfERC1404Base = void 0;
const ERC20_1 = require('../ERC20');
const library_1 = require('@solidstate/library');
const chai_1 = require('chai');
const hardhat_1 = require('hardhat');
function describeBehaviorOfERC1404Base(
  deploy,
  { restrictions, mint, burn, supply },
  skips,
) {
  const describe = (0, library_1.describeFilter)(skips);
  describe('::ERC1404Base', function () {
    let instance;
    beforeEach(async function () {
      instance = await deploy();
    });
    (0, ERC20_1.describeBehaviorOfERC20Base)(
      deploy,
      {
        supply,
        mint,
        burn,
      },
      skips,
    );
    // TODO: transfers blocked if restriction exists
    describe('#detectTransferRestriction(address,address,uint256)', function () {
      it('returns zero if no restriction exists', async function () {
        (0, chai_1.expect)(
          await instance.callStatic.detectTransferRestriction(
            hardhat_1.ethers.constants.AddressZero,
            hardhat_1.ethers.constants.AddressZero,
            hardhat_1.ethers.constants.One,
          ),
        ).to.equal(0);
      });
    });
    describe('#messageForTransferRestriction(uint8)', function () {
      it('returns empty string for unknown restriction code', async function () {
        (0, chai_1.expect)(
          await instance.callStatic.messageForTransferRestriction(255),
        ).to.equal('');
      });
      for (let restriction of restrictions) {
        it(`returns "${restriction.message}" for code ${restriction.code}`, async function () {
          (0, chai_1.expect)(
            await instance.callStatic.messageForTransferRestriction(
              restriction.code,
            ),
          ).to.equal(restriction.message);
        });
      }
    });
  });
}
exports.describeBehaviorOfERC1404Base = describeBehaviorOfERC1404Base;
